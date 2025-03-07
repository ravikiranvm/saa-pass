/*

import {onMount} from 'svelte'
import {goto} from '$app/navigation'


let countdown;
let displayTime = $state('30:00')

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0': ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function timer(seconds) {
    const now = Date.now()
    const then = now + seconds * 1000

    displayTime = displayTimeLeft(seconds);

    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now())/1000);
        
        if (secondsLeft < 0) {
            clearInterval(countdown);
            displayTime = '00:00'
            return;
        }
        displayTime = displayTimeLeft(secondsLeft);
        }, 1000);
}

onMount(() => {
    timer(10)

    setInterval(timesup, 1000)
})

function timesup() {
    if (displayTime < '00:01') {
        goto('/')
    }
}

</script>

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
*/