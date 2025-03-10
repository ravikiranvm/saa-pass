<script>

    import { testQuestions, quizScore, session_id } from '$lib/stores';
    import { goto } from '$app/navigation'
    import { onMount } from 'svelte';

    let questions = $testQuestions;
    let totalQuestions = questions.length;
    let currentQuestionIndex = $state(0);
    let selectedOption = $state(null);
    let answers = $state([]);
    let countdown;
    let displayTime = $state('100:00')


    // this function displays the time in 00:00 format
    function displayTimeLeft(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes < 10 ? '0': ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    // this function runs the countdown and submits answers on timeup
    function startTimer(seconds) {
        const now = Date.now()
        const then = now + seconds * 1000

        displayTime = displayTimeLeft(seconds);

        countdown = setInterval(() => {
            const secondsLeft = Math.round((then - Date.now())/1000);
            
            if (secondsLeft < 0) {
                clearInterval(countdown);
                displayTime = '00:00'
                submitTest();
                return;
            }
            displayTime = displayTimeLeft(secondsLeft);
            }, 1000);
    }


    function nextQuestion() {
        if (currentQuestionIndex < totalQuestions - 1) {
            currentQuestionIndex += 1;
        }
    }

    function preventDefault(fn) {
        return (event) => {
            event.preventDefault();
            fn();
        };
    }

    // This function triggers on clicking the submit button for each question
    async function handleSubmit() {
        if (selectedOption !== null) {
            const answer = {
                id: questions[currentQuestionIndex].id,
                answer: Number(selectedOption)
            };

            answers = [...answers, answer];

            if (currentQuestionIndex === (totalQuestions -1)) {
                await submitTest()
            } else {
                selectedOption = null;
                nextQuestion();
            }
        }
    }

    // This function submits the answers to the api with answers, session_id and user_name
    async function submitTest() {

        const payload = {
                answers,
                session_id: $session_id,
                user_name: sessionStorage.getItem('username')
            }
        
        try {

            const response = await fetch('https://phrxciu6ad.execute-api.ap-south-1.amazonaws.com/stage/submit-test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            $quizScore = result.score;
            goto('/result');

        } catch (error) {
            console.error('Error submitting test:', error);
        }
    }

    onMount(() => {
        const user = sessionStorage.getItem('username')
        if (!user) {
            goto('/')
        }

        startTimer(6000); // Timer runs for 30 minutes

        // Add cleanup
        return () => {
            if (countdown) clearInterval(countdown);
        };

    })

</script>


{#if questions.length > 0}
    <div class="max-w-3xl mx-auto px-10 py-10
    shadow-sm shadow-[#cfcccd]-500/50">
        <div class="mb-4 font-roboto">
            Question {currentQuestionIndex + 1} of {totalQuestions}
        </div>
        <div class="mb-6 font-roboto font-medium
        shadow-sm shadow-[#cfcccd]-500/50">{questions[currentQuestionIndex].question}</div>
        <div>
            <form onsubmit={preventDefault(handleSubmit)}>
                {#each questions[currentQuestionIndex].options as option, index}
                    <label class="grid grid-cols-[auto,1fr] gap-x-4 py-1 rounded-lg 
                    hover:bg-[#cfcccd] hover:scale-105
                    transition delay-150 duration-100 ease-in
                    shadow-sm shadow-[#cfcccd]-500/50">
                        <input 
                            type="radio" 
                            name={questions[currentQuestionIndex].question} 
                            value={index}
                            bind:group={selectedOption} 
                            class="accent-[#f5b83d]"/>
                        {option}
                    </label><br>
                {/each}
                <div class="mt-4 justify-self-center font-roboto">
                    <input 
                        type="submit" 
                        value={currentQuestionIndex === (totalQuestions - 1) ? 'Submit Test' : 'Submit'}
                        disabled={selectedOption === null}
                        class="disabled:opacity-30 hover:bg-[#f5b83d] hover:text-white rounded-lg w-24
                        hover:scale-105 transition delay-50 duration-100 ease-in-out
                        shadow-sm shadow-[#cfcccd]-500/50"/>
                </div>
            </form>
        </div>
    </div>
{/if}

<div class="timer">
    <h2>Timer Test</h2>
    <div class="time">{displayTime}</div>
</div>

<style>
    .timer {
        text-align: center;
        padding: 2rem;
    }
    .time {
        font-size: 2rem;
        font-weight: bold;
    }
</style>