// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, expect, it} from 'vitest';
import {
  MAX_RUNTIME_CATALOG_GZIP_BYTES,
  assertRuntimeCatalogSize,
  createPublishedCatalog,
  createPublishedCatalogs,
  createRuntimeCatalog,
  getRuntimeCatalogGzipBytes,
  renderRuntimeCatalogFile,
} from './generate-i18n-runtime.mjs';

describe('createRuntimeCatalog', () => {
  it('keeps runtime messages and drops translator metadata', () => {
    const runtimeCatalog = createRuntimeCatalog({
      '@astryx.button.submit': {
        defaultMessage: 'Submit',
        description: 'Visible label for the primary submit button.',
      },
      '@astryx.pagination.page': {
        defaultMessage: 'Page {page, number}',
        description: 'Accessible page label.',
        screenshot: 'translator-only-context.png',
      },
    });

    expect(runtimeCatalog).toEqual({
      '@astryx.button.submit': 'Submit',
      '@astryx.pagination.page': 'Page {page, number}',
    });
    expect(JSON.stringify(runtimeCatalog)).not.toContain('description');
    expect(JSON.stringify(runtimeCatalog)).not.toContain('translator-only');
  });

  it('rejects entries without a runtime message', () => {
    expect(() =>
      createRuntimeCatalog({
        '@astryx.button.submit': {description: 'Translator context only.'},
      }),
    ).toThrow('missing string "defaultMessage"');
  });
});

describe('createPublishedCatalog', () => {
  it('preserves the public entry shape without translator metadata', () => {
    const catalog = createPublishedCatalog({
      '@astryx.button.submit': {
        defaultMessage: 'Envoyer',
        description: 'Visible submit label.',
        screenshot: 'submit.png',
      },
    });

    expect(catalog).toEqual({
      '@astryx.button.submit': {defaultMessage: 'Envoyer'},
    });
    expect(JSON.stringify(catalog)).not.toContain('description');
    expect(JSON.stringify(catalog)).not.toContain('screenshot');
  });

  it('adds a metadata-free pseudo catalog to shipped locales', () => {
    const catalogs = createPublishedCatalogs({
      'en.json': {
        '@astryx.button.submit': {
          defaultMessage: 'Submit',
          description: 'Visible submit label.',
        },
      },
      'fr-FR.json': {
        '@astryx.button.submit': {
          defaultMessage: 'Envoyer',
          description: 'Visible submit label.',
        },
      },
    });

    expect(Object.keys(catalogs)).toEqual([
      'en.json',
      'fr-FR.json',
      'pseudo.json',
    ]);
    expect(catalogs['pseudo.json']['@astryx.button.submit']).toEqual({
      defaultMessage: '⟦Šúƀɱíţ⟧',
    });
    expect(JSON.stringify(catalogs)).not.toContain('description');
  });
});

describe('runtime catalog size guard', () => {
  it('reports the gzip size used by the guard', () => {
    const runtimeCatalog = {'@astryx.button.submit': 'Submit'};
    expect(assertRuntimeCatalogSize(runtimeCatalog)).toBe(
      getRuntimeCatalogGzipBytes(runtimeCatalog),
    );
    expect(getRuntimeCatalogGzipBytes(runtimeCatalog)).toBeLessThan(
      MAX_RUNTIME_CATALOG_GZIP_BYTES,
    );
  });

  it('rejects a catalog above the coarse-splitting threshold', () => {
    const oversizedCatalog = Object.fromEntries(
      Array.from({length: 4_000}, (_, index) => [
        `@astryx.fixture.key${index}`,
        `Message ${index} ${(index * 2_654_435_761).toString(36)}`,
      ]),
    );

    expect(() => assertRuntimeCatalogSize(oversizedCatalog)).toThrow(
      'Revisit coarse catalog splitting',
    );
  });
});

describe('renderRuntimeCatalogFile', () => {
  it('emits a string-only TypeScript catalog', async () => {
    const output = await renderRuntimeCatalogFile({
      '@astryx.button.submit': 'Submit',
    });

    expect(output).toContain('export const enCatalog');
    expect(output).toContain("'@astryx.button.submit': 'Submit'");
    expect(output).not.toContain('"description"');
  });
});
