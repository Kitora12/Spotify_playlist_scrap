chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "inject_content_script") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            files: ["dist/content.js"],
          },
          () => {
            if (chrome.runtime.lastError) {
              console.error("Content script injection failed:", chrome.runtime.lastError.message);
              sendResponse({ status: "error", error: chrome.runtime.lastError.message });
            } else {
              console.log("Content script injected successfully");
              sendResponse({ status: "success" });
            }
          }
        );
      }
    });

    return true;
  }
});
