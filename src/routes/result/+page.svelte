<script>
    import {quizScore} from '$lib/stores';
    import {goto} from '$app/navigation'
    import {mount, onMount} from 'svelte'

    onMount(() => {
        const user_name = sessionStorage.getItem('username')
        if (!user_name) {
            goto('/')
        }
    })


    
</script>

<div class="result-container">
    <h1>Test Results</h1>
    <div class="score-card">
        <h2>Your Score: {$quizScore}</h2>
    </div>
</div>

<style>
    .result-container {
        max-width: 600px;
        margin: 2rem auto;
        padding: 1rem;
        text-align: center;
    }
    
    .score-card {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
</style>