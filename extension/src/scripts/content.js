chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "extract_data") {
        (async () => {
            try {
                chrome.runtime.sendMessage({ action: "scraping_status", status: "Scraping in progress..." });

                const allTracks = new Map();

                const scrollToLoadAllTracks = async () => {
                    let previousLastTrackTitle = null;
                    let iterationCount = 0;
                    const scrollDelay = 1200;

                    do {
                        const tracks = document.querySelectorAll('[data-testid="tracklist-row"]');
                        const lastTrack = tracks[tracks.length - 1];

                        if (lastTrack) {
                            lastTrack.scrollIntoView({ behavior: "smooth", block: "end" });
                        }

                        await new Promise((resolve) => setTimeout(resolve, scrollDelay));

                        const currentLastTrackTitle = lastTrack
                            ?.querySelector('.standalone-ellipsis-one-line')
                            ?.textContent?.trim() || 'Unknown';

                        if (currentLastTrackTitle === previousLastTrackTitle) {
                            console.log("No new tracks detected. Stopping scroll.");
                            break;
                        }

                        previousLastTrackTitle = currentLastTrackTitle;

                        tracks.forEach((track) => {
                            const titre = track.querySelector('.standalone-ellipsis-one-line')?.textContent?.trim() || 'Unknown';
                            const artistElements = track.querySelectorAll('.encore-text-body-small a');
                            const artists = Array.from(artistElements)
                                .map((artist) => artist.textContent?.trim() || 'Unknown')
                                .join(', ');
                            const image = track.querySelector('img')?.getAttribute('src') || 'No image';
                            const duration = track.querySelector('.l5CmSxiQaap8rWOOpEpk')?.textContent?.trim() || 'Unknown';

                            const trackKey = `${titre}-${artists}`;
                            if (!allTracks.has(trackKey)) {
                                allTracks.set(trackKey, { titre, artists, image, duration });
                            }
                        });

                        iterationCount++;
                    } while (true);

                    console.log(`Finished scrolling. Total unique tracks loaded: ${allTracks.size}`);
                };

                await scrollToLoadAllTracks();

                const data = Array.from(allTracks.values());
                const backendUrl = "http://localhost:3000/tracks";
                const response = await fetch(backendUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    chrome.runtime.sendMessage({ action: "scraping_status", status: "Scraping done. Data sent to backend." });
                } else {
                    console.error("Failed to send data to backend:", await response.text());
                    chrome.runtime.sendMessage({ action: "scraping_status", status: "Error sending data to backend" });
                }

                sendResponse({ data });
            } catch (error) {
                chrome.runtime.sendMessage({ action: "scraping_status", status: "Error while scraping" });
                console.error("Error during scrolling or extraction:", error.message || error);
                sendResponse({ error: error.message || "Unknown error occurred" });
            }
        })();
        return true;
    }
});
