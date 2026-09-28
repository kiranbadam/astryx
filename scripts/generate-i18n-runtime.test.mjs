// Copyright (c) Meta Platforms, Inc. and affiliates.

import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {fileURLToPath} from 'node:url';
import {describe, expect, it} from 'vitest';
import {
  MAX_RUNTIME_CATALOG_GZIP_BYTES,
  assertRuntimeCatalogSize,
  createPublishedCatalog,
  createPublishedCatalogs,
  createRuntimeCatalog,
  createSpawnInvocation,
  getRuntimeCatalogGzipBytes,
  isSourceLocaleFile,
  renderRuntimeCatalogFile,
} from './generate-i18n-runtime.mjs';

const GENERATOR = fileURLToPath(
  new URL('./generate-i18n-runtime.mjs', import.meta.url),
);
const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));

function waitForMatch(stream, pattern, timeoutMs = 5_000) {
  return new Promise((resolve, reject) => {
    let output = '';
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error(`Timed out waiting for ${pattern} in:\n${output}`));
    }, timeoutMs);
    const onData = chunk => {
      output += chunk;
      const match = output.match(pattern);
      if (match) {
        cleanup();
        resolve(match);
      }
    };
    const cleanup = () => {
      clearTimeout(timeout);
      stream.off('data', onData);
    };
    stream.on('data', onData);
  });
}

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

describe('locale source watcher', () => {
  it('regenerates for authored locale JSON but ignores generated pseudo output', () => {
    expect(isSourceLocaleFile('en.json')).toBe(true);
    expect(isSourceLocaleFile('fr-FR.json')).toBe(true);
    expect(isSourceLocaleFile('pseudo.json')).toBe(false);
    expect(isSourceLocaleFile('README.md')).toBe(false);
    expect(isSourceLocaleFile(Buffer.from('en.json'))).toBe(false);
  });

  it('constructs Windows commands only from shell-safe tokens', () => {
    expect(
      createSpawnInvocation(
        ['pnpm', '--parallel', '--filter', '@astryxdesign/core', 'dev:i18n'],
        'win32',
        'cmd.exe',
      ),
    ).toEqual({
      file: 'cmd.exe',
      args: [
        '/d',
        '/s',
        '/c',
        'pnpm --parallel --filter @astryxdesign/core dev:i18n',
      ],
    });
    expect(() =>
      createSpawnInvocation(['tool', 'argument with spaces'], 'win32'),
    ).toThrow('cannot contain spaces or shell metacharacters');
    expect(() =>
      createSpawnInvocation(['tool', 'value&next'], 'win32'),
    ).toThrow('cannot contain spaces or shell metacharacters');
  });

  it.skipIf(process.platform === 'win32')(
    'forwards repeated termination signals until the child exits',
    async () => {
      const childCode = `
        let exitTimer;
        process.on('SIGINT', () => {
          clearTimeout(exitTimer);
          exitTimer = setTimeout(() => process.exit(0), 250);
        });
        console.log('child-ready:' + process.pid);
        setInterval(() => {}, 1_000);
      `;
      const wrapper = spawn(
        process.execPath,
        [GENERATOR, '--watch', '--', process.execPath, '-e', childCode],
        {
          cwd: REPO_ROOT,
          stdio: ['ignore', 'pipe', 'pipe'],
        },
      );
      let childPid;

      try {
        const match = await waitForMatch(wrapper.stdout, /child-ready:(\d+)/);
        childPid = Number(match[1]);
        wrapper.kill('SIGINT');
        await new Promise(resolve => setTimeout(resolve, 50));
        wrapper.kill('SIGINT');
        const [code, signal] = await Promise.race([
          once(wrapper, 'exit'),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('wrapper did not exit')), 5_000),
          ),
        ]);

        expect(signal).toBeNull();
        expect(code).toBe(0);
        expect(() => process.kill(childPid, 0)).toThrow();
      } finally {
        if (wrapper.exitCode === null) wrapper.kill('SIGKILL');
        if (childPid !== undefined) {
          try {
            process.kill(childPid, 'SIGKILL');
          } catch {
            // The expected path: the wrapper already reaped its child.
          }
        }
      }
    },
    10_000,
  );
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
