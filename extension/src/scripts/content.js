function scrollToLoadAllTracks(timeout = 30000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    let lastTrackCount = 0;

    const interval = setInterval(() => {
      window.scrollBy(0, window.innerHeight);

      const currentTrackCount = document.querySelectorAll('[data-testid="tracklist-row"]').length;
      console.log(`Tracks visible: ${currentTrackCount}`);

      if (currentTrackCount === lastTrackCount || Date.now() - startTime > timeout) {
        clearInterval(interval);
        if (Date.now() - startTime > timeout) {
          console.warn("Scroll timeout exceeded");
          reject(new Error("Timeout while scrolling to load all tracks"));
        } else {
          console.log("All tracks are loaded");
          resolve();
        }
      } else {
        lastTrackCount = currentTrackCount;
      }
    }, 500);
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "extract_data") {
    (async () => {
      try {
        console.log("Starting scrolling to load all tracks...");
        await scrollToLoadAllTracks();
        console.log("Scrolling completed. Extracting data...");

        const tracks = document.querySelectorAll('[data-testid="tracklist-row"]');
        const data = Array.from(tracks).map((track) => {
          const title = track.querySelector('.encore-text-body-medium')?.textContent?.trim() || 'Unknown';
          const artistElements = track.querySelectorAll('.encore-text-body-small a');
          const artists = Array.from(artistElements)
            .map((artist) => artist.textContent?.trim() || 'Unknown')
            .join(', ');
          const album = track.querySelector('.standalone-ellipsis-one-line')?.textContent?.trim() || 'Unknown';
          const image = track.querySelector('img')?.getAttribute('src') || 'No image';
          const duration = track.querySelector('.l5CmSxiQaap8rWOOpEpk')?.textContent?.trim() || 'Unknown';

          return { title, artists, album, image, duration };
        });

        console.log(`Extracted ${data.length} tracks`);
        sendResponse({ data });
      } catch (error) {
        console.error("Error during scrolling or extraction:", error.message || error);
        sendResponse({ error: error.message || "Unknown error occurred" });
      }
    })();

    return true;
  }
}); 