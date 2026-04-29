<script lang="ts">
  import ActivityIcon from '@lucide/svelte/icons/activity';
  import LayersIcon from '@lucide/svelte/icons/layers';
  import StarIcon from '@lucide/svelte/icons/star';
  import ThumbsDownIcon from '@lucide/svelte/icons/thumbs-down';
  import ThumbsUpIcon from '@lucide/svelte/icons/thumbs-up';

  import * as Card from '$lib/components/ui/card';
  import type { LotteryStatCards } from '$lib/features/drafts/types';

  interface Props {
    data: LotteryStatCards;
  }

  const { data }: Props = $props();

  const medianLabel = $derived(
    data.medianRankHonored === null ? '—' : `#${data.medianRankHonored}`,
  );
</script>

<div class="flex flex-wrap gap-2">
  <Card.Root variant="soft" class="preset-tonal-muted max-w-56 min-w-40 flex-1 gap-2 py-4">
    <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-0">
      <Card.Title class="text-sm font-medium">Pool Size</Card.Title>
      <LayersIcon class="size-4 text-muted-foreground" />
    </Card.Header>
    <Card.Content>
      <p id="stat-lottery-pool" class="text-2xl font-bold tabular-nums">{data.poolSize}</p>
      <p class="text-xs text-muted-foreground">Lottery-Placed Students</p>
    </Card.Content>
  </Card.Root>

  <Card.Root variant="soft" class="preset-tonal-muted max-w-56 min-w-40 flex-1 gap-2 py-4">
    <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-0">
      <Card.Title class="text-sm font-medium">Top-Choice Placements</Card.Title>
      <StarIcon class="size-4 text-muted-foreground" />
    </Card.Header>
    <Card.Content>
      <p id="stat-lottery-top" class="text-2xl font-bold tabular-nums">{data.topChoice}</p>
      <p class="text-xs text-muted-foreground">Placed in 1st-Ranked Lab</p>
    </Card.Content>
  </Card.Root>

  <Card.Root variant="soft" class="preset-tonal-muted max-w-56 min-w-40 flex-1 gap-2 py-4">
    <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-0">
      <Card.Title class="text-sm font-medium">Ranked-Lab Placements</Card.Title>
      <ThumbsUpIcon class="size-4 text-muted-foreground" />
    </Card.Header>
    <Card.Content>
      <p id="stat-lottery-ranked" class="text-2xl font-bold tabular-nums">{data.rankedLab}</p>
      <p class="text-xs text-muted-foreground">Placed in a Lab They Ranked</p>
    </Card.Content>
  </Card.Root>

  <Card.Root variant="soft" class="preset-tonal-muted max-w-56 min-w-40 flex-1 gap-2 py-4">
    <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-0">
      <Card.Title class="text-sm font-medium">Unranked Placements</Card.Title>
      <ThumbsDownIcon class="size-4 text-muted-foreground" />
    </Card.Header>
    <Card.Content>
      <p id="stat-lottery-unranked" class="text-2xl font-bold tabular-nums">{data.unranked}</p>
      <p class="text-xs text-muted-foreground">Placed in an Unranked Lab</p>
    </Card.Content>
  </Card.Root>

  <Card.Root variant="soft" class="preset-tonal-muted max-w-56 min-w-40 flex-1 gap-2 py-4">
    <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-0">
      <Card.Title class="text-sm font-medium">Median Rank Honored</Card.Title>
      <ActivityIcon class="size-4 text-muted-foreground" />
    </Card.Header>
    <Card.Content>
      <p id="stat-lottery-median" class="text-2xl font-bold tabular-nums">{medianLabel}</p>
      <p class="text-xs text-muted-foreground">Among Ranked Placements</p>
    </Card.Content>
  </Card.Root>
</div>
