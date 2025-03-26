# The Cloud Squad (Frontend)

The Cloud Squad is a platform designed to help users assess their readiness for AWS certification exams. This repository contains the frontend codebase for the application, built using modern web technologies to deliver a seamless and engaging user experience.

## Features

- **AWS Exam Readiness Test**: A 30-minute test with 30 high-quality questions to evaluate the user's conceptual knowledge of AWS.
- **Real-Time Feedback**: Users receive a detailed scorecard with their performance, including percentage scores and readiness status.
- **Review Answers**: Users can review their answers, see correct answers, and read explanations for better understanding.
- **Progress Tracking**: The app tracks the total number of tests taken and displays it dynamically on the homepage.
- **Sharing Options**: Users can share their scorecards via social media or download them as an image.
- **Responsive Design**: The app is optimized for both desktop and mobile devices.
- **Integration with Backend**: The frontend communicates with the backend API to fetch questions, submit answers, and retrieve scores.

## Upcoming Feature: Test Performance Analysis with LLM
I am working on integrating the app with a Large Language Model (LLM) to generate detailed performance and analysis reports. These reports will provide personalized insights and recommendations to help users improve their AWS exam readiness.

## Architecture

![alt text](<Architecture Diagram.png>)

### Frontend
- **Framework**: [SvelteKit](https://kit.svelte.dev/) for building a fast and reactive user interface.
- **Styling**: TailwindCSS for utility-first styling and responsive design.
- **State Management**: Svelte stores for managing application state, such as quiz scores and user answers.
- **Build Tool**: Vite for fast builds and development.

### Backend
The backend for this project is hosted in a separate repository: [The Cloud Squad Backend](https://github.com/ravikiranvm/the-cloud-squad-be). It provides APIs for:
- Fetching test questions.
- Submitting test answers and calculating scores.
- Tracking user sessions and storing reviews.

### Static Assets
- Fonts and icons are preloaded and optimized for performance.
- Static assets like the favicon and logo are stored in the `static/` directory.

## How It Works
1. **Homepage**: Users enter their nickname and start the test.
2. **Test Page**: Users answer 30 questions within 30 minutes. A timer ensures the test is completed within the allotted time.
3. **Result Page**: After submission, users receive a scorecard with their performance details.
4. **Review Page**: Users can review their answers, see explanations, and submit feedback.
