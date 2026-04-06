<script>
  import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';

  import * as Empty from '$lib/components/ui/empty';
  import { Button } from '$lib/components/ui/button';
  import { page } from '$app/state';

  const { status, error } = $derived(page);
</script>

<main class="flex min-h-screen items-center justify-center px-6 py-12">
  <Empty.Root variant={status === 404 ? 'warning' : 'destructive'} class="w-full max-w-xl">
    <Empty.Media variant="icon">
      <TriangleAlertIcon class="size-5" />
    </Empty.Media>
    <Empty.Header>
      {#if status === 404}
        <Empty.Title>Page Not Found</Empty.Title>
        <Empty.Description>
          The page you requested does not exist or is no longer available.
        </Empty.Description>
      {:else if error !== null}
        <Empty.Title>Something Went Wrong</Empty.Title>
        <Empty.Description>{status}: {error.message}</Empty.Description>
      {:else}
        <Empty.Title>Something Went Wrong</Empty.Title>
        <Empty.Description>An unexpected error prevented this page from loading.</Empty.Description>
      {/if}
    </Empty.Header>
    <Empty.Content>
      <Button href="/" variant="outline">Go home</Button>
    </Empty.Content>
  </Empty.Root>
</main>
