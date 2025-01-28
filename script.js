// 配置部分
const URL_SUFFIXES = ['.com', '.net', '.org', '.io', '.cn', '.gov', '.edu', '.ai']; // 自定义后缀列表
const DEFAULT_PROTOCOL = 'https://'; // 默认协议头
const searchInput = document.getElementById('searchInput');

const LOGO_PATHS = {
    google: './logo/googlelogo.svg',
    bing: './logo/binglogo.svg',
    perplexity: './logo/pplxlogo.svg',
    chatgpt: './logo/chatgptlogo.svg',
    baidu: './logo/baidulogo.svg',
    duckduckgo: './logo/ddglogo.svg',
    yandex: './logo/yandexlogo.svg',
};

chrome.storage.sync.get(['searchEngine'], function (result) {
    currentEngine = result.searchEngine || 'google';
    document.getElementById('searchEngine').value = currentEngine;
    document.querySelector('.logo').src = LOGO_PATHS[currentEngine]; // Update logo
    document.getElementById('searchInput').placeholder =
        chrome.i18n.getMessage(`search${currentEngine.charAt(0).toUpperCase() + currentEngine.slice(1)}Placeholder`);
    console.log(`search${currentEngine.charAt(0).toUpperCase() + currentEngine.slice(1)}Placeholder`);

});


// 处理输入提交
function handleInput(query, forceSearch = false) {
    const trimmedQuery = query.trim();

    if (!forceSearch && isUrl(trimmedQuery)) {
        navigateToUrl(normalizeUrl(trimmedQuery));
    } else {
        performSearch(trimmedQuery);
    }
}

// 判断是否为网址
function isUrl(input) {
    const trimmed = input.trim();
    if (/^\d+$/.test(trimmed) || trimmed.includes(' ')) return false;

    return (
        /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(trimmed) ||
        URL_SUFFIXES.some(suffix => {
            const pattern = new RegExp(
                `^([a-z0-9-]+\.)+[a-z]{2,}${suffix.replace('.', '\\.')}(/[^\\s]*)?$`,
                'i'
            );
            return pattern.test(trimmed);
        })
    );
}

function updateInputStyle(query) {
    searchInput.classList.toggle('valid-url', isUrl(query));
}

searchInput.addEventListener('input', async function (e) {
    const query = e.target.value.trim().normalize('NFC');
    updateInputStyle(query);
    
    if (query.length > 2) {
        const suggestions = await getHistorySuggestions(query);
        showSuggestions(suggestions);
        if (suggestions.length === 0) {
            searchInput.classList.remove('bold-input');
        }
    } else {
        clearSuggestions();
        searchInput.classList.remove('bold-input');
    }
});
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const query = e.target.value;
        updateInputStyle(query);

        if (e.ctrlKey || e.metaKey) {
            searchInput.classList.add('force-search');
            setTimeout(() => searchInput.classList.remove('force-search'), 200);
        }

        handleInput(query, e.ctrlKey || e.metaKey);
    }
});
// 规范化网址
function normalizeUrl(input) {
    try {
        new URL(input); // 验证是否为完整URL
        return input;
    } catch {
        return DEFAULT_PROTOCOL + input.replace(/^(https?:\/\/)?/i, '');
    }
}

// 实际导航函数
function navigateToUrl(url) {
    window.location.href = url;
}

// 实际搜索函数 
const SEARCH_ENGINES = {
    google: query => `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    bing: query => `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
    perplexity: query => `https://www.perplexity.ai/search?q=${encodeURIComponent(query)}`,
    chatgpt: query => `https://chatgpt.com?q=${encodeURIComponent(query)}`,
    baidu: query => `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`,
    duckduckgo: query => `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
    yandex: query => `https://yandex.com/search/?text=${encodeURIComponent(query)}`,
};

let currentEngine = 'google';

// Load saved settings
chrome.storage.sync.get(['searchEngine'], function (result) {
    currentEngine = result.searchEngine || 'google';
    document.getElementById('searchEngine').value = currentEngine;
});

function performSearch(query) {
    const searchUrl = SEARCH_ENGINES[currentEngine](query);
    window.location.href = searchUrl;
}

// Add settings handlers
document.getElementById('settingsButton').addEventListener('click', () => {
    const panel = document.getElementById('settingsPanel');
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
});

document.getElementById('saveSettings').addEventListener('click', () => {
    currentEngine = document.getElementById('searchEngine').value;
    chrome.storage.sync.set({ searchEngine: currentEngine }, () => {
        document.getElementById('searchInput').placeholder =
            chrome.i18n.getMessage(`search${currentEngine.charAt(0).toUpperCase() + currentEngine.slice(1)}Placeholder`);
        document.getElementById('settingsPanel').style.display = 'none';
        document.querySelector('.logo').src = LOGO_PATHS[currentEngine]; // Update logo
    });
});

// 事件监听
document.getElementById('searchInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const forceSearch = e.ctrlKey || e.metaKey; // 支持 Cmd/Ctrl
        handleInput(e.target.value, forceSearch);
    }
});

document.addEventListener('click', (e) => {
    const searchBox = document.querySelector('.search-box');
    const suggestionsContainer = document.getElementById('suggestionsContainer');
    
    if (!searchBox.contains(e.target) && !suggestionsContainer.contains(e.target)) {
        clearSuggestions();
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


// Add this at the bottom of the file
function initInternationalization() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const msgKey = el.getAttribute('data-i18n');
        el.textContent = chrome.i18n.getMessage(msgKey);
    });
}
// Suggestions handling
function showSuggestions(suggestions) {
    const container = document.getElementById('suggestionsContainer');
    container.innerHTML = '';
    
    if (suggestions.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    suggestions.forEach(item => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.innerHTML = `
            <span class="suggestion-title">${item.title}</span>
            <span class="suggestion-url">${new URL(item.url).hostname}</span>
        `;
        
        div.addEventListener('click', () => {
            window.location.href = item.url;
        });
        
        container.appendChild(div);
    });
    
    container.style.display = 'block';
}

function clearSuggestions() {
    const container = document.getElementById('suggestionsContainer');
    container.style.display = 'none';
    searchInput.classList.remove('bold-input');
}
// Call this when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    initInternationalization();
    searchInput.focus();  // Add this line to focus on the search bar
    
});
document.addEventListener('keydown', (e) => {
    // Check if the key is a printable character and searchInput is not focused
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && document.activeElement !== searchInput) {
        searchInput.focus();
    }
});

document.addEventListener('paste', (e) => {
    // If the paste is not already targeting the search bar
    if (document.activeElement !== searchInput) {
        // Focus on the search bar
        searchInput.focus();
        
        // Get the pasted text
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        
        // Insert the pasted text into the search bar
        searchInput.value = pastedText;
        
        // Prevent default paste behavior
        e.preventDefault();
    }
});

document.addEventListener('keydown', (e) => {
    const suggestions = document.querySelectorAll('.suggestion-item');
    const activeSuggestion = document.querySelector('.suggestion-item.active');
    let index = Array.from(suggestions).indexOf(activeSuggestion);

    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        searchInput.classList.add('force-search');
        const query = searchInput.value.trim();
        updateSearchEngine(query);
        return;
    }
    
    // Handle arrow navigation
    if (suggestions.length > 0) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            index = (index + 1) % suggestions.length;
            setActiveSuggestion(suggestions, index);
            searchInput.classList.remove('bold-input');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (index === 0) {
                // Move focus back to search bar
                searchInput.focus();
                searchInput.classList.add('bold-input');
                clearActiveSuggestions();
            } else {
                index = (index - 1 + suggestions.length) % suggestions.length;
                setActiveSuggestion(suggestions, index);
                searchInput.classList.remove('bold-input');
            }
        } else if (e.key === 'Enter' && activeSuggestion) {
            e.preventDefault();
            activeSuggestion.click();
        }
    }
});

searchInput.addEventListener('blur', () => {
    searchInput.classList.remove('force-search');
});

function setActiveSuggestion(suggestions, index) {
    suggestions.forEach(s => s.classList.remove('active'));
    const active = suggestions[index];
    if (active) {
        active.classList.add('active');
        active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
}

function clearActiveSuggestions() {
    const active = document.querySelector('.suggestion-item.active');
    if (active) {
        active.classList.remove('active');
    }
}

searchInput.addEventListener('focus', async () => {
    const query = searchInput.value.trim();
    if (query.length > 2) {
        const suggestions = await getHistorySuggestions(query);
        if (suggestions.length > 0) {
            showSuggestions(suggestions);
            searchInput.classList.add('bold-input');
        } else {
            searchInput.classList.remove('bold-input');
        }
    } else {
        searchInput.classList.remove('bold-input');
    }
});

searchInput.addEventListener('blur', () => {
    searchInput.classList.remove('bold-input');
});

// Background image handling
document.getElementById('bgUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        chrome.storage.local.set({ background: e.target.result }, () => {
            document.body.style.backgroundImage = `url(${e.target.result})`;
            document.body.classList.add('custom-bg');
        });
    };
    
    if (file) reader.readAsDataURL(file);
});

document.getElementById('resetBackground').addEventListener('click', () => {
    chrome.storage.local.remove('background', () => {
        document.body.style.backgroundImage = '';
        document.body.classList.remove('custom-bg');
    });
});

// Load saved background
chrome.storage.local.get(['background'], function(result) {
    if (result.background) {
        document.body.style.backgroundImage = `url(${result.background})`;
        document.body.classList.add('custom-bg');
    }
});

// Browser history suggestions
const MAX_SUGGESTIONS = 5;
let lastSearchTerm = '';

async function getHistorySuggestions(query) {
    const historyItems = await new Promise(resolve => {
        chrome.history.search({
            text: query,
            maxResults: 50, // Fetch more items
            startTime: Date.now() - 2592000000
        }, resolve);
    });

    const uniqueItems = [];
    const seenCombos = new Set();
    const lowerCaseQuery = query.toLowerCase();
    
    for (const item of historyItems) {
        try {
            if (item.title.toLowerCase().includes(lowerCaseQuery) || item.url.toLowerCase().includes(lowerCaseQuery)) {
                const hostname = new URL(item.url).hostname;
                const comboKey = `${hostname}|${item.title.trim().toLowerCase().normalize('NFC')}`;
                
                if (!seenCombos.has(comboKey) && 
                    item.url !== window.location.href &&
                    uniqueItems.length < MAX_SUGGESTIONS) {
                    
                    seenCombos.add(comboKey);
                    uniqueItems.push(item);
                }
            }
        } catch {
            // Skip invalid URLs
        }
    }
    
    return uniqueItems;
}

// Suggestions handling
function showSuggestions(suggestions) {
    const container = document.getElementById('suggestionsContainer');
    container.innerHTML = '';
    
    if (suggestions.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    suggestions.forEach(item => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.innerHTML = `
            <span class="suggestion-title">${item.title}</span>
            <span class="suggestion-url">${new URL(item.url).hostname}</span>
        `;
        
        div.addEventListener('click', () => {
            window.location.href = item.url;
        });
        
        container.appendChild(div);
    });
    
    container.style.display = 'block';
}

function clearSuggestions() {
    document.getElementById('suggestionsContainer').style.display = 'none';
}
