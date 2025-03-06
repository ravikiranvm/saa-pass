<script>

    import { testQuestions, quizScore, session_id } from '$lib/stores';
    import { goto } from '$app/navigation'
    import { onMount } from 'svelte';

    let questions = $testQuestions;
    let totalQuestions = questions.length;
    let currentQuestionIndex = $state(0);
    let selectedOption = $state(null);
    let answers = $state([]);

    onMount(() => {
        const user = localStorage.getItem('username')
        if (!user) {
            goto('/')
        }
    })

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

    async function handleSubmit() {
        if (selectedOption !== null) {
            const answer = {
                id: questions[currentQuestionIndex].id,
                answer: Number(selectedOption)
            };

            answers = [...answers, answer];

            const payload = {
                answers,
                session_id: $session_id,
                user_name: localStorage.getItem('username')
            }

            if (currentQuestionIndex === (totalQuestions -1)) {
                // Submit test to get a score from the api
                //isLoading = true;
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
                } //finally {
                    //isLoading = false;
                //}
            } else {
                selectedOption = null;
                nextQuestion();
            }
        }
    }

</script>


{#if questions.length > 0}
    <div>
        <h3>{questions[currentQuestionIndex].question}</h3>
        <div>
            <form onsubmit={preventDefault(handleSubmit)}>
                {#each questions[currentQuestionIndex].options as option, index}
                    <label>
                        <input 
                            type="radio" 
                            name={questions[currentQuestionIndex].question} 
                            value={index}
                            bind:group={selectedOption} />
                        {option}
                    </label><br>
                {/each}
                <div>
                    <input 
                        type="submit" 
                        value={currentQuestionIndex === (totalQuestions - 1) ? 'Submit Test' : 'Submit'}
                        disabled={selectedOption === null}
                        />
                </div>
            </form>
        </div>
    </div>
{/if}

<div class="progress">
    Question {currentQuestionIndex + 1} of {totalQuestions}
</div>

<style>
    .progress {
        margin-bottom: 1rem;
        font-weight: bold;
    }
</style>