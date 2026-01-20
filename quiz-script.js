const emojiOptions = [
    { emoji: "😌", label: "Very Calm", value: 0 },
    { emoji: "🙂", label: "Stable", value: 25 },
    { emoji: "😐", label: "Neutral", value: 50 },
    { emoji: "😟", label: "Anxious", value: 75 },
    { emoji: "😫", label: "Exhausted", value: 100 }
];

const QUESTION_COUNT = 20;

let questions = [];
let currentQuestionIndex = 0;
let answers = [];
let cardStack = [];

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function pickQuestions(questionSet, count) {
    if (!Array.isArray(questionSet) || questionSet.length === 0) return [];
    const shuffled = shuffleArray(questionSet);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

function getCategoryKey() {
    const raw = (localStorage.getItem('stresscheckCategory') || '').toLowerCase();
    if (raw === 'student') return 'student';
    if (raw === 'adult') return 'adult';
    if (raw === 'general') return 'general';
    return 'general';
}

function updateTitle() {
    const quizTitle = document.getElementById('quizTitle');
    const key = getCategoryKey();
    if (!quizTitle) return;

    if (key === 'student') quizTitle.textContent = 'Student StressCheck';
    else if (key === 'adult') quizTitle.textContent = 'Adult StressCheck';
    else quizTitle.textContent = 'StressCheck';
}

function initQuiz() {
    const key = getCategoryKey();
    const sets = window.stressCheckQuestionSets || {};
    const selectedSet = sets[key] || sets.general || [];

    questions = pickQuestions(selectedSet, QUESTION_COUNT);
    currentQuestionIndex = 0;
    answers = [];
    cardStack = [];

    const quizContainer = document.getElementById('quizContainer');
    if (quizContainer) quizContainer.innerHTML = '';

    const resultContainer = document.getElementById('resultContainer');
    if (resultContainer) resultContainer.classList.remove('show');

    const quizSection = document.getElementById('quizSection');
    if (quizSection) quizSection.style.display = 'block';

    renderQuestion();
    updateProgress();
}

function renderQuestion() {
    const quizContainer = document.getElementById('quizContainer');
    if (!quizContainer) return;

    const questionCard = document.createElement('div');
    questionCard.className = 'question-card';
    questionCard.id = `question-${currentQuestionIndex}`;

    const zIndex = 10 + currentQuestionIndex;
    questionCard.style.zIndex = zIndex;

    const questionText = document.createElement('div');
    questionText.className = 'question-text';
    questionText.textContent = questions[currentQuestionIndex] || '';

    const emojiOptionsContainer = document.createElement('div');
    emojiOptionsContainer.className = 'emoji-options';

    emojiOptions.forEach((option) => {
        const emojiOption = document.createElement('div');
        emojiOption.className = 'emoji-option';
        emojiOption.dataset.value = option.value;

        const emoji = document.createElement('div');
        emoji.className = 'emoji';
        emoji.textContent = option.emoji;

        const label = document.createElement('div');
        label.className = 'emoji-label';
        label.textContent = option.label;

        emojiOption.appendChild(emoji);
        emojiOption.appendChild(label);

        emojiOption.addEventListener('click', () => handleAnswer(option.value));

        emojiOptionsContainer.appendChild(emojiOption);
    });

    questionCard.appendChild(questionText);
    questionCard.appendChild(emojiOptionsContainer);
    quizContainer.appendChild(questionCard);

    cardStack.push(questionCard);

    setTimeout(() => {
        questionCard.classList.add('active');
    }, 100);
}

function handleAnswer(value) {
    answers[currentQuestionIndex] = value;

    const currentCard = cardStack[cardStack.length - 1];
    if (currentCard) {
        currentCard.classList.remove('active');
        currentCard.classList.add('slide-out');
    }

    setTimeout(() => {
        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            updateProgress();
            renderQuestion();
        } else {
            setTimeout(() => {
                showResults();
            }, 200);
        }
    }, 200);
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const total = Math.max(questions.length, 1);

    const progress = ((currentQuestionIndex + 1) / total) * 100;
    if (progressFill) progressFill.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `Question ${Math.min(currentQuestionIndex + 1, total)} of ${total}`;
}

function drawDonutChart(averageStress, emojiBreakdown) {
    const canvas = document.getElementById('stressChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 85;
    const innerRadius = 55;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Define colors for each stress level
    const colors = {
        0: '#4ade80',   // Green for Very Calm
        25: '#86efac',  // Light Green for Stable
        50: '#fbbf24',  // Yellow for Neutral
        75: '#fb923c',  // Orange for Anxious
        100: '#f87171'  // Red for Exhausted
    };
    
    // Calculate angles for each segment
    let currentAngle = -Math.PI / 2; // Start from top
    
    emojiBreakdown.forEach(item => {
        if (item.percentage > 0) {
            const sliceAngle = (item.percentage / 100) * 2 * Math.PI;
            
            // Draw outer arc
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
            ctx.closePath();
            ctx.fillStyle = colors[item.value];
            ctx.fill();
            
            currentAngle += sliceAngle;
        }
    });
    
    // Update center text
    const chartPercentage = document.getElementById('chartPercentage');
    if (chartPercentage) {
        chartPercentage.textContent = `${averageStress}%`;
    }
}

function showResults() {
    const quizSection = document.getElementById('quizSection');
    if (quizSection) {
        quizSection.style.display = 'none';
        quizSection.classList.remove('show');
    }

    const totalStress = answers.reduce((sum, value) => sum + value, 0);
    const averageStress = Math.round(totalStress / Math.max(answers.length, 1));

    const emojiCounts = {};
    emojiOptions.forEach(option => {
        emojiCounts[option.value] = 0;
    });

    answers.forEach(answer => {
        emojiCounts[answer] = (emojiCounts[answer] || 0) + 1;
    });

    const totalAnswers = answers.length || 1;
    const emojiBreakdown = emojiOptions.map(option => {
        const count = emojiCounts[option.value];
        const percentage = Math.round((count / totalAnswers) * 100);
        return {
            emoji: option.emoji,
            label: option.label,
            percentage: percentage,
            count: count,
            value: option.value
        };
    });

    let categoryTitle = '';
    let interpretation = '';
    let message = '';

    if (averageStress <= 25) {
        categoryTitle = "Low Stress";
        interpretation = "You seem relaxed and in control.";
        message = "You're feeling relaxed! Keep up the great work managing your stress.";
    } else if (averageStress <= 50) {
        categoryTitle = "Moderate Stress";
        interpretation = "You're slightly tense, but managing well.";
        message = "You're doing okay, but consider taking some time to unwind.";
    } else if (averageStress <= 75) {
        categoryTitle = "Elevated Stress";
        interpretation = "You may be under moderate stress.";
        message = "You might need a breather. Try some relaxation techniques or take a moment for yourself.";
    } else {
        categoryTitle = "High Stress";
        interpretation = "You're showing signs of high stress — take time to recharge.";
        message = "You're experiencing high stress. Consider reaching out for support and taking time to rest.";
    }

    let suggestions = [];
    if (averageStress <= 25) {
        suggestions = [
            "Maintain your current self-care habits.",
            "Continue with light mindfulness or journaling.",
            "Stay socially connected and keep a balanced routine."
        ];
    } else if (averageStress <= 50) {
        suggestions = [
            "Try daily short walks or stretching routines.",
            "Limit screen time before bed.",
            "Incorporate breathing exercises to stay centered."
        ];
    } else if (averageStress <= 75) {
        suggestions = [
            "Practice 10 minutes of mindfulness meditation.",
            "Organize tasks to avoid overwhelm.",
            "Take breaks and spend time outdoors."
        ];
    } else {
        suggestions = [
            "Consider talking to someone you trust or a counselor.",
            "Dedicate quiet time for reflection or journaling.",
            "Reduce caffeine and prioritize 7–8 hours of sleep."
        ];
    }

    const resultContainer = document.getElementById('resultContainer');
    const stressMessage = document.getElementById('stressMessage');
    const resultCard = resultContainer ? resultContainer.querySelector('.result-card') : null;

    const resultHeader = resultCard ? resultCard.querySelector('.result-header') : null;
    if (resultHeader) resultHeader.textContent = `Your Stress Summary - ${categoryTitle}`;

    // Draw the donut chart
    drawDonutChart(averageStress, emojiBreakdown);
    
    if (stressMessage) stressMessage.innerHTML = `<strong>${interpretation}</strong><br>${message}`;

    if (resultCard) {
        const existingBreakdown = resultCard.querySelector('.emoji-breakdown');
        const existingSuggestions = resultCard.querySelector('.suggestions-container');
        if (existingBreakdown) existingBreakdown.remove();
        if (existingSuggestions) existingSuggestions.remove();

        const breakdownContainer = document.createElement('div');
        breakdownContainer.className = 'emoji-breakdown';
        breakdownContainer.innerHTML = '<h3>Your Response Breakdown</h3>';

        const breakdownList = document.createElement('div');
        breakdownList.className = 'breakdown-list';

        emojiBreakdown.forEach(item => {
            const breakdownItem = document.createElement('div');
            breakdownItem.className = 'breakdown-item';

            const emojiLabelContainer = document.createElement('div');
            emojiLabelContainer.className = 'breakdown-emoji-label';

            const emojiDisplay = document.createElement('span');
            emojiDisplay.className = 'breakdown-emoji';
            emojiDisplay.textContent = item.emoji;

            const labelDisplay = document.createElement('span');
            labelDisplay.className = 'breakdown-label';
            labelDisplay.textContent = item.label;

            emojiLabelContainer.appendChild(emojiDisplay);
            emojiLabelContainer.appendChild(labelDisplay);

            const barContainer = document.createElement('div');
            barContainer.className = 'breakdown-bar-container';

            const barFill = document.createElement('div');
            barFill.className = 'breakdown-bar-fill';
            barFill.style.width = `${item.percentage}%`;

            // Colors matching the donut chart
            if (item.value === 0) {
                barFill.style.background = '#4ade80';
            } else if (item.value === 25) {
                barFill.style.background = '#86efac';
            } else if (item.value === 50) {
                barFill.style.background = '#fbbf24';
            } else if (item.value === 75) {
                barFill.style.background = '#fb923c';
            } else {
                barFill.style.background = '#f87171';
            }

            // Add color indicator dot
            const colorDot = document.createElement('div');
            colorDot.className = 'breakdown-color-dot';
            if (item.value === 0) {
                colorDot.style.background = '#4ade80';
            } else if (item.value === 25) {
                colorDot.style.background = '#86efac';
            } else if (item.value === 50) {
                colorDot.style.background = '#fbbf24';
            } else if (item.value === 75) {
                colorDot.style.background = '#fb923c';
            } else {
                colorDot.style.background = '#f87171';
            }

            const barBackground = document.createElement('div');
            barBackground.className = 'breakdown-bar-background';
            barBackground.appendChild(barFill);

            barContainer.appendChild(barBackground);

            const percentageDisplay = document.createElement('span');
            percentageDisplay.className = 'breakdown-percentage';
            percentageDisplay.textContent = `${item.percentage}%`;

            breakdownItem.appendChild(emojiLabelContainer);
            breakdownItem.appendChild(colorDot);
            breakdownItem.appendChild(barContainer);
            breakdownItem.appendChild(percentageDisplay);
            breakdownList.appendChild(breakdownItem);
        });

        breakdownContainer.appendChild(breakdownList);

        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'suggestions-container';
        suggestionsContainer.innerHTML = '<h3>Personalized Suggestions</h3>';

        const suggestionsList = document.createElement('ul');
        suggestionsList.className = 'suggestions-list';

        suggestions.forEach(suggestion => {
            const suggestionItem = document.createElement('li');
            suggestionItem.textContent = suggestion;
            suggestionsList.appendChild(suggestionItem);
        });

        suggestionsContainer.appendChild(suggestionsList);

        const retryButton = resultCard.querySelector('.retry-button');
        if (retryButton) {
            resultCard.insertBefore(breakdownContainer, retryButton);
            resultCard.insertBefore(suggestionsContainer, retryButton);
        } else {
            resultCard.appendChild(breakdownContainer);
            resultCard.appendChild(suggestionsContainer);
        }

        setTimeout(() => {
            const bars = breakdownContainer.querySelectorAll('.breakdown-bar-fill');
            bars.forEach(bar => {
                bar.style.transition = 'width 0.8s ease-out';
            });
        }, 100);
    }

    if (resultContainer) resultContainer.classList.add('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
    updateTitle();
    initQuiz();

    const retryButton = document.getElementById('retryButton');
    if (retryButton) retryButton.addEventListener('click', initQuiz);
});




