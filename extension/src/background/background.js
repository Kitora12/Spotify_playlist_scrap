chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "inject_content_script") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            files: ["src/scripts/content.js"],
          },
          () => {
            if (chrome.runtime.lastError) {
              sendResponse({ status: "error", error: chrome.runtime.lastError.message });
            } else {
              sendResponse({ status: "success" });
            }
          }
        );
      }
    });
    return true;
  }
}); 