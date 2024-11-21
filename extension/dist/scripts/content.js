"use strict";
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "extract_data") {
        const data = Array.from(document.querySelectorAll(".tracklist-name")).map(el => el.textContent);
        sendResponse(data);
    }
});
//# sourceMappingURL=content.js.map