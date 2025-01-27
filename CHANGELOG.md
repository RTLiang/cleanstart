# Clean Start Extension Changelog

## Version 1.2
### Release Date: 28 JAN 2025

### New Features
- Implemented background image upload and reset functionality
- Added localized labels for background image settings

### Technical Updates
- Updated manifest to include unlimited storage permission
- Added event listeners for background image handling in script.js
- Updated localization files with new background image strings


## Version 1.1.5
### Release Date: 27 JAN 2025

### New Features
- Added Japanese (ja), Korean (ko), Russian (ru), German (de), and Italian (it) language support


## Version 1.1.4
### Release Date: 26 JAN 2025

### New Features
- Added ChatGPT as a new search engine option

### Bug Fixes
- Fixed search engine selection not being properly localized in settings panel
- Improved search bar alignment and visual centering through CSS flexbox adjustments
- Fixed issue with Chinese keyboard input where first key press was ignored during Pinyin input


## Version 1.1.3
### Release Date: 26 JAN 2025

### New Features
- Implemented intuitive search bar auto-focus functionality when clicking anywhere in the blank area of the page
- Added automatic paste handling that focuses search bar and inserts pasted content

## Version 1.1.2
### Release Date: 25 JAN 2025

### Enhancements
- Added French (fr) and Spanish (es) language support


## Version 1.1.1
### Release Date: 25 JAN 2025

### Bug Fixes
- Resolved search bar placeholder text issue with i18n implementation
- Added localized placeholder text for all supported languages (English, Simplified Chinese, Traditional Chinese)

### Enhancements
- Search bar now displays appropriate placeholder text based on selected search engine and language

### Security Improvements
- Removed unnecessary permissions to enhance user privacy and security


## Version 1.1
### Release Date: 25 JAN 2025

### New Features
- Multi-search engine support: Bing, Baidu, and DuckDuckGo integration
- Intelligent URL handling with automatic search fallback
- Search engine selector in settings panel

### Enhancements
- Advanced URL detection in search bar
- Optimized dark mode for all search engine logos and interfaces
- Improved search bar responsiveness and accessibility

### Temporary Changes
- *(fixed in Version 1.1.1)* Removed search bar placeholder text (pending i18n implementation)  


## Version 1.0
### Release Date: 25 JAN 2025

### Core Features
- Google search as default engine
- System-aware dark/light mode detection
- Basic search functionality with instant results
- Multi-language support through i18n framework
