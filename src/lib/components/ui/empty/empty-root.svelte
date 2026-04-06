<script lang="ts" module>
  export type EmptyRootVariant = 'default' | 'info' | 'success' | 'warning' | 'destructive';
</script>

<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  import { cn, type WithElementRef } from '$lib/components/ui/utils';

  let {
    ref = $bindable(null),
    class: className,
    children,
    variant = 'default',
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & { variant?: EmptyRootVariant } = $props();
</script>

<div
  bind:this={ref}
  data-slot="empty"
  data-variant={variant}
  class={cn(
    'flex min-w-0 grow flex-col items-center justify-center gap-6 rounded-lg border border-dashed p-6 text-center text-balance md:p-12',
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</div>
