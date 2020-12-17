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
