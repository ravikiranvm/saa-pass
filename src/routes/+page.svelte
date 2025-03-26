<script>
    
    import {goto} from '$app/navigation';
    import {testQuestions, session_id, reset_stores} from '$lib/stores'
    import {onMount} from 'svelte'
    import {get_total_tests_taken} from '$lib/utils'
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

    let questions = $state([]);
    let isLoading = $state(false);
    let user_name = $state('');
    let nameError = $state('');

    let isLongEnough = $state(false);
    let isAlphaNumeric = $state(false);
    let hasAtLeastOneLetter = $state(false);

    let isSubmitting = $state(false)

    let total_tests_taken = $state(0)


    // Fucntion to fetch the given API, convert object to Array, and handle any error
    async function fetchQuestions() {
        isLoading = true;
        try {
            const response = await fetch('https://aeb542xxee.execute-api.ap-south-1.amazonaws.com/prod/saa-questions');
            const data = await response.json();
            $testQuestions = Object.values(data);
            isLoading = false;
        } catch (error) {
            console.error('Error fetching questions:', error);
            isLoading = false;
        }
    }

    function preventDefault(fn) {
        return (event) => {
            event.preventDefault();
            fn();
        };
    }

    function handleInput() {
        isLongEnough = user_name.trim().length >= 3;
        isAlphaNumeric = /^[a-zA-Z0-9]+$/.test(user_name);
        hasAtLeastOneLetter = /[a-zA-Z]/.test(user_name);
    }

    function isValidUserName(name) {
        return name && isLongEnough && isAlphaNumeric && hasAtLeastOneLetter;
    }

    // Function to handle on clicking of take test button
    async function handle_submit() {
        isSubmitting = true;

        try {
            let create_user = {'user_name' : user_name}
            const response = await fetch('https://aeb542xxee.execute-api.ap-south-1.amazonaws.com/prod/create-user', {
                'method' : 'POST',
                'headers' : {
                    'Content-Type': 'application/json'
                },
                'body': JSON.stringify(create_user)
            });

            if (!response.ok) {
                throw new Error('Failed to create user');
            }

            $session_id = await response.json();
            sessionStorage.setItem('username', user_name)

            const fetchStart = Date.now();
            await fetchQuestions()
            const fetchTime = Date.now() - fetchStart;

            if (fetchTime < 2000) {
                await new Promise(resolve => setTimeout(resolve, 2000 - fetchTime));
            }

            await goto('/test')
        } catch (error) {
            console.error('Error submitting test:', error);
            isSubmitting = false;
        } 
    }

    onMount(async () => {
        reset_stores();

        try {
            total_tests_taken = await get_total_tests_taken();
        } catch (error) {
            console.error('Error fetching total tests taken:', error);
            total_tests_taken = 0; 
        }

    });

    function countUp(node, { duration = 2000, initial = 0, value = 0 }) {
    // Create a tweened store for smooth animation
    const tween = tweened(initial, {
        duration,
        easing: cubicOut
    });
    
    // Set the value to animate to
    tween.set(value);
    
    // Subscribe to updates and update the DOM
    const unsubscribe = tween.subscribe($tween => {
        node.textContent = Math.floor($tween);
    });
    
    return {
        update({ value }) {
            tween.set(value); // Update if value changes
        },
        destroy() {
            unsubscribe(); 
        }
    };
}

</script>

<div class="max-w-2xl mx-auto px-6 pt-4 pb-16">
    <div class="flex pt-8 pb-6 text-4xl md:text-5xl text-black font-gowun tracking-wider">
        <div >The Cloud Squad</div>
    </div>

    <div class="flex-col place-items-start pt-4 pb-4 text-black font-gowun tracking-widest">
        <div class="text-lg">Check Your</div>
        <div class="text-xl md:text-2xl break-words">AWS Solutions Architect Associate</div>
        <div class="text-lg">Exam Readiness!</div>
    </div>

    <div class="flex-col place-items-start pt-4 pb-4 text-black font-roboto tracking-wider text-base">
        <div>Answer 30 questions in 30 minutes.</div>
        <div class="mt-2">All questions are made from my personal notes.</div>
        <div class="mt-2">I scored <span class="font-semibold">899/1000</span> with no tech background by following these notes!</div>
    </div>

    
    <div class="flex items-baseline">
        <!-- Add fixed-width container -->
        <span class="inline-block text-xl font-roboto font-bold tracking-wider mr-1 min-w-[3ch] text-right">
            {#if typeof total_tests_taken === 'number'}
                <span class="counter-value" use:countUp={{duration: 2000, initial: 0, value: total_tests_taken}}>
                    {total_tests_taken}
                </span>
            {:else}
                <span class="animate-pulse">...</span>
            {/if}
        </span>
        <span class="text-base text-black font-roboto tracking-wider"> tests taken till now!</span>
    </div>

    <div class="mt-8">
        <form onsubmit={preventDefault(handle_submit)}>
            <div class="flex flex-col sm:flex-row gap-4 items-start">
                <div class="w-full sm:w-auto">
                    <input 
                        class="bg-[#f5f2f2] focus:outline-none border-b-2 animate-pulse focus:animate-none border-black px-3 py-2 w-full sm:w-64"
                        type='text' 
                        name='user_name'
                        placeholder='Enter your nickname'
                        
                        bind:value={user_name}
                        oninput={handleInput}
                    />
                    
                    <!-- Requirement indicators -->
                    <div class="mt-2 text-xs font-roboto">
                        <div class={isLongEnough ? "text-green-600" : "text-[#a0a29f]"}>
                            • At least 3 characters long
                        </div>
                        <div class={isAlphaNumeric && hasAtLeastOneLetter ? "text-green-600" : "text-[#a0a29f]"}>
                            • Must contain letters and only alphanumeric characters
                        </div>
                    </div>
                </div>

                {#if isSubmitting}
                    <button 
                        disabled
                        class="rounded-lg px-6 py-2 font-roboto tracking-wider bg-[#f5b83d] text-white flex items-center justify-center"
                    >
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                    </button>
                {:else}
                    <input 
                        type='submit' 
                        value='Start Exam'
                        disabled={!isValidUserName(user_name)}
                        class="rounded-lg px-6 py-2 font-roboto tracking-wider
                        disabled:opacity-50 bg-[#f5b83d] text-white
                        transition hover:scale-105 duration-150 ease-in-out"
                    />
                {/if}
            </div>
        </form>
    </div>
</div>

{#if isSubmitting}
    <div class="fixed inset-0 bg-white bg-opacity-90 z-50 flex flex-col items-center justify-center">
        <div class="flex flex-col items-center">
            <div class="w-16 h-16 relative">
                <div class="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
                <div class="absolute top-0 left-0 w-full h-full border-4 border-t-[#f5b83d] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
            <h2 class="text-xl font-gowun mt-5 text-gray-800">Preparing Your Exam</h2>
            <p class="text-sm font-roboto text-gray-600 mt-2">Generating questions...</p>
            <p class="text-sm font-roboto text-gray-600 mt-2">You'll have 30 minutes to answer 30 questions.</p>

        </div>
    </div>
{/if}

<div class="fixed bottom-0 left-0 right-0 py-2 text-xs text-center text-gray-500 font-roboto">
    <p>© {new Date().getFullYear()} The Cloud Squad. All rights reserved.</p>
    <p>made by <a href="https://www.linkedin.com/in/ravikiranvm/" target="_blank" rel="noopener noreferrer" class="text-[#b5720d] hover:underline text-sm">raviki</a></p>
</div>

<style>
    
    /* Counter styling */
    @keyframes highlight {
        0% { color: #f5b83d; }
        100% { color: #b5720d; }
    }
    
    .counter-value {
        font-feature-settings: "tnum";
        font-variant-numeric: tabular-nums;
        animation: highlight 2s ease-out;
        color: #b5720d;
        transform: translateZ(0);
    }

</style>



