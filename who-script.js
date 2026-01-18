function setCategoryAndGo(category) {
    localStorage.setItem('stresscheckCategory', category);
    window.location.href = 'quiz.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('[data-category]');
    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const category = (btn.getAttribute('data-category') || '').toLowerCase();
            if (category === 'student') return setCategoryAndGo('student');
            if (category === 'adult') return setCategoryAndGo('adult');
            return setCategoryAndGo('general');
        });
    });
});
