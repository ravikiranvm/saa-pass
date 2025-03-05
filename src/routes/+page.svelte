<script>

    import {goto} from '$app/navigation';
    import {quizScore} from '$lib/stores';

    let questions = $state([]);
    let isLoading = $state(false);
    let currentQuestionIndex = $state(0);
    const totalQuestions = $derived(questions.length);
    let selectedOption = $state(null);
    let answers = $state([]);

    // Fucntion to fetch the given API, convert object to Array, and handle any error
    async function fetchQuestions() {
        isLoading = true;
        try {
            const response = await fetch('https://phrxciu6ad.execute-api.ap-south-1.amazonaws.com/stage/saa-questions');
            const data = await response.json();
            questions = Object.values(data);
            isLoading = false;
        } catch (error) {
            console.error('Error fetching questions:', error);
            isLoading = false;
        }
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

    // Function to handle what happens on clicking the submit button after each question
    // 
    async function handleSubmit() {
        if (selectedOption !== null) {
            const answer = {
                id: questions[currentQuestionIndex].id,
                answer: Number(selectedOption)
            };

            answers = [...answers, answer];

            if (currentQuestionIndex === (totalQuestions -1)) {
                // Submit test to get a score from the api
                isLoading = true;
                try {
                    console.log(answers);
                    const response = await fetch('https://phrxciu6ad.execute-api.ap-south-1.amazonaws.com/stage/submit-test', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(answers)
                    });

                    const result = await response.json();
                    $quizScore = result.score;
                    goto('/result');

                } catch (error) {
                    console.error('Error submitting test:', error);
                } finally {
                    isLoading = false;
                }
            } else {
                selectedOption = null;
                nextQuestion();
            }
        }
    }
</script>

<h1>Hi Ravi!</h1>

<button onclick={fetchQuestions}>
    {#if isLoading}
        Loading... 
    {:else}
        Start the test!
    {/if}
</button>

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