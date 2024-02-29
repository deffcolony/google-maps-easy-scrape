// darkmode.js


  // Log a message with custom level and description
  log('Dark mode script loaded', 'INFO');
  
// Add an event listener to the button
document.addEventListener('DOMContentLoaded', function() {
    var darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.addEventListener('click', toggleDarkMode);
});

// Function to toggle dark mode
function toggleDarkMode() {
    var body = document.body;
    body.classList.toggle("darkModeToggle");
    log('Toggle Dark Mode button clicked', 'INFO');
}
