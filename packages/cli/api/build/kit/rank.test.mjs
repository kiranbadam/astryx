// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file Tests for build's page ranker: long ideas, head nouns, family bases,
 * rare-word weighting, and family words taken from the templates themselves.
 */

import {describe, it, expect} from 'vitest';
import * as path from 'node:path';
import {fileURLToPath} from 'node:url';
import {pickStart, rankPages} from './rank.mjs';
import {loadPageTemplates} from '../_adapter.mjs';

// api/build/kit/ -> up 5 = repo root (has packages/core and the templates).
const REPO = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../../..',
);

/** @param {string} name @param {string} category @param {string} description */
const page = (name, category, description) => ({
  name,
  displayName: name,
  category,
  description,
});

describe('rankPages on the shipped page templates', () => {
  /** @param {string} query */
  const start = async query =>
    pickStart(rankPages(query, await loadPageTemplates(REPO)))?.name ?? null;

  it('starts a long dashboard idea from the family base', async () => {
    expect(
      await start('ops dashboard with a KPI row, a sortable table and a trend chart'),
    ).toBe('dashboard');
  });

  it("lets a variant's own words beat the base", async () => {
    expect(
      await start('conversion funnel dashboard with drop-off and retention by cohort'),
    ).toBe('dashboard-cohort-funnel');
    expect(await start('program milestone tracker with delivery status')).toBe(
      'dashboard-progress',
    );
  });

  it('lets the head noun decide between families', async () => {
    // Both ideas mention a table and summary numbers; the head says which
    // page it is.
    expect(
      await start('audit dashboard: dense filterable data table with a KPI stat row'),
    ).toMatch(/^dashboard/);
    expect(
      await start('a data table of campaigns with spend and revenue, plus summary metrics above it'),
    ).toMatch(/^table-/);
  });

  it('does not start from one rare word', async () => {
    // "board" is the kanban board's own word; a game board is not a kanban.
    expect(await start('accessible responsive tic-tac-toe game board')).toBeNull();
  });
});

describe('rankPages on any catalog', () => {
  it('ranks only the templates it is given', () => {
    const ranked = rankPages('dashboard', [
      page('dashboard', 'Dashboard - Analytics', 'Tiles, charts, tables. Dashboard, metrics.'),
    ]);
    expect(ranked.map(r => r.name)).toEqual(['dashboard']);
  });

  it('takes family words from template ids, so a new family needs no list', () => {
    // An integration's family: its word is in two of its ids, so an idea
    // naming it picks the family, and its base template leads it.
    const catalog = [
      page('dashboard', 'Dashboard - Analytics', 'Tiles, charts, tables. Dashboard, metrics.'),
      page('widget', 'Widget - Basic', 'One compact card. Widget, tile.'),
      page('widget-grid', 'Widget - Grid', 'Many compact cards in a grid. Widget wall.'),
    ];
    const ranked = rankPages('weather widget with charts', catalog);
    expect(ranked[0].name).toBe('widget');
    expect(ranked[0].familyNamed).toBe(true);
    expect(pickStart(ranked)?.name).toBe('widget');
  });

  it('weighs a word by how rare it is among page templates', () => {
    const catalog = [
      page('alpha', 'Dashboard - Alpha', 'Status tiles. Status overview.'),
      page('beta', 'Dashboard - Beta', 'Status rows. Status list.'),
      page('gamma', 'Dashboard - Gamma', 'Funnel of stages. Funnel conversion.'),
    ];
    // "status" is on two templates, "funnel" on one: the rare word wins.
    const ranked = rankPages('status funnel', catalog);
    expect(ranked[0].name).toBe('gamma');
  });
});
