document.getElementById('searchInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        const query = this.value.trim();
        if (query) {
            // Add visual feedback
            this.style.borderColor = '#1a73e8';
            setTimeout(() => {
                this.style.borderColor = '#dfe1e5';
            }, 200);

            // Perform search
            window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        }
    }
});

// Make sure this is your HTML structure:
// <input type="text" class="search-input" id="searchInput" placeholder="Search...">

// Add these improvements for better functionality
document.getElementById('searchInput').addEventListener('input', function (e) {
    // Handle input changes for potential suggestions
    const query = this.textContent.trim();
    console.log('Current input:', query); // For debugging
});

// Add contenteditable-specific styling
document.getElementById('searchInput').style.cssText = `
    min-height: 44px;
    line-height: 44px;
    overflow: hidden;
`;

// Set placeholder text
document.getElementById('searchInput').placeholder = 
  chrome.i18n.getMessage('searchPlaceholder');

