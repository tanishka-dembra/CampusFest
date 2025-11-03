// This script is refactored for a Multi-Page Application (MPA).
// Single-page navigation logic has been removed, and page-specific
// code is now isolated to prevent errors.

/**
 * Toggles the visibility of a day's schedule and updates the active tab.
 * This function is only used on schedule.html.
 * @param {string} dayId - The ID of the day schedule element to show.
 * @param {HTMLElement} clickedTab - The button element that was clicked.
 */
function showDay(dayId, clickedTab) {
    document.querySelectorAll('.day-schedule').forEach(schedule => {
        schedule.style.display = 'none';
    });
    document.querySelectorAll('.day-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(dayId).style.display = 'block';
    clickedTab.classList.add('active');
}

/**
 * Navigates to the registration page and passes the event name as a URL parameter.
 * This is the new function for the "Register Now" buttons on the events page.
 * @param {string} eventName - The name of the event to register for.
 */
function registerForEvent(eventName) {
    // Redirect to the registration page with the event name in the URL
    window.location.href = `register.html?event=${encodeURIComponent(eventName)}`;
}

/**
 * Toggles the visibility of an FAQ answer.
 * This function is only used on contact.html.
 * @param {HTMLElement} element - The FAQ question element that was clicked.
 */
function toggleFaq(element) {
    const answer = element.nextElementSibling;
    const isActive = answer.classList.contains('active');
    
    // Close all other active FAQs
    document.querySelectorAll('.faq-answer.active').forEach(ans => {
        ans.classList.remove('active');
        const correspondingQuestion = ans.previousElementSibling;
        correspondingQuestion.innerHTML = correspondingQuestion.innerHTML.replace('▼', '➤');
    });

    // Toggle the clicked FAQ
    if (!isActive) {
        answer.classList.add('active');
        element.innerHTML = element.innerHTML.replace('➤', '▼');
    }
}


// Main event listener that runs after the HTML is loaded
document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    // GLOBAL CODE (Runs on every page)
    // ===================================================================

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    // ===================================================================
    // PAGE-SPECIFIC CODE (Wrapped in checks to avoid errors)
    // ===================================================================

    // --- Home Page Logic (Countdown Timer) ---
    const countdownEl = document.querySelector('.countdown');
    if (countdownEl) {
        const eventDate = new Date('2025-10-15T09:00:00').getTime();
        
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = eventDate - now;

            if (distance < 0) {
                countdownEl.innerHTML = '<h2>Event Started!</h2>';
                clearInterval(countdownInterval);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').innerHTML = days.toString().padStart(2, '0');
            document.getElementById('hours').innerHTML = hours.toString().padStart(2, '0');
            document.getElementById('minutes').innerHTML = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').innerHTML = seconds.toString().padStart(2, '0');
        }
        
        const countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown(); // Initial call
    }


    // --- Registration Page Logic ---
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        // Handle pre-filling the event from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const eventFromUrl = urlParams.get('event');
        if (eventFromUrl) {
            document.getElementById('event').value = eventFromUrl;
        }

        // Show/hide Team Name field
        const teamTypeSelect = document.getElementById('teamType');
        const teamNameGroup = document.getElementById('teamNameGroup');
        teamTypeSelect.addEventListener('change', () => {
            teamNameGroup.style.display = (teamTypeSelect.value === 'team') ? 'block' : 'none';
        });

        // Handle form submission
        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent actual form submission for this demo
            
            const eventName = document.getElementById('event').value;
            document.getElementById('registeredEvent').textContent = eventName;
            
            // Show success message
            document.getElementById('overlay').classList.add('show');
            document.getElementById('successMessage').classList.add('show');
            
            registrationForm.reset();
            teamNameGroup.style.display = 'none';
        });

        // Function for the "Close" button on the success message
        window.closeSuccessMessage = function() {
            document.getElementById('overlay').classList.remove('show');
            document.getElementById('successMessage').classList.remove('show');
        }
    }
});