<script>
    import { testQuestions, answers, session_id } from '$lib/stores';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    
    let user_answers = $answers;
    let questions = $testQuestions;
    let reviewItems = $state([]);
    let filterMode = $state("all"); // "all", "correct", "incorrect"

    let user_session_id = $session_id;
    let user = sessionStorage.getItem('username');

    let rating = $state(0);
    let text_review = $state('');
    let hasReviewSubmitted = $state(false);

    let showReviewModal = $state(false);
    let isSubmitting = $state(false);

    let showThanks = $state(false);

    async function submit_review() {

        try {
            const response = await fetch('https://aeb542xxee.execute-api.ap-south-1.amazonaws.com/prod/add-review', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'review': {
                    'session_id': user_session_id,
                    'user_name': user,
                    'rating': rating,
                    'text_review': text_review
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API returned status ${response.status}`);
        }

        hasReviewSubmitted = true;
        sessionStorage.setItem('hasReviewSubmitted', true);

        } catch (error) {
            console.log('error:', error);
        } finally {
            isSubmitting = false;
        }

        
    }

    
    onMount(() => {
        
        if (!user) {
        goto('/');
        return;
    }
        // Create a map for quick lookup
        const questionMap = new Map();
        questions.forEach(q => questionMap.set(q.id, q));
        
        // Create review items with all needed data
        reviewItems = user_answers.map(answer => {
            const question = questionMap.get(answer.id);
            return {
                question: question.question,
                options: question.options,
                userAnswer: answer.answer,
                correctAnswer: question.correctAnswer,
                explanation: question.explanation,
                isCorrect: question.correctAnswer === answer.answer
            };
        });

        if (sessionStorage.getItem('hasReviewSubmitted')) {
            hasReviewSubmitted = true;
        }
    });
    
    // Filtered items based on selected filter
    let filteredItems = $derived(
    filterMode === "all" ? reviewItems :
    reviewItems.filter(item => 
        filterMode === "correct" ? item.isCorrect : !item.isCorrect
    )
);
</script>

<nav class="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-10">
    <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <!-- Left side - App name and exam title -->
        <div class="flex flex-col">
            <div class="text-xl font-gowun font-bold text-black tracking-wide">
                <a href='/'>The Cloud Squad</a>
            </div>
            <div class="text-xs font-roboto text-gray-600">Review Answers</div>
        </div>
        <a href="https://ko-fi.com/raviki" target="_blank" rel="noopener noreferrer" 
           class="flex items-center">
            <img 
                src="https://cdn.prod.website-files.com/5c14e387dab576fe667689cf/670f5a01229bf8a18f97a3c1_favion.png" 
                alt="Support me on Ko-fi" 
                height="36"
                class="h-9 animate-bounce"
            />
        </a>
    </div>
</nav>

<div class="pt-16 pb-10 max-w-3xl mx-auto px-4">
    <div class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        
        
        <!-- Filter Dropdown -->
        <div class="flex space-x-3 mt-4">
            <select 
                class="px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                bind:value={filterMode}
            >
                <option value="all">All Answers</option>
                <option value="correct">Correct Answers</option>
                <option value="incorrect">Incorrect Answers</option>
            </select>
            
            <button 
                class="px-4 py-2 bg-black text-white text-sm rounded hover:bg-[#f5b83d] transition-colors"
                onclick={() => goto('/result')}>
                Back to Results
            </button>
        </div>
    </div>

    <!-- Results counter -->
    <div class="mb-6 text-sm text-gray-600">
        Showing {filteredItems.length} of {reviewItems.length} answers
        {#if filterMode !== "all"}
            ({filterMode === "correct" ? "correct only" : "incorrect only"})
        {/if}
    </div>

    {#each filteredItems as item, index}
        <div class="mb-8 p-6 bg-white border border-gray-200 rounded-lg">
            <!-- Question header with correct/incorrect badge -->
            <div class="flex justify-between items-start mb-4">
                <div class="mb-1 text-sm text-gray-500">Question {index + 1}</div>
                <span class="text-xs px-2 py-1 rounded-full {item.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                    {item.isCorrect ? 'Correct' : 'Incorrect'}
                </span>
            </div>
            
            <div class="mb-4 font-medium">{item.question}</div>
            
            <div class="space-y-2 mb-6">
                {#each item.options as option, optIndex}
                    <div class="flex items-start gap-3 p-3 border rounded-lg
                                {optIndex === item.correctAnswer ? 'border-green-500 bg-white' : 
                                 optIndex === item.userAnswer && optIndex !== item.correctAnswer ? 'border-red-500 bg-white' : 
                                 'border-gray-200 bg-white'}">
                        <div class="mt-0.5">
                            {#if optIndex === item.userAnswer}
                                <div class="h-5 w-5 rounded-full border-2 border-black flex items-center justify-center">
                                    <div class="h-2.5 w-2.5 rounded-full bg-black"></div>
                                </div>
                            {:else}
                                <div class="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                            {/if}
                        </div>
                        <div class="flex-grow">
                            {option}
                            
                            {#if optIndex === item.correctAnswer}
                                <div class="text-xs text-green-600 font-medium mt-1">✓ Correct answer</div>
                            {:else if optIndex === item.userAnswer && optIndex !== item.correctAnswer}
                                <div class="text-xs text-red-600 font-medium mt-1">✗ Your selection</div>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
            
            <!-- Explanation Section -->
            {#if item.explanation}
                <div class="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div class="font-medium text-sm text-gray-800 mb-1">Explanation:</div>
                    <div class="text-sm text-gray-700">{item.explanation}</div>
                </div>
            {/if}
        </div>
    {/each}
    
    {#if filteredItems.length === 0}
        <div class="p-10 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
            No {filterMode === "correct" ? "correct" : "incorrect"} answers to display.
        </div>
    {/if}

    <div class="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        {#if !hasReviewSubmitted}
            <!-- Show rating button only if no previous submission -->
            <button 
                class="rating-button px-6 py-3 bg-black text-white text-sm rounded hover:bg-[#f5b83d] transition-colors flex items-center justify-center"
                onclick={() => showReviewModal = true}>
                <span class="star-icon text-[#f5b83d] mr-1">★</span>
                Could You Rate Us?
            </button>
        {:else}
            <!-- Show a "thank you" button that's disabled -->
            <button 
                class="px-6 py-3 bg-gray-200 text-gray-500 text-sm rounded flex items-center justify-center cursor-not-allowed"
                disabled>
                <span class="text-green-500 mr-1">✓</span>
                Thanks for Rating
            </button>
        {/if}
        
        <button 
            class="px-6 py-3 bg-black text-white text-sm rounded hover:bg-[#f5b83d] transition-colors"
            onclick={() => {goto('/')}}>
            Retake Test
        </button>
    </div>
</div>

<!-- Rating Modal -->
{#if showReviewModal}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium">Your Opinion Matters</h3>
        <button 
          class="text-gray-400 hover:text-gray-600"
          onclick={() => showReviewModal = false}
        >
          ✕
        </button>
      </div>
      
      <div class="flex justify-center mb-5">
        <div class="flex space-x-2">
          {#each Array(5) as _, i}
            <button 
              class="text-3xl focus:outline-none {i < rating ? 'text-[#f5b83d]' : 'text-gray-300 hover:text-gray-400'}" 
              onclick={() => rating = i + 1}
            >
              ★
            </button>
          {/each}
        </div>
      </div>
      
      <textarea
        bind:value={text_review}
        placeholder="How was your experience? (optional)"
        class="w-full p-3 border border-gray-300 rounded mb-5 h-28 text-sm focus:outline-none focus:border-black"
      ></textarea>
      
      <div class="flex justify-end space-x-3">
        <button 
          class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm"
          onclick={() => {
            showReviewModal = false,
            rating = 0;}}
        >
          Cancel
        </button>
        <button 
          class="px-4 py-2 bg-black text-white rounded hover:bg-[#f5b83d] transition-colors text-sm"
          onclick={async () => {
            if (rating > 0) {
                isSubmitting = true;
                await submit_review();
                showReviewModal = false;
                showThanks = true;
                setTimeout(() => showThanks = false, 5000);
            }
          }}
          disabled={isSubmitting || rating === 0}
          class:opacity-50={rating === 0}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Thank you toast -->
{#if showThanks}
  <div class="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 shadow-lg rounded-lg p-4 flex items-center gap-3 z-50 animate-fade-in-up">
    <div class="bg-[#f5b83d] rounded-full p-1 flex-shrink-0">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="text-sm font-medium text-gray-800">Thanks for your feedback!</div>
  </div>
{/if}

<div class="mt-4 pb-2 text-xs text-center text-gray-500 font-roboto">
    <p>© {new Date().getFullYear()} The Cloud Squad. All rights reserved.</p>
    <p>made by <a href="https://www.linkedin.com/in/ravikiranvm/" target="_blank" rel="noopener noreferrer" class="text-[#b5720d] hover:underline text-sm">raviki</a></p>
</div>

<style>
    .rating-button:hover .star-icon {
        color: white;
    }

    @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translate(-50%, 20px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
  
    .animate-fade-in-up {
        animation: fadeInUp 0.3s ease-out forwards;
    }
</style>