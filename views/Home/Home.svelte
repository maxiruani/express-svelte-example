
<script>
    import { getContext } from 'svelte';

    const { title } = getContext('global.props');
    const { counter } = getContext('global.stores');

    export let value = null;

    function increment() {
        counter.update(oldValue => {
            return oldValue + 1;
        });
    }

    function decrement() {
        counter.update(oldValue => {
            return oldValue - 1;
        });
    }

    function reset() {
        counter.set(0);
    }
</script>

<style>
    .Page {
        display: block;
        max-width: 600px;
        margin: 100px auto;
        padding: 0;
    }
</style>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="Page">

    <h1>{title}</h1>

    <h5>View prop "value"</h5>
    <pre>{value}</pre>

    <h5>Global store "counter"</h5>
    <pre>{$counter}</pre>

    <button type="button" on:click={increment}>
        Increase store counter +
    </button>
    <button type="button" on:click={decrement}>
        Decrease store counter -
    </button>
    <button type="button" on:click={reset}>
        Reset store counter
    </button>
</div>