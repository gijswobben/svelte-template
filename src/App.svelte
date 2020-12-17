<script>
	import router from 'page';
	import Home from './routes/Home.svelte';

	let page;
	let params;

	// Define common middleware (used for every route)
    const commonMiddleware = (ctx, next) => {
        params = ctx.params;
                next();
        }

    // Define the routes
    router('*', commonMiddleware);
	router('/', () => page = Home);

	// Start the router
	router.start();

</script>

<svelte:component this={page} {params} />

<div class="card text-white bg-primary mb-3" style="max-width: 20rem;">
	<div class="card-header">Header</div>
	<div class="card-body">
	  <h4 class="card-title">Primary card title</h4>
	  <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
	</div>
</div>