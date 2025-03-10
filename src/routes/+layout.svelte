<script>
	import '../app.css';
	import { page } from '$app/stores';

</script>

<div 
	class:test-page-layout={$page.url.pathname === '/test'}>


	{#if $page.url.pathname !== '/'}
		<nav class="flex flex-row absolute top-0 inset-x-0">
			<div>AWS SAA</div>
			{#if $page.url.pathname === '/test'}
				<div>{displayTime}</div>
			{/if}
		</nav>
	{/if}


	<nav class="absolute bottom-0 inset-x-0 text-center font-roboto italic font-light tracking wide">
		<p>made by raviki</p>
	</nav>

    <slot />
</div>

<style>

</style>








