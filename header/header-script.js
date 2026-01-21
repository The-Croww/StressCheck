// Header functionality - permanently visible
document.addEventListener('DOMContentLoaded', function() {
    console.log('Header loaded and permanently visible');
    const header = document.querySelector('.header');
    if (header) {
        console.log('Header found:', header);
        // No scroll behavior - header stays permanently visible
    } else {
        console.error('Header not found on page load');
    }
});
