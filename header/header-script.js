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

    // Handle active states for navigation tabs
    const navLinks = document.querySelectorAll('.navbar a');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    // Define sections with their IDs
    const sections = [
        { id: 'landingPage', name: 'Home' },
        { id: 'about', name: 'About' },
        { id: 'features', name: 'Features' },
        { id: 'howItWorks', name: 'How it Works' }
    ];
    
    // Function to update active state based on scroll position
    function updateActiveStateOnScroll() {
        const scrollPosition = window.scrollY + 200; // Offset for better detection
        let currentSection = 'landingPage'; // Default to home
        
        // Simple sequential section detection
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            const element = document.getElementById(section.id);
            
            if (element) {
                const elementTop = element.offsetTop;
                
                // If we've scrolled past this section, it's the current one
                if (scrollPosition >= elementTop) {
                    currentSection = section.id;
                    break;
                }
            }
        }
        
        // Special handling for when we're at the very top
        if (scrollPosition <= 200) {
            currentSection = 'landingPage';
        }
        
        // Special handling for when we're at the very bottom
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        if (scrollPosition + windowHeight >= documentHeight - 100) {
            currentSection = 'howItWorks'; // Always show last section when at bottom
        }
        
        // Update active states
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
        
        // Debug logging (can be removed later)
        console.log('Scroll position:', scrollPosition, 'Active section:', currentSection);
    }
    
    // Initial active state based on URL hash or scroll position
    function setInitialActiveState() {
        if (currentPath === 'index.html' || currentPath === '') {
            const hash = window.location.hash.substring(1);
            if (hash && sections.find(s => s.id === hash)) {
                // If hash is valid, set it as active
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${hash}`) {
                        link.classList.add('active');
                    }
                });
            } else {
                // Otherwise, determine by scroll position
                updateActiveStateOnScroll();
            }
        }
    }
    
    // Add click handlers for smooth scrolling and active state update
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Smooth scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL hash
                window.location.hash = targetId;
                
                // Update active state immediately
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Handle hash changes
    window.addEventListener('hashchange', function() {
        const newHash = window.location.hash.substring(1);
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${newHash}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Add scroll event listener for dynamic active state updates
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        // Debounce scroll events for better performance
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveStateOnScroll, 10); // Reduced delay for more responsiveness
    });
    
    // Set initial state
    setInitialActiveState();
    
    // Update active state after a short delay to ensure proper initial positioning
    setTimeout(updateActiveStateOnScroll, 100);
});
