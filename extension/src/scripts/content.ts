async function scrollToLoadAllTracks(timeout: number = 30000): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const startTime = Date.now();
    let lastTrackCount = 0;

    const interval = setInterval(() => {
      // Défile vers le bas
      window.scrollBy(0, window.innerHeight);

      // Compte les pistes actuellement visibles
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
        lastTrackCount = currentTrackCount; // Met à jour le nombre de pistes chargées
      }
    }, 500); // Attente de 500 ms entre les défilements pour permettre le chargement
  });
}

chrome.runtime.onMessage.addListener((message: { action: string }, sender, sendResponse: (response: any) => void) => {
  if (message.action === "extract_data") {
    (async () => {
      try {
        console.log("Starting scrolling to load all tracks...");
        await scrollToLoadAllTracks(); // Attendre que toutes les pistes soient chargées
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
      } catch (error: unknown) {
        console.error("Error during scrolling or extraction:", error instanceof Error ? error.message : error);
        sendResponse({ error: error instanceof Error ? error.message : "Unknown error occurred" });
      }
    })();

    return true; // Maintient le port ouvert pour les opérations asynchrones
  }
});
