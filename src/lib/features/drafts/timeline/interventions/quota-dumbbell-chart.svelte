<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import type { DumbbellRow } from '$lib/features/drafts/types';

  interface Props {
    rows: DumbbellRow[];
  }

  const { rows }: Props = $props();

  const maxDomain = $derived(
    rows.length === 0
      ? 1
      : Math.max(1, ...rows.map(r => Math.max(r.naturalLeftover, r.lotteryQuota))),
  );

  function pct(value: number): string {
    return `${(value / maxDomain) * 100}%`;
  }

  function lineColor(gap: number): string {
    if (gap > 0) return 'var(--warning)';
    return 'var(--muted-foreground)';
  }

  function dotColor(gap: number): string {
    if (gap > 0) return 'var(--warning)';
    if (gap < 0) return 'var(--muted-foreground)';
    return 'var(--foreground)';
  }
</script>

<Card.Root
  class="overflow-hidden border-border/60 bg-linear-to-br from-muted/40 via-background to-muted/10 shadow-xs"
>
  <Card.Header>
    <Card.Title>Natural Leftover vs. Lottery Quota</Card.Title>
    <Card.Description>
      Per-lab gap between the "do nothing" baseline and the allocated lottery quota. Amber = seats
      added; muted = seats removed.
    </Card.Description>
  </Card.Header>
  <Card.Content>
    {#if rows.length === 0}
      <p class="text-sm text-muted-foreground">No quota data available.</p>
    {:else}
      <div class="space-y-3">
        {#each rows as row (row.labId)}
          {@const leftPct = pct(row.naturalLeftover)}
          {@const rightPct = pct(row.lotteryQuota)}
          {@const minPct = pct(Math.min(row.naturalLeftover, row.lotteryQuota))}
          {@const maxPct = pct(Math.max(row.naturalLeftover, row.lotteryQuota))}
          <div class="flex items-center gap-3">
            <span
              class="w-24 shrink-0 overflow-hidden text-right text-xs text-ellipsis whitespace-nowrap text-muted-foreground"
              title={row.labName}
            >
              {row.labName}
            </span>

            <div class="relative h-6 flex-1">
              <svg class="h-full w-full overflow-visible" aria-hidden="true">
                <!-- background track -->
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="var(--border)" stroke-width="1" />

                <!-- connecting gap line (only when gap exists) -->
                {#if row.gap !== 0}
                  <line
                    x1={minPct}
                    y1="50%"
                    x2={maxPct}
                    y2="50%"
                    stroke={lineColor(row.gap)}
                    stroke-width="3"
                    stroke-linecap="round"
                  />
                {/if}

                <!-- naturalLeftover dot (baseline, always dark) -->
                <circle
                  cx={leftPct}
                  cy="50%"
                  r="5"
                  fill="var(--foreground)"
                  stroke="var(--background)"
                  stroke-width="1.5"
                />

                <!-- lotteryQuota dot (colored when deviated) -->
                <circle
                  cx={rightPct}
                  cy="50%"
                  r="5"
                  fill={dotColor(row.gap)}
                  stroke="var(--background)"
                  stroke-width="1.5"
                />
              </svg>
            </div>

            <span class="w-10 shrink-0 font-mono text-xs tabular-nums">
              {#if row.gap > 0}
                <span class="text-warning-foreground">+{row.gap}</span>
              {:else if row.gap < 0}
                <span class="text-muted-foreground">{row.gap}</span>
              {:else}
                <span class="text-muted-foreground/50">—</span>
              {/if}
            </span>
          </div>
        {/each}

        <!-- Legend -->
        <div class="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
          <span class="flex items-center gap-1.5">
            <svg width="10" height="10" aria-hidden="true">
              <circle cx="5" cy="5" r="4" fill="var(--foreground)" />
            </svg>
            Natural leftover
          </span>
          <span class="flex items-center gap-1.5">
            <svg width="10" height="10" aria-hidden="true">
              <circle cx="5" cy="5" r="4" fill="var(--warning)" />
            </svg>
            Lottery quota (seats added)
          </span>
          <span class="flex items-center gap-1.5">
            <svg width="10" height="10" aria-hidden="true">
              <circle cx="5" cy="5" r="4" fill="var(--muted-foreground)" />
            </svg>
            Lottery quota (seats removed)
          </span>
        </div>
      </div>
    {/if}
  </Card.Content>
</Card.Root>
