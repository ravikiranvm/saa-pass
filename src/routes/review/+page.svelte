<script>
    import { testQuestions, answers } from '$lib/stores';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    
    let user_answers = $answers;
    let questions = $testQuestions;
    let reviewItems = $state([]);
    let filterMode = $state("all"); // "all", "correct", "incorrect"
    
    onMount(() => {
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
    <div class="flex justify-center mt-8">
        <button 
            class="px-6 py-3 bg-black text-white text-sm rounded hover:bg-[#f5b83d] transition-colors"
            onclick={() => {goto('/')}}>
            Retake Test
        </button>
    </div>
</div>

<div class="mt-4 pb-2 text-xs text-center text-gray-500 font-roboto">
    <p>© {new Date().getFullYear()} The Cloud Squad. All rights reserved.</p>
    <p>made by <a href="https://www.linkedin.com/in/ravikiranvm/" target="_blank" rel="noopener noreferrer" class="text-[#b5720d] hover:underline text-sm">raviki</a></p>
</div>