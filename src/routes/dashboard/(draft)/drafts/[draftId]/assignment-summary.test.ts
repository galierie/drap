import { describe, expect, test } from 'vitest';

import {
  buildInterventionsAggregate,
  buildLotteryAggregate,
  ordinalChoice,
} from './assignment-summary';

describe('ordinalChoice', () => {
  test('produces "1st Choice" for rank 1', () => {
    expect(ordinalChoice(1)).toBe('1st Choice');
  });

  test('produces "2nd Choice" for rank 2', () => {
    expect(ordinalChoice(2)).toBe('2nd Choice');
  });

  test('produces "3rd Choice" for rank 3', () => {
    expect(ordinalChoice(3)).toBe('3rd Choice');
  });

  test('produces "11th Choice" for rank 11 (teen exception)', () => {
    expect(ordinalChoice(11)).toBe('11th Choice');
  });

  test('produces "12th Choice" for rank 12 (teen exception)', () => {
    expect(ordinalChoice(12)).toBe('12th Choice');
  });

  test('produces "21st Choice" for rank 21', () => {
    expect(ordinalChoice(21)).toBe('21st Choice');
  });
});

describe('buildLotteryAggregate', () => {
  const LABS = [
    { id: 'csl', name: 'CSL' },
    { id: 'ndsl', name: 'NDSL' },
  ];

  test('returns zero-shaped aggregate for empty input', () => {
    const result = buildLotteryAggregate([], LABS);

    expect(result.statCards).toEqual({
      poolSize: 0,
      topChoice: 0,
      rankedLab: 0,
      unranked: 0,
      medianRankHonored: null,
    });
    expect(result.outcomeStacks).toEqual([]);
  });

  test('single lab, single ranked placement at rank 1', () => {
    const result = buildLotteryAggregate([{ labId: 'csl', preferenceRank: 1n, count: 3 }], LABS);

    expect(result.statCards.poolSize).toBe(3);
    expect(result.statCards.topChoice).toBe(3);
    expect(result.statCards.rankedLab).toBe(3);
    expect(result.statCards.unranked).toBe(0);
    expect(result.statCards.medianRankHonored).toBe(1);

    expect(result.outcomeStacks).toHaveLength(1);
    const [stack] = result.outcomeStacks;
    expect(stack).toMatchObject({ labId: 'csl', labName: 'CSL', total: 3 });
    expect(stack!.buckets).toEqual([{ rank: 1, label: '1st Choice', count: 3 }]);
  });

  test('mixed ranked and unranked placements — ranked buckets sorted ascending, null last', () => {
    const result = buildLotteryAggregate(
      [
        { labId: 'csl', preferenceRank: 3n, count: 2 },
        { labId: 'csl', preferenceRank: null, count: 1 },
        { labId: 'csl', preferenceRank: 1n, count: 4 },
      ],
      LABS,
    );

    expect(result.statCards.poolSize).toBe(7);
    expect(result.statCards.topChoice).toBe(4);
    expect(result.statCards.rankedLab).toBe(6);
    expect(result.statCards.unranked).toBe(1);

    const [stack] = result.outcomeStacks;
    expect(stack!.buckets).toEqual([
      { rank: 1, label: '1st Choice', count: 4 },
      { rank: 3, label: '3rd Choice', count: 2 },
      { rank: null, label: 'Not Preferred', count: 1 },
    ]);
  });

  test('cross-lab rank ordering: each stack sorted by rank regardless of label string', () => {
    // Lab A has only rank 3; Lab B has only rank 1.
    // allRankedRanks must be [1, 3] so each stack's bucket list follows numeric order.
    const result = buildLotteryAggregate(
      [
        { labId: 'csl', preferenceRank: 3n, count: 2 },
        { labId: 'ndsl', preferenceRank: 1n, count: 5 },
      ],
      LABS,
    );

    const cslStack = result.outcomeStacks.find(s => s.labId === 'csl');
    const ndslStack = result.outcomeStacks.find(s => s.labId === 'ndsl');

    // CSL only has rank-3 placements; rank-1 bucket absent (count 0, not emitted).
    expect(cslStack!.buckets).toEqual([{ rank: 3, label: '3rd Choice', count: 2 }]);
    // NDSL only has rank-1 placements.
    expect(ndslStack!.buckets).toEqual([{ rank: 1, label: '1st Choice', count: 5 }]);
  });

  test('outcomeStacks are sorted alphabetically by lab name', () => {
    const result = buildLotteryAggregate(
      [
        { labId: 'ndsl', preferenceRank: 1n, count: 1 },
        { labId: 'csl', preferenceRank: 1n, count: 1 },
      ],
      LABS,
    );

    expect(result.outcomeStacks.map(s => s.labId)).toEqual(['csl', 'ndsl']);
  });

  test('medianRankHonored is null when all placements are unranked', () => {
    const result = buildLotteryAggregate([{ labId: 'csl', preferenceRank: null, count: 5 }], LABS);

    expect(result.statCards.medianRankHonored).toBeNull();
    expect(result.statCards.unranked).toBe(5);
    expect(result.statCards.rankedLab).toBe(0);
  });

  test('medianRankHonored is the median rank across all ranked placements', () => {
    // Ranks: [1,1,1, 2,2, 3] → n=6, target=3, cumulative reaches 3 at rank 1.
    const result = buildLotteryAggregate(
      [
        { labId: 'csl', preferenceRank: 1n, count: 3 },
        { labId: 'csl', preferenceRank: 2n, count: 2 },
        { labId: 'csl', preferenceRank: 3n, count: 1 },
      ],
      LABS,
    );

    expect(result.statCards.medianRankHonored).toBe(1);
  });

  test('counts from unknown lab ids use labId as fallback name', () => {
    const result = buildLotteryAggregate(
      [{ labId: 'unknown', preferenceRank: 1n, count: 1 }],
      LABS,
    );

    const [stack] = result.outcomeStacks;
    expect(stack!.labName).toBe('unknown');
  });
});

describe('buildInterventionsAggregate', () => {
  const SNAPSHOTS = [
    { labId: 'csl', labName: 'CSL', initialQuota: 5, lotteryQuota: 4 },
    { labId: 'ndsl', labName: 'NDSL', initialQuota: 3, lotteryQuota: 3 },
  ];
  const MAX_ROUNDS = 3;

  test('returns zero-shaped aggregate for empty input', () => {
    const result = buildInterventionsAggregate(10, [], SNAPSHOTS, MAX_ROUNDS);

    expect(result.statCards).toEqual({ poolSize: 10, totalLotteryQuota: 7, delta: 3 });
    expect(result.dumbbellRows).toHaveLength(2);
    // naturalLeftover = initialQuota - 0 when no regular rows
    expect(result.dumbbellRows.find(r => r.labId === 'csl')!.naturalLeftover).toBe(5);
    expect(result.dumbbellRows.find(r => r.labId === 'ndsl')!.naturalLeftover).toBe(3);
  });

  test('naturalLeftover uses only regular-round rows (round <= maxRounds)', () => {
    const counts = [
      { labId: 'csl', round: 1, count: 2 }, // regular round
      { labId: 'csl', round: 3, count: 1 }, // regular round (= maxRounds)
    ];
    const result = buildInterventionsAggregate(10, counts, SNAPSHOTS, MAX_ROUNDS);

    const csl = result.dumbbellRows.find(r => r.labId === 'csl')!;
    // filled = 2 + 1 = 3; naturalLeftover = 5 - 3 = 2
    expect(csl.naturalLeftover).toBe(2);
    // poolSize = 10 - 3 = 7 (only non-lottery rows count)
    expect(result.statCards.poolSize).toBe(7);
  });

  test('intervention-round rows decrease poolSize but not naturalLeftover', () => {
    const counts = [
      { labId: 'csl', round: 1, count: 2 }, // regular
      { labId: 'csl', round: MAX_ROUNDS + 1, count: 1 }, // intervention
    ];
    const result = buildInterventionsAggregate(10, counts, SNAPSHOTS, MAX_ROUNDS);

    const csl = result.dumbbellRows.find(r => r.labId === 'csl')!;
    // naturalLeftover only sees regular round: 5 - 2 = 3
    expect(csl.naturalLeftover).toBe(3);
    // poolSize sees both regular + intervention: 10 - (2 + 1) = 7
    expect(result.statCards.poolSize).toBe(7);
  });

  test('lottery rows (round = null) are excluded from both naturalLeftover and poolSize', () => {
    const counts = [
      { labId: 'csl', round: 1, count: 2 }, // regular
      { labId: 'csl', round: null, count: 3 }, // lottery — must not count
    ];
    const result = buildInterventionsAggregate(10, counts, SNAPSHOTS, MAX_ROUNDS);

    const csl = result.dumbbellRows.find(r => r.labId === 'csl')!;
    expect(csl.naturalLeftover).toBe(3); // 5 - 2 (only regular)
    expect(result.statCards.poolSize).toBe(8); // 10 - 2 (lottery not subtracted)
  });

  test('round === maxRounds counts as regular, round === maxRounds + 1 counts as intervention', () => {
    const counts = [
      { labId: 'ndsl', round: MAX_ROUNDS, count: 2 }, // last regular round
      { labId: 'ndsl', round: MAX_ROUNDS + 1, count: 1 }, // intervention round
    ];
    const result = buildInterventionsAggregate(10, counts, SNAPSHOTS, MAX_ROUNDS);

    const ndsl = result.dumbbellRows.find(r => r.labId === 'ndsl')!;
    // Only round 3 (= maxRounds) feeds naturalLeftover: 3 - 2 = 1
    expect(ndsl.naturalLeftover).toBe(1);
    // Both rows feed poolSize: 10 - 3 = 7
    expect(result.statCards.poolSize).toBe(7);
  });

  test('gap = lotteryQuota - naturalLeftover, sorted by |gap| descending', () => {
    // CSL: naturalLeftover=5, lotteryQuota=4, gap=-1
    // NDSL: naturalLeftover=3, lotteryQuota=3, gap=0
    const result = buildInterventionsAggregate(10, [], SNAPSHOTS, MAX_ROUNDS);

    expect(result.dumbbellRows[0]!.labId).toBe('csl'); // |gap|=1 > |gap|=0
    expect(result.dumbbellRows[0]!.gap).toBe(-1);
    expect(result.dumbbellRows[1]!.gap).toBe(0);
  });

  test('delta = poolSize - totalLotteryQuota', () => {
    // totalStudents=10, no assignments → poolSize=10, totalLotteryQuota=4+3=7, delta=3
    const result = buildInterventionsAggregate(10, [], SNAPSHOTS, MAX_ROUNDS);

    expect(result.statCards.delta).toBe(3);
  });
});
