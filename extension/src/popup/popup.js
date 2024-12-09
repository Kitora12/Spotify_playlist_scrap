document.getElementById("extract")?.addEventListener("click", () => {
    const scrapingStatus = document.getElementById("scraping-status");
    if (scrapingStatus) scrapingStatus.textContent = "Scraping in progress...";
  
    chrome.runtime.sendMessage({ action: "inject_content_script" }, (response) => {
      if (response?.status === "success") {
  
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.id) {
            chrome.tabs.sendMessage(
              tabs[0].id,
              { action: "extract_data" },
              (response) => {
                if (response?.data) {
                  console.log("Data received in popup:", response.data);
                  const output = document.getElementById("output");
                  if (output) output.textContent = JSON.stringify(response.data, null, 2);
                  if (scrapingStatus) scrapingStatus.textContent = "Scraping done.";
                } else if (response?.error) {
                  console.error("Error from content script:", response.error);
                  const output = document.getElementById("output");
                  if (output) output.textContent = `Error: ${response.error}`;
                  if (scrapingStatus) scrapingStatus.textContent = "Erreur while scraping.";
                } else {
                  console.error("No data received from content script.");
                  if (scrapingStatus) scrapingStatus.textContent = "Unknown error.";
                }
              }
            );
          }
        });
      } else {
        console.error("Failed to inject content script:", response?.error);
        const output = document.getElementById("output");
        if (output) output.textContent = `Injection error: ${response?.error || "Unknown error"}`;
        if (scrapingStatus) scrapingStatus.textContent = "Error while injecting the script.";
      }
    });
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "scraping_status") {
      const scrapingStatus = document.getElementById("scraping-status");
      if (scrapingStatus) scrapingStatus.textContent = message.status;
    }
  });
  