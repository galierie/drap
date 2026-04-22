<script lang="ts" module>
  import type { schema } from '$lib/server/database/drizzle';
  import type { SenderRole } from '$lib/features/users/types';

  export interface Props {
    userId: schema.User['id'];
    role: Exclude<SenderRole, 'none'>;
  }
</script>

<script lang="ts">
  import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
  import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
  import MoreVerticalIcon from '@lucide/svelte/icons/more-vertical';
  import XIcon from '@lucide/svelte/icons/x';
  import type { Component } from 'svelte';
  import { toast } from 'svelte-sonner';

  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { Button } from '$lib/components/ui/button';
  import { cn } from '$lib/components/ui/utils';
  import { enhance } from '$app/forms';

  const { userId, role }: Props = $props();

  interface PrimaryControls {
    action: 'promote' | 'demote';
    text: string;
    pastTense: string;
    icon: Component;
  }

  const primary: PrimaryControls = $derived(
    role === 'designated'
      ? {
          action: 'demote',
          text: 'Demote',
          pastTense: 'demoted',
          icon: ArrowDownIcon,
        }
      : {
          action: 'promote',
          text: 'Promote',
          pastTense: 'promoted',
          icon: ArrowUpIcon,
        },
  );

  let disabled = $state(false);
  let removeFormRef = $state<HTMLFormElement | null>(null);

  function handleResult(verb: string) {
    return async ({
      update,
      result,
    }: {
      update: () => Promise<void>;
      result: { type: 'success' | 'failure' | 'error' | 'redirect' };
    }) => {
      disabled = false;
      await update();
      switch (result.type) {
        case 'success':
          toast.success(`Sender ${verb}.`);
          break;
        case 'failure':
        case 'error':
          toast.error(`Failed to update sender.`);
          break;
        default:
          break;
      }
    };
  }
</script>

<div class="flex items-center gap-1">
  <form
    method="post"
    action="/dashboard/users/?/{primary.action}"
    use:enhance={() => {
      disabled = true;
      return handleResult(primary.pastTense);
    }}
  >
    <input type="hidden" name="userId" value={userId} />
    <Button
      type="submit"
      size="sm"
      {disabled}
      class={cn({
        'bg-success text-success-foreground hover:bg-success/80': primary.action === 'promote',
        'bg-warning text-warning-foreground hover:bg-warning/80': primary.action === 'demote',
      })}
    >
      <primary.icon class="size-4" />
      <span>{primary.text}</span>
    </Button>
  </form>

  <form
    bind:this={removeFormRef}
    method="post"
    action="/dashboard/users/?/remove"
    use:enhance={() => {
      disabled = true;
      return handleResult('removed');
    }}
  >
    <input type="hidden" name="userId" value={userId} />
    <Button type="submit" size="sm" variant="destructive" {disabled} class="hidden sm:inline-flex">
      <XIcon class="size-4" />
      <span>Remove</span>
    </Button>
  </form>

  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      {#snippet child({ props })}
        <Button
          {...props}
          size="icon"
          variant="ghost"
          class="size-8 sm:hidden"
          aria-label="More actions"
          {disabled}
        >
          <MoreVerticalIcon class="size-4" />
        </Button>
      {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content align="end">
      <DropdownMenu.Item variant="destructive" onclick={() => removeFormRef?.requestSubmit()}>
        <XIcon class="size-4" />
        <span>Remove</span>
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</div>
