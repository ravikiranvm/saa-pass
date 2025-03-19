import { writable } from 'svelte/store';

//this variable stores the queiz score from the test page and 
// can be used in the result page
export const quizScore = writable(0);

export const testQuestions = writable([]);

export const session_id = writable('');

export const answers = writable([]);

export const time_taken = writable(0);

export function reset_stores() {
    quizScore.set(0);
    testQuestions.set([]);
    session_id.set('');
    answers.set([]);
    time_taken.set(0);
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('hasReviewSubmitted');
}