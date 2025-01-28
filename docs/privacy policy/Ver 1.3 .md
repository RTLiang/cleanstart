*Version 1.3 - Effective [28 JAN 2025]*

**What's New:**
- Added disclosure about browser history access for auto-complete suggestions
- Clarified history data handling practices
- Updated permissions documentation with history access details

**3. Local Functionality**

All operations occur locally on your device:
- User preferences stored in browser's local storage
- Search queries processed directly by your browser
- History suggestions generated from local browser data
- No history data storage or analysis

**4. Required Permissions**

| Permission | Purpose | Data Access |
| --- | --- | --- |
| `history` | Provide history-based suggestions | Read-only access to URL/titles |
| `storage` | Save user settings | Local device only |
| `unlimitedStorage` | Store background images | Images never leave device |
| `tabs` | Open new tabs | No content accessed |

**5. Browser History Handling**
- History access is read-only
- No history data is stored or transmitted
- Suggestions only use URL and page title
- No browsing behavior analysis
- History data remains on your device

**7. User Rights**

You retain full control over:
- Enabling/disabling history suggestions
- Clearing browser history via browser settings
- Disabling history permission through extension management
- Viewing/editing search suggestions 