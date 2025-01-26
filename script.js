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

searchInput.addEventListener('input', function (e) {
    const query = e.target.value.trim();
    updateInputStyle(query);
    console.log('Current input:', query);
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
    yandex: query => `https://yandex.com/search/?text=${encodeURIComponent(query)}`
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
    const searchEngineSelect = document.getElementById('searchEngine');
    const saveButton = document.getElementById('saveSettings');
    
    // Check if the click is not on the search input, search engine select, or save button
    if (!searchInput.contains(e.target) && 
        !searchEngineSelect.contains(e.target) && 
        !saveButton.contains(e.target)) {
        // Focus on the search bar only if IME is not composing
        if (!searchInput.isComposing) {
            searchInput.focus();
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


// Add this at the bottom of the file
function initInternationalization() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const msgKey = el.getAttribute('data-i18n');
        el.textContent = chrome.i18n.getMessage(msgKey);
    });
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