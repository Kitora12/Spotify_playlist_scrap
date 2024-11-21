"use strict";
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "extract_data") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0].id) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    files: ["dist/scripts/content.js"]
                }, () => {
                    console.log("Script injected.");
                });
            }
        });
        sendResponse({ status: "success" });
    }
});
//# sourceMappingURL=background.js.map