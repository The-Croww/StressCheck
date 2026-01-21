function setCategoryAndGo(category) {
    localStorage.setItem('stresscheckCategory', category);
    window.location.href = 'quiz.html';
}

const steps = {};
const stepStack = [];
let currentStepId = '';

function showStep(stepId) {
    if (currentStepId && steps[currentStepId]) {
        steps[currentStepId].classList.add('hidden');
    }
    const nextStep = steps[stepId];
    if (!nextStep) return;
    nextStep.classList.remove('hidden');
    currentStepId = stepId;
}

function goBack() {
    if (stepStack.length === 0) {
        window.location.href = 'index.html';
        return;
    }
    const previousStep = stepStack.pop();
    showStep(previousStep);
}

document.addEventListener('DOMContentLoaded', () => {

    steps.stepUser = document.getElementById('stepUser');
    steps.stepStudent = document.getElementById('stepStudent');
    steps.stepAdult = document.getElementById('stepAdult');
    steps.stepGeneral = document.getElementById('stepGeneral');

    currentStepId = 'stepUser';

    const userButtons = document.querySelectorAll('#stepUser .start-button');
    userButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const userType = (btn.getAttribute('data-category') || '').toLowerCase();
            
            // Save user type for quiz logic
            localStorage.setItem('stresscheckUserType', userType);
            
            // Direct to quiz for "general" category
            if (userType === 'general') {
                // Skip specific question, go directly to general categories
                steps.stepUser.classList.add('hidden');
                steps.stepGeneral.classList.remove('hidden');
                return;
            }
            
            // Show category selection for student and adult
            localStorage.setItem('stresscheckCategory', userType);
            stepStack.push(currentStepId);
            
            if (userType === 'student') {
                showStep('stepStudent');
            } else if (userType === 'adult') {
                showStep('stepAdult');
            } else {
                showStep('stepGeneral');
            }
        });
    });

    const optionButtons = document.querySelectorAll(
        '#stepStudent .start-button, #stepAdult .start-button, #stepGeneral .start-button'
    );
    optionButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const category = (btn.getAttribute('data-category') || '').toLowerCase();
            localStorage.setItem('stresscheckSubcategory', category);
            setCategoryAndGo(category);
        });
    });

});

