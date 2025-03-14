<script>
    import {quizScore, time_taken} from '$lib/stores';
    import {goto} from '$app/navigation'
    import {onMount} from 'svelte'
    import { handle_share, tryNativeShare, downloadImage } from '$lib/html2canvas'
    import html2canvas from 'html2canvas';


    let user_name = sessionStorage.getItem('username')
    const result_percent = Math.round(($quizScore/30) * 100)
    const isExamReady = result_percent >= 80;
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const timeTaken = format_time_taken($time_taken);

    let scoreCard;
    let examId;

    function format_time_taken(timeInSeconds) {
        const totalSeconds = Math.floor(timeInSeconds/1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
    
        if (minutes === 0) {
            return `${seconds} seconds`;
        } else if (minutes === 1) {
            return seconds > 0 ? `1 minute ${seconds} seconds` : `1 minute`;
        } else {
            return seconds > 0 ? `${minutes} minutes ${seconds} seconds` : `${minutes} minutes`;
        }
    }

    function handleShare() {
        handle_share(scoreCard, result_percent)
    }

    onMount(() => {
        const user_name = sessionStorage.getItem('username')
        if (!user_name) { goto('/') }

        examId = Math.random().toString(36).substr(2, 8).toUpperCase();
    })

</script>

<nav class="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-10">
    <div class="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
        <!-- Left side - App name and exam title -->
        <div class="flex flex-col">
            <div class="text-xl font-gowun font-bold text-black tracking-wide">
                <a href='/'>The Cloud Squad</a>
            </div>
            <div class="text-xs font-roboto text-gray-600">Score Card</div>
        </div>
        <!-- Right side - Original Ko-fi button -->
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

<!-- Add spacing to prevent content from being hidden under the fixed navbar -->
<div class="pt-12"></div>

<div class="flex flex-col items-center min-h-screen bg-black bg-opacity-5 p-3">
    <div class="w-full max-w-4xl bg-white border border-black shadow-md" bind:this={scoreCard}>
        <!-- Header - Enhanced -->
        <div class="bg-black border-b border-gray-300 p-4 flex justify-between items-center">
            <div>
                <h1 class="text-base font-mono font-bold tracking-wider text-white">AWS EXAM READINESS</h1>
                <div class="text-xs font-mono text-gray-300">Test taken on {currentDate}</div>
            </div>
            <div class="px-3 py-2 bg-white text-black font-mono text-xs font-bold">
                ID: {examId}
            </div>
        </div>

                <!-- Row 2: Score with User Info to the Right - New Combined Layout -->
        <div class="grid grid-cols-2 border-b border-gray-200">
            <!-- Left: Score (unchanged) -->
            <div class="p-5 flex flex-col items-center justify-center border-r border-gray-200">
                <div class="text-xs font-mono uppercase text-black font-bold mb-2">Score</div>
                <div class={`text-5xl sm:text-6xl font-bold ${isExamReady ? 'text-green-500' : 'text-red-500'}`}>
                    {result_percent}%
                </div>
                <div class="text-sm font-mono text-black mt-3">{$quizScore}/30 correct</div>
                
                <!-- Progress Bar -->
                <div class="h-6 w-full bg-gray-100 mt-6 relative overflow-hidden border border-gray-300">
                    <div 
                        class={`h-full ${isExamReady ? 'bg-green-500' : 'bg-red-500'}`} 
                        style={`width: ${result_percent}%`}
                    ></div>
                </div>
                <div class="flex justify-between text-xs font-mono w-full mt-1 text-black">
                    <div>0%</div>
                    <div>100%</div>
                </div>
            </div>
            
            <!-- Right: User Info (Nickname and Time) - No dividing border -->
            <div class="p-5 flex flex-col justify-center">
                <div class="mb-5">
                    <div class="text-xs font-mono uppercase text-black font-medium">Nickname</div>
                    <div class="font-bold text-black">{user_name}</div>
                </div>
                
                <div>
                    <div class="text-xs font-mono uppercase text-black font-medium">Test Completed In</div>
                    <div class="text-black">{timeTaken}</div>
                </div>
            </div>
        </div>

        <!-- Row 3: Exam Readiness - As a separate row -->
        <div class="p-5 border-b border-gray-200">
            <div class="text-xs font-mono uppercase text-black font-bold mb-2">Exam Readiness</div>
            
            {#if isExamReady}
                <div class="border-l-4 border-green-500 pl-4">
                    <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <div class="font-mono font-bold text-green-500 text-xl">
                            Exam Ready!
                        </div>
                    </div>
                    <div class="text-sm mt-2 text-black pl-9">
                        You've met the 80% passing threshold
                    </div>
                </div>
            {:else}
                <div class="border-l-4 border-red-500 pl-4">
                    <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div class="font-mono font-bold text-red-500 text-xl">
                            Not Exam Ready
                        </div>
                    </div>
                    <div class="text-sm mt-2 text-black pl-9">
                        Score at least 80% to pass
                    </div>
                </div>
            {/if}
        </div>
        
        <!-- Row 3: Recommendation - Full width -->
        <div class="p-5 border-b border-gray-200">
            <div class="text-xs font-mono uppercase text-black font-bold mb-2">Recommendation</div>
            <div class="text-black">
                {isExamReady ? 
                    'Review any missed questions before taking the exam.' : 
                    'Focus on reviewing areas where you missed questions.'}
            </div>
        </div>
        
        <!-- Row 4: Footer - Two columns -->
        <div class="bg-black p-4 grid grid-cols-2 items-center">
            <div class="text-xs font-mono text-white">
                <div class="p-1">thecloudsquad.com</div>
                <div class="p-1">Made by raviki</div>
            </div>
            <div class="flex justify-end gap-3">
                <button 
                    class="px-4 py-2 bg-white text-black text-sm font-mono hover:bg-gray-200 transition-colors border border-gray-300"
                    onclick={handleShare}
                >
                    SHARE
                </button>
                <button 
                    class="px-4 py-2 bg-white text-black text-sm font-mono hover:bg-gray-200 transition-colors border border-gray-300"
                    onclick={() => goto('/review')}
                >
                    REVIEW ANSWERS
                </button>
            </div>
        </div>
    </div>
    <!-- Disclaimer - Now outside of scorecard -->
    <div class="w-full max-w-4xl border bg-gray-50 p-1 text-xs text-gray-600 text-center">
        <p>This readiness test assesses conceptual AWS knowledge only and does not guarantee performance on the actual AWS certification exam.</p>
    </div>
    
</div>

<style>
    
</style>
