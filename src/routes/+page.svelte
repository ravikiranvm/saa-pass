<script>
    
    import {goto} from '$app/navigation';
    import {testQuestions, session_id} from '$lib/stores'

    let questions = $state([]);
    let isLoading = $state(false);
    let user_name = $state('');
    let nameError = $state('');

    // Fucntion to fetch the given API, convert object to Array, and handle any error
    async function fetchQuestions() {
        isLoading = true;
        try {
            const response = await fetch('https://phrxciu6ad.execute-api.ap-south-1.amazonaws.com/stage/saa-questions');
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
    
    // Verify the user_name is alphanum and not empty
    function validateUserName(name) {
        if (!name) return 'Please enter a nickname'

        if (name.trim().length < 3) return 'Nickname should be at least 3 char long'

        const hasLetter = /[a-zA-Z]/.test(name)
        const isAlphaNum = /^[a-zA-Z0-9]+$/.test(name);

        if (!hasLetter || !isAlphaNum) return 'Must be alphanum' 
        return ''
    }

    function handleInput() {
        nameError = validateUserName(user_name);
    }

    function isValidUserName(name) {
        return validateUserName(name) === '';
    }

    // Function to handle on clicking of take test button
    async function handle_submit() {

        try {
            let create_user = {'user_name' : user_name}
            const response = await fetch('https://phrxciu6ad.execute-api.ap-south-1.amazonaws.com/stage/create-user', {
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
            await fetchQuestions()
            await goto('/test')
        } catch (error) {
            console.error('Error submitting test:', error);
        } 
    }

</script>

<div class="flex pt-10 pb-10 pl-4 pr-4 text-4xl text-black font-gowun">
    <div >CLOUD GUIDE</div>
</div>

<div class="flex-col place-items-start pt-4 pb-4 pl-4 pr-4 text-black font-gowun tracking-widest">
    <div class="text-base">Check Your</div>
    <div class="text-lg">AWS Solutions Architect Associate</div>
    <div class="text-base">Exam Readiness!</div>
</div>

<div class="flex-col place-items-start pt-4 pb-4 pl-4 pr-4 text-black font-roboto tracking-widest text-base">
    <div>Answer 30 questions in 30 minutes.</div>
    <div class="mt-2">All questions are made from my personal notes.</div>
    <div class="mt-2">I scored 899/1000 with no tech background by following this notes!</div>
</div>

<div class="flex justify-start pl-4 pt-10 pb-5">
    <form onsubmit={preventDefault(handle_submit)}>
        <input class="bg-[#f5f2f2] focus:outline-none border-back border-b-2 focus:border-black"
        type='text' 
        name='user_name'
        placeholder='Enter your nickname'
        autofocus
        bind:value={user_name}
        oninput={handleInput}
        />
        <input 
        type='submit' 
        value='Submit'
        disabled={!isValidUserName(user_name)}
        class="rounded-sm w-40 ml-4 font-roboto tracking-wider
        disabled:opacity-0 bg-[#f5b83d] text-white rounded-lg w-24
        transition hover:scale-105 delay-50 duration-100 ease-in-out"
        />
    </form>
</div>
<div class="flex flex-row justify-start pl-4 pr-4 font-roboto">
    {#if nameError}
        <div class="text-[#bd2a4c] text-xs">
            {nameError}
        </div>
    {/if}
</div>

<style>
    

</style>



