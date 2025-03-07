
import {onMount} from 'svelte'


let countdown;
let displayTime = writable('00:00')

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

