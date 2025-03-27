<script>

    import { testQuestions, quizScore, session_id, answers, time_taken } from '$lib/stores';
    import { goto } from '$app/navigation'
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    let questions = $testQuestions;
    let totalQuestions = questions.length;
    let currentQuestionIndex = $state(0);
    let selectedOption = $state(null);
    let countdown;
    let displayTime = $state('30:00')

    let isSubmitting = $state(false);
    let time_elapsed;


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

            const previousAnswer = $answers.find(answer => answer.id === questions[currentQuestionIndex].id);
        
            if (previousAnswer) {
                selectedOption = previousAnswer.answer;
            } else {
                selectedOption = null;
            }

        }
    }

    function previousQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex -= 1;

            const previousAnswer = $answers.find(answer => answer.id === questions[currentQuestionIndex].id);
            if (previousAnswer) {
                selectedOption = previousAnswer.answer;
            } else {
                selectedOption = null;
            }
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

            const existingAnswerIndex = $answers.findIndex(a => a.id === answer.id);
            if (existingAnswerIndex >= 0) {
                const updatedAnswers = [...$answers];
                updatedAnswers[existingAnswerIndex] = answer;
                $answers = updatedAnswers;
            }
            else {
                $answers = [...$answers, answer];
            }

            if (currentQuestionIndex === (totalQuestions -1)) {
                await submitTest()
            } else {
                //selectedOption = null;
                nextQuestion();
            }
        }
    }

    // This function submits the answers to the api with answers, session_id and user_name
    async function submitTest() {
        isSubmitting = true;

        $time_taken = Date.now() - time_elapsed;

        const payload = {
                answers: $answers,
                session_id: $session_id,
                user_name: sessionStorage.getItem('username')
            }
        
        try {
            const submitStart = Date.now();

            const response = await fetch('https://aeb542xxee.execute-api.ap-south-1.amazonaws.com/prod/submit-test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            $quizScore = result.score;

            const submitTime = Date.now() - submitStart;
            if (submitTime < 2000) {
                await new Promise(resolve => setTimeout(resolve, 2000 - submitTime));
            }
            goto('/result', { replaceState: true });

        } catch (error) {
            console.error('Error submitting test:', error);
        }
    }

    onMount(() => {
        const user = sessionStorage.getItem('username')
        if (!user) {
            goto('/')
        }

        time_elapsed = Date.now();

        startTimer(1800); // Timer runs for 30 minutes

        // Add cleanup
        return () => {
            if (countdown) clearInterval(countdown);
        };

    })

</script>

<nav class="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-10">
    <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <!-- Left side - App name and exam title -->
        <div class="flex flex-col">
            <div class="text-xl font-gowun font-bold text-black">The Cloud Squad</div>
            <div class="text-xs font-roboto text-gray-600">AWS SAA Exam Readiness</div>
        </div>
        
        <!-- Right side - Timer -->
        <div class="px-3 py-2 bg-black text-white font-mono font-medium rounded">
            {displayTime}
        </div>
    </div>

    <!-- Progress bar beneath navigation content -->
    <div class="h-1 w-full bg-gray-200 overflow-hidden">
        <div 
            class="h-full bg-[#f5b83d] transition-all duration-300 ease-out" 
            style="width: {((currentQuestionIndex + 1) / totalQuestions) * 100}%">
        </div>
    </div>
</nav>

<!-- Add spacing to prevent content from being hidden under the fixed navbar -->
<div class="pt-12"></div>


<!-- Main content with padding at bottom to prevent overlap with fixed button 
 #key attribute re-renders DOM for every question, resets internal state and ensures fresh binding-->
{#if questions.length > 0}
    <div class="max-w-3xl mx-auto px-4 sm:px-8 py-6 mt-8 pb-24 bg-white border border-gray-200 rounded-lg">
        <div class="mb-4 font-roboto text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {totalQuestions}
        </div>
        
        <div class="mb-6 font-roboto font-medium text-gray-800">
            {questions[currentQuestionIndex].question}
        </div>
        
        <form onsubmit={preventDefault(handleSubmit)}>
            <div class="space-y-3">
                {#key currentQuestionIndex}
                    {#each questions[currentQuestionIndex].options as option, index}
                        <label class="flex items-start gap-x-4 p-3 border border-gray-200 rounded-lg 
                                hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                            <input 
                                type="radio" 
                                name={questions[currentQuestionIndex].question} 
                                value={index}
                                bind:group={selectedOption} 
                                class="mt-1 accent-[#f5b83d]"/>
                            <span>{option}</span>
                        </label>
                    {/each}
                {/key}
            </div>
        </form>
    </div>
    
    <!-- Fixed button container always visible at bottom -->
    <div class="fixed bottom-0 left-0 right-0 py-4 bg-white border-t border-gray-200 shadow-md z-10">
        <div class="max-w-3xl mx-auto px-4 sm:px-8 flex justify-between">
            <button
                type="button"
                onclick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                class="px-6 py-2 border border-gray-300 text-gray-700 text-sm rounded
                disabled:opacity-30 hover:bg-gray-50">
                Previous Question
            </button>
            <button 
                type="button"
                onclick={handleSubmit}
                disabled={selectedOption === null}
                class="px-6 py-2 bg-black text-white text-sm rounded
                    disabled:opacity-30">
                {currentQuestionIndex === (totalQuestions - 1) ? 'Submit Test' : 'Next Question'}
            </button>
        </div>
    </div>
{/if}

{#if isSubmitting}
    <div class="fixed inset-0 bg-white bg-opacity-95 z-50 flex flex-col items-center justify-center">
        <div class="max-w-sm w-full px-6">
            <div class="mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#f5b83d] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <div class="font-gowun font-bold text-lg">Calculating Results</div>
            </div>
            <div class="text-sm font-medium text-gray-700 mb-2">Test submitted.</div>
            <div class="text-sm font-medium text-gray-700 mb-2">Evaluating your exam...</div>
            
            <!-- Animated progress bar -->
            <div class="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-[#f5b83d] rounded-full animate-progress"></div>
            </div>
        </div>
    </div>

    <style>
        @keyframes progress {
            0% { width: 0%; }
            20% { width: 20%; }
            40% { width: 40%; }
            60% { width: 60%; } 
            80% { width: 80%; }
            100% { width: 95%; }
        }
        .animate-progress {
            animation: progress 2s ease-out forwards;
        }
    </style>
{/if}

<style>

</style>
