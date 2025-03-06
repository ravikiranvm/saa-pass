import { writable } from 'svelte/store';

//this variable stores the queiz score from the test page and 
// can be used in the result page
export const quizScore = writable(0);

export const testQuestions = writable([]);

export const session_id = writable('');