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
            localStorage.setItem('username', user_name)
            await fetchQuestions()
            await goto('/test')
        } catch (error) {
            console.error('Error submitting test:', error);
        } 
    }

</script>

<h1>Welcome!</h1>

<div>
    <form onsubmit={preventDefault(handle_submit)}>
        <input type='text' 
        name='user_name' 
        placeholder='Give us your nickname'
        bind:value={user_name}
        oninput={handleInput}
        />
        {#if nameError}
        <div class='error'>
            {nameError}
        </div>
        {/if}
        <input 
        type='submit' 
        value='Take the test'
        disabled={!isValidUserName(user_name)}
        />
    </form>
</div>


<style>
    .error {
        color: red;
        font-size: 0.8em;
        margin-top: 0.2em;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    input {
        padding: 0.5em;
    }
</style>



