// 配置部分
const URL_SUFFIXES = ['.com', '.net', '.org', '.io', '.cn', '.gov', '.edu']; // 自定义后缀列表
const DEFAULT_PROTOCOL = 'https://'; // 默认协议头
const searchInput = document.getElementById('searchInput');

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
function performSearch(query) {
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

// 事件监听
document.getElementById('searchInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const forceSearch = e.ctrlKey || e.metaKey; // 支持 Cmd/Ctrl
        handleInput(e.target.value, forceSearch);
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

