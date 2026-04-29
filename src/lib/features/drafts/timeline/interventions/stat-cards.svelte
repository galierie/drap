<script lang="ts">
  import ActivityIcon from '@lucide/svelte/icons/activity';
  import LayersIcon from '@lucide/svelte/icons/layers';
  import ScaleIcon from '@lucide/svelte/icons/scale';

  import * as Card from '$lib/components/ui/card';
  import { cn } from '$lib/components/ui/utils';
  import type { InterventionsStatCards } from '$lib/features/drafts/types';

  interface Props {
    data: InterventionsStatCards;
    isHistorical: boolean;
  }

  const { data, isHistorical }: Props = $props();

  const deltaWarning = $derived(!isHistorical && data.delta !== 0);
</script>

<div class="flex flex-wrap gap-2">
  <Card.Root variant="soft" class="preset-tonal-muted max-w-56 min-w-40 flex-1 gap-2 py-4">
    <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-0">
      <Card.Title class="text-sm font-medium">Pool Size</Card.Title>
      <LayersIcon class="size-4 text-muted-foreground" />
    </Card.Header>
    <Card.Content>
      <p id="stat-interventions-pool" class="text-2xl font-bold tabular-nums">{data.poolSize}</p>
      <p class="text-xs text-muted-foreground">Students Eligible for Lottery</p>
    </Card.Content>
  </Card.Root>

  <Card.Root variant="soft" class="preset-tonal-muted max-w-56 min-w-40 flex-1 gap-2 py-4">
    <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-0">
      <Card.Title class="text-sm font-medium">Σ Lottery Quotas</Card.Title>
      <ActivityIcon class="size-4 text-muted-foreground" />
    </Card.Header>
    <Card.Content>
      <p id="stat-interventions-quota" class="text-2xl font-bold tabular-nums">
        {data.totalLotteryQuota}
      </p>
      <p class="text-xs text-muted-foreground">Total Seats Allocated</p>
    </Card.Content>
  </Card.Root>

  {#if !isHistorical}
    <Card.Root
      variant="soft"
      class={cn('max-w-56 min-w-40 flex-1 gap-2 py-4', {
        'preset-tonal-warning': deltaWarning,
        'preset-tonal-muted': !deltaWarning,
      })}
    >
      <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-0">
        <Card.Title class="text-sm font-medium">Delta</Card.Title>
        <ScaleIcon class="size-4 text-muted-foreground" />
      </Card.Header>
      <Card.Content>
        <p
          id="stat-interventions-delta"
          class={cn('text-2xl font-bold tabular-nums', { 'text-warning-foreground': deltaWarning })}
        >
          {data.delta > 0 ? '+' : ''}{data.delta}
        </p>
        <p class="text-xs text-muted-foreground">
          {deltaWarning ? 'Resolve before running lottery' : 'Ready to run lottery'}
        </p>
      </Card.Content>
    </Card.Root>
  {/if}
</div>
