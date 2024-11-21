import "./popup.css";

document.getElementById("extract")?.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "inject_content_script" }, (response: { status: string; error?: string }) => {
    if (response?.status === "success") {
      console.log("Content script injected successfully");

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            { action: "extract_data" },
            (response: { data?: any[]; error?: string }) => {
              if (response?.data) {
                console.log("Data received in popup:", response.data);
                const output = document.getElementById("output");
                if (output) output.textContent = JSON.stringify(response.data, null, 2);
              } else if (response?.error) {
                console.error("Error from content script:", response.error);
                const output = document.getElementById("output");
                if (output) output.textContent = `Error: ${response.error}`;
              } else {
                console.error("No data received from content script.");
              }
            }
          );
        }
      });
    } else {
      console.error("Failed to inject content script:", response?.error);
      const output = document.getElementById("output");
      if (output) output.textContent = `Injection error: ${response?.error || "Unknown error"}`;
    }
  });
});
