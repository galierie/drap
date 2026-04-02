<script lang="ts">
  import { format } from 'date-fns';

  import { Badge } from '$lib/components/ui/badge';
  import DesignatedLab from '$lib/users/designated-lab.svelte';
  import type { DraftAssignmentRecord } from '$lib/features/drafts/types';

  interface Props {
    regularDrafted: DraftAssignmentRecord[];
    interventionDrafted: DraftAssignmentRecord[];
    lotteryDrafted: DraftAssignmentRecord[];
  }

  const { regularDrafted, interventionDrafted, lotteryDrafted }: Props = $props();
</script>

<div class="grid grid-cols-1 gap-2">
  <div id="section-regular-drafted" class="mb-8">
    <h3 class="text-2xl font-bold mb-4">Regular Drafted ({regularDrafted.length})</h3>
    <div class="space-y-2">
      {#each regularDrafted as { id, email, givenName, familyName, studentNumber, labId, round } (id)}
        <div class="space-y-1 flex justify-between items-center">
          <div class="flex flex-col">
            <span>{familyName.toUpperCase()}, {givenName}</span>
            <span class="text-sm text-muted-foreground">{studentNumber} | {email}</span>
          </div>
          <div class="flex justify-end gap-1 items-center">
            <DesignatedLab {labId} />
            <Badge variant="outline" class="border-secondary bg-secondary/10 text-xs h-fit py-1 px-2">
              Round {round}
            </Badge>
          </div>
        </div>
      {:else}
        <p class="text-sm text-muted-foreground">No regular-round assignments recorded.</p>
      {/each}
    </div>
  </div>

  <div id="section-intervention-drafted" class="mb-8">
    <h3 class="text-2xl font-bold mb-4">Intervention Drafted ({interventionDrafted.length})</h3>
    <div class="space-y-2">
      {#each interventionDrafted as { id, email, givenName, familyName, studentNumber, labId, assignedAt } (id)}
        <div class="space-y-1 flex justify-between items-center">
          <div class="flex flex-col">
            <span>{familyName.toUpperCase()}, {givenName}</span>
            <span class="text-sm text-muted-foreground">{studentNumber} | {email}</span>
          </div>
          <div class="flex justify-end gap-1 items-center">
            <DesignatedLab {labId} />
            <Badge variant="outline" class="border-secondary bg-secondary/10 text-xs h-fit py-1 px-2">
              {#if assignedAt === null}
                <span id="intervention-date-{id}">Unknown date</span>
              {:else}
                <time id="intervention-date-{id}" datetime={assignedAt.toISOString()}>
                  {format(assignedAt, 'PPP p')}
                </time>
              {/if}
            </Badge>
          </div>
        </div>
      {:else}
        <p class="text-sm text-muted-foreground">No intervention assignments were made.</p>
      {/each}
    </div>
  </div>

  <div id="section-lottery-drafted" class="mb-8">
    <h3 class="text-2xl font-bold mb-4">Lottery Drafted ({lotteryDrafted.length})</h3>
    <div class="space-y-2">
      {#each lotteryDrafted as { id, email, givenName, familyName, studentNumber, labId } (id)}
        <div class="space-y-1 flex justify-between items-center">
          <div class="flex flex-col">
            <span>{familyName.toUpperCase()}, {givenName}</span>
            <span class="text-sm text-muted-foreground">{studentNumber} | {email}</span>
          </div>
          <DesignatedLab {labId} />
        </div>
      {:else}
        <p class="text-sm text-muted-foreground">No lottery assignments were recorded.</p>
      {/each}
    </div>
  </div>
</div>