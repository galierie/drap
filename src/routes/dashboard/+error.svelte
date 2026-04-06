<script>
  import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';

  import * as Empty from '$lib/components/ui/empty';
  import { Button } from '$lib/components/ui/button';
  import { page } from '$app/state';

  const { status, error } = $derived(page);
</script>

<main class="flex min-h-full items-center justify-center px-6 py-12">
  <Empty.Root
    variant={status === 404 || status === 499 ? 'warning' : 'destructive'}
    class="w-full max-w-xl"
  >
    <Empty.Media variant="icon">
      <TriangleAlertIcon class="size-5" />
    </Empty.Media>
    <Empty.Header>
      {#if status === 499}
        <Empty.Title>No Active Draft</Empty.Title>
        <Empty.Description>There is no active draft for this view yet.</Empty.Description>
      {:else if status === 404}
        <Empty.Title>Dashboard Page Not Found</Empty.Title>
        <Empty.Description>The dashboard resource you requested does not exist.</Empty.Description>
      {:else if error !== null}
        <Empty.Title>Dashboard Error</Empty.Title>
        <Empty.Description>{status}: {error.message}</Empty.Description>
      {:else}
        <Empty.Title>Dashboard Error</Empty.Title>
        <Empty.Description>
          An unexpected error prevented this dashboard page from loading.
        </Empty.Description>
      {/if}
    </Empty.Header>
    <Empty.Content>
      <Button href="/dashboard/" variant="outline">Go to Dashboard</Button>
    </Empty.Content>
  </Empty.Root>
</main>
