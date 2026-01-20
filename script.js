// // Stress Check Quiz Application

// // Psychology-Inspired Quiz Questions (20 questions)
// // Balanced assessment: 10 emotional/mental state questions and 10 physical/lifestyle pattern questions
// // Questions follow consistent patterns: "How often..." (frequency) or "How well..." (quality)
// const questions = [
//     // Physical/Lifestyle Questions (1-10)
//     "How well did you sleep last night?",
//     "How often do you feel physically tired even after resting?",
//     "How often do you experience tension or headaches?",
//     "How much energy do you usually have during the day?",
//     "How well are you managing your work or school responsibilities?",
//     "How easy is it for you to relax and unwind?",
//     "How often do you feel the need to isolate yourself?",
//     "How would you rate your appetite recently?",
//     "Do you feel in control of your daily routine?",
//     "How well can you concentrate on your tasks?",
//     // Emotional/Mental State Questions (11-20)
//     "How often do you find yourself getting irritated?",
//     "How often do you feel overwhelmed by your commitments?",
//     "How often do you worry about things beyond your control?",
//     "How often do you feel emotionally drained?",
//     "How often do you experience racing thoughts or worry?",
//     "How optimistic do you feel about your near future?",
//     "How well do you feel you're coping with current challenges?",
//     "How satisfied are you with your current life balance?",
//     "How well can you make decisions?",
//     "How motivated have you felt lately?"
// ];

// // Emoji options with their stress values - refined emotional state labels
// // These represent emotional states rather than moods, fitting all 20 psychology-based questions
// const emojiOptions = [
//     { emoji: "😌", label: "Very Calm", value: 0 },
//     { emoji: "🙂", label: "Stable", value: 25 },
//     { emoji: "😐", label: "Neutral", value: 50 },
//     { emoji: "😟", label: "Anxious", value: 75 },
//     { emoji: "😫", label: "Exhausted", value: 100 }
// ];

// // Application state
// let currentQuestionIndex = 0;
// let answers = [];
// let cardStack = []; // Track card stack for overlapping animation

// // Initialize the quiz (called when user starts)
// function initQuiz() {
//     renderQuestion();
//     updateProgress();
// }

// // Landing page transition - fade out landing, fade in quiz
// function startQuiz() {
//     const landingPage = document.getElementById('landingPage');
//     const quizSection = document.getElementById('quizSection');
    
//     // Fade out landing page
//     landingPage.style.opacity = '0';
//     landingPage.style.transition = 'opacity 0.4s ease-out';
    
//     // After fade out, hide landing and show quiz section
//     setTimeout(() => {
//         landingPage.style.display = 'none';
//         quizSection.style.display = 'block';
//         quizSection.classList.add('show');
        
//         // Initialize quiz after transition
//         initQuiz();
//     }, 400);
// }

// // Render the current question with overlapping flashcard animation
// function renderQuestion() {
//     const quizContainer = document.getElementById('quizContainer');
    
//     // Create question card
//     const questionCard = document.createElement('div');
//     questionCard.className = 'question-card';
//     questionCard.id = `question-${currentQuestionIndex}`;
    
//     // Set z-index based on position in stack (newer cards have higher z-index)
//     // This creates the overlapping effect where new cards appear on top
//     const zIndex = 10 + currentQuestionIndex;
//     questionCard.style.zIndex = zIndex;
    
//     // Create question text
//     const questionText = document.createElement('div');
//     questionText.className = 'question-text';
//     questionText.textContent = questions[currentQuestionIndex];
    
//     // Create emoji options container
//     const emojiOptionsContainer = document.createElement('div');
//     emojiOptionsContainer.className = 'emoji-options';
    
//     // Create emoji option buttons
//     emojiOptions.forEach((option, index) => {
//         const emojiOption = document.createElement('div');
//         emojiOption.className = 'emoji-option';
//         emojiOption.dataset.value = option.value;
        
//         const emoji = document.createElement('div');
//         emoji.className = 'emoji';
//         emoji.textContent = option.emoji;
        
//         const label = document.createElement('div');
//         label.className = 'emoji-label';
//         label.textContent = option.label;
        
//         emojiOption.appendChild(emoji);
//         emojiOption.appendChild(label);
        
//         // Add click event listener
//         emojiOption.addEventListener('click', () => handleAnswer(option.value));
        
//         emojiOptionsContainer.appendChild(emojiOption);
//     });
    
//     questionCard.appendChild(questionText);
//     questionCard.appendChild(emojiOptionsContainer);
//     quizContainer.appendChild(questionCard);
    
//     // Add to card stack
//     cardStack.push(questionCard);
    
//     // Trigger slide-in animation with fade-in after a brief delay to ensure DOM is ready
//     // The new card appears from behind with upward motion and fade-in, ending on top
//     // This creates the vertical stacking effect where new cards rise above old ones
//     // Small fade-in animation keeps transitions soft and smooth
//     setTimeout(() => {
//         questionCard.classList.add('active');
//     }, 100); // Slight delay to allow previous card to start moving down first
// }

// // Handle answer selection with vertical stacking flashcard animation
// function handleAnswer(value) {
//     // Store the answer
//     answers[currentQuestionIndex] = value;
    
//     // Get the current question card (the topmost active card)
//     const currentCard = cardStack[cardStack.length - 1];
    
//     // Animate current card moving downward and fading underneath
//     // The card scales down slightly and moves down, creating a stacking effect
//     currentCard.classList.remove('active');
//     currentCard.classList.add('slide-out');
    
//     // Move to next question or show results
//     // Start rendering new card partway through the old card's animation for smooth overlap
//     // This creates a natural stacking effect where cards overlap during transition
//     setTimeout(() => {
//         currentQuestionIndex++;
        
//         if (currentQuestionIndex < questions.length) {
//             updateProgress();
//             // New card will appear from behind with upward motion, ending on top
//             // This happens while the previous card is still moving down and fading
//             renderQuestion();
//         } else {
//             // Small delay before showing results for smooth transition
//             setTimeout(() => {
//                 showResults();
//             }, 200);
//         }
//     }, 200); // Start new card animation partway through old card's transition for overlap
// }

// // Update progress indicator
// function updateProgress() {
//     const progressFill = document.getElementById('progressFill');
//     const progressText = document.getElementById('progressText');
    
//     // Calculate progress percentage for smooth bar animation
//     const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
//     progressFill.style.width = `${progress}%`;
//     progressText.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
// }

// // Calculate psychological stress score and show enhanced results
// function showResults() {
//     // Hide quiz section
//     const quizSection = document.getElementById('quizSection');
//     quizSection.style.display = 'none';
//     quizSection.classList.remove('show');
    
//     // Calculate average stress level (psychological score average)
//     // Sum all stress values and divide by total questions for overall assessment
//     const totalStress = answers.reduce((sum, value) => sum + value, 0);
//     const averageStress = Math.round(totalStress / answers.length);
    
//     // Calculate emoji breakdown (percentage of times each emoji was chosen)
//     // This shows the distribution of responses across stress levels
//     const emojiCounts = {};
//     emojiOptions.forEach(option => {
//         emojiCounts[option.value] = 0;
//     });
    
//     answers.forEach(answer => {
//         emojiCounts[answer] = (emojiCounts[answer] || 0) + 1;
//     });
    
//     // Convert counts to percentages for visual breakdown
//     const totalAnswers = answers.length;
//     const emojiBreakdown = emojiOptions.map(option => {
//         const count = emojiCounts[option.value];
//         const percentage = Math.round((count / totalAnswers) * 100);
//         return {
//             emoji: option.emoji,
//             label: option.label,
//             percentage: percentage,
//             count: count,
//             value: option.value
//         };
//     });
    
//     // Psychology-based interpretation ranges with category titles
//     // These ranges provide context for the calculated stress percentage
//     let categoryTitle = '';
//     let interpretation = '';
//     let message = '';
    
//     if (averageStress <= 25) {
//         categoryTitle = "Low Stress";
//         interpretation = "You seem relaxed and in control.";
//         message = "You're feeling relaxed! Keep up the great work managing your stress.";
//     } else if (averageStress <= 50) {
//         categoryTitle = "Moderate Stress";
//         interpretation = "You're slightly tense, but managing well.";
//         message = "You're doing okay, but consider taking some time to unwind.";
//     } else if (averageStress <= 75) {
//         categoryTitle = "Elevated Stress";
//         interpretation = "You may be under moderate stress.";
//         message = "You might need a breather. Try some relaxation techniques or take a moment for yourself.";
//     } else {
//         categoryTitle = "High Stress";
//         interpretation = "You're showing signs of high stress — take time to recharge.";
//         message = "You're experiencing high stress. Consider reaching out for support and taking time to rest.";
//     }
    
//     // Generate personalized routine suggestions based on stress level
//     let suggestions = [];
//     if (averageStress <= 25) {
//         suggestions = [
//             "Maintain your current self-care habits.",
//             "Continue with light mindfulness or journaling.",
//             "Stay socially connected and keep a balanced routine."
//         ];
//     } else if (averageStress <= 50) {
//         suggestions = [
//             "Try daily short walks or stretching routines.",
//             "Limit screen time before bed.",
//             "Incorporate breathing exercises to stay centered."
//         ];
//     } else if (averageStress <= 75) {
//         suggestions = [
//             "Practice 10 minutes of mindfulness meditation.",
//             "Organize tasks to avoid overwhelm.",
//             "Take breaks and spend time outdoors."
//         ];
//     } else {
//         suggestions = [
//             "Consider talking to someone you trust or a counselor.",
//             "Dedicate quiet time for reflection or journaling.",
//             "Reduce caffeine and prioritize 7–8 hours of sleep."
//         ];
//     }
    
//     // Display results
//     const resultContainer = document.getElementById('resultContainer');
//     const stressPercentage = document.getElementById('stressPercentage');
//     const stressMessage = document.getElementById('stressMessage');
//     const resultCard = resultContainer.querySelector('.result-card');
    
//     // Display category title and stress percentage
//     const resultHeader = resultCard.querySelector('.result-header');
//     resultHeader.textContent = `Your Stress Summary - ${categoryTitle}`;
    
//     stressPercentage.textContent = `${averageStress}%`;
//     stressMessage.innerHTML = `<strong>${interpretation}</strong><br>${message}`;
    
//     // Create enhanced emoji breakdown with visual bars
//     const breakdownContainer = document.createElement('div');
//     breakdownContainer.className = 'emoji-breakdown';
//     breakdownContainer.innerHTML = '<h3>Your Response Breakdown</h3>';
    
//     const breakdownList = document.createElement('div');
//     breakdownList.className = 'breakdown-list';
    
//     emojiBreakdown.forEach(item => {
//         const breakdownItem = document.createElement('div');
//         breakdownItem.className = 'breakdown-item';
        
//         // Emoji and label
//         const emojiLabelContainer = document.createElement('div');
//         emojiLabelContainer.className = 'breakdown-emoji-label';
        
//         const emojiDisplay = document.createElement('span');
//         emojiDisplay.className = 'breakdown-emoji';
//         emojiDisplay.textContent = item.emoji;
        
//         const labelDisplay = document.createElement('span');
//         labelDisplay.className = 'breakdown-label';
//         labelDisplay.textContent = item.label;
        
//         emojiLabelContainer.appendChild(emojiDisplay);
//         emojiLabelContainer.appendChild(labelDisplay);
        
//         // Visual bar chart
//         const barContainer = document.createElement('div');
//         barContainer.className = 'breakdown-bar-container';
        
//         const barFill = document.createElement('div');
//         barFill.className = 'breakdown-bar-fill';
//         barFill.style.width = `${item.percentage}%`;
//         // Color bar based on stress level - using subtle, modern colors
//         if (item.value === 0) {
//             barFill.style.background = '#4ade80'; // Soft green
//         } else if (item.value === 25) {
//             barFill.style.background = '#86efac'; // Light green
//         } else if (item.value === 50) {
//             barFill.style.background = '#fbbf24'; // Warm yellow
//         } else if (item.value === 75) {
//             barFill.style.background = '#fb923c'; // Orange
//         } else {
//             barFill.style.background = '#f87171'; // Soft red
//         }
        
//         const barBackground = document.createElement('div');
//         barBackground.className = 'breakdown-bar-background';
//         barBackground.appendChild(barFill);
        
//         barContainer.appendChild(barBackground);
        
//         // Percentage display
//         const percentageDisplay = document.createElement('span');
//         percentageDisplay.className = 'breakdown-percentage';
//         percentageDisplay.textContent = `${item.percentage}%`;
        
//         breakdownItem.appendChild(emojiLabelContainer);
//         breakdownItem.appendChild(barContainer);
//         breakdownItem.appendChild(percentageDisplay);
//         breakdownList.appendChild(breakdownItem);
//     });
    
//     breakdownContainer.appendChild(breakdownList);
    
//     // Create personalized suggestions section
//     const suggestionsContainer = document.createElement('div');
//     suggestionsContainer.className = 'suggestions-container';
//     suggestionsContainer.innerHTML = '<h3>Personalized Suggestions</h3>';
    
//     const suggestionsList = document.createElement('ul');
//     suggestionsList.className = 'suggestions-list';
    
//     suggestions.forEach(suggestion => {
//         const suggestionItem = document.createElement('li');
//         suggestionItem.textContent = suggestion;
//         suggestionsList.appendChild(suggestionItem);
//     });
    
//     suggestionsContainer.appendChild(suggestionsList);
    
//     // Insert breakdown and suggestions before the retry button
//     const retryButton = resultCard.querySelector('.retry-button');
//     resultCard.insertBefore(breakdownContainer, retryButton);
//     resultCard.insertBefore(suggestionsContainer, retryButton);
    
//     resultContainer.classList.add('show');
    
//     // Animate bars after a brief delay for visual effect
//     setTimeout(() => {
//         const bars = breakdownContainer.querySelectorAll('.breakdown-bar-fill');
//         bars.forEach(bar => {
//             bar.style.transition = 'width 0.8s ease-out';
//         });
//     }, 100);
    
//     // Scroll to top for better UX
//     window.scrollTo({ top: 0, behavior: 'smooth' });
// }

// // Reset quiz for retry - returns to landing page
// function resetQuiz() {
//     currentQuestionIndex = 0;
//     answers = [];
//     cardStack = []; // Clear card stack
    
//     // Hide results and clear breakdown and suggestions
//     const resultContainer = document.getElementById('resultContainer');
//     const breakdownContainer = resultContainer.querySelector('.emoji-breakdown');
//     const suggestionsContainer = resultContainer.querySelector('.suggestions-container');
//     if (breakdownContainer) {
//         breakdownContainer.remove();
//     }
//     if (suggestionsContainer) {
//         suggestionsContainer.remove();
//     }
//     // Reset result header
//     const resultHeader = resultContainer.querySelector('.result-header');
//     if (resultHeader) {
//         resultHeader.textContent = 'Your Stress Summary';
//     }
//     resultContainer.classList.remove('show');
    
//     // Hide quiz section
//     const quizSection = document.getElementById('quizSection');
//     quizSection.style.display = 'none';
//     quizSection.classList.remove('show');
    
//     // Clear quiz container
//     const quizContainer = document.getElementById('quizContainer');
//     quizContainer.innerHTML = ''; // Clear all cards
    
//     // Show landing page with fade-in
//     const landingPage = document.getElementById('landingPage');
//     landingPage.style.display = 'flex';
//     landingPage.style.opacity = '0';
//     setTimeout(() => {
//         landingPage.style.transition = 'opacity 0.4s ease-out';
//         landingPage.style.opacity = '1';
//     }, 50);
// }

// // Landing page transition and event listeners
// document.addEventListener('DOMContentLoaded', () => {
//     // Set up start button to begin quiz
//     const startButton = document.getElementById('startButton');
//     startButton.addEventListener('click', startQuiz);
    
//     // Set up retry button to restart from landing page
//     const retryButton = document.getElementById('retryButton');
//     retryButton.addEventListener('click', resetQuiz);
    
//     // Quiz section is hidden initially (landing page shows first)
//     const quizSection = document.getElementById('quizSection');
//     quizSection.style.display = 'none';
// });

