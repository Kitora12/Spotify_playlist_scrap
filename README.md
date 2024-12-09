# **Spotify Playlist Scraper**

## **Project Description**

This project scrapes Spotify playlists and saves the data (title, artists, image, duration) into a MongoDB database. It includes a backend developed with NestJS, a Chrome extension for scraping, and Docker for containerization.

Once the data is collected, it is displayed on a simple web interface using Handlebars as the template engine.

---

## **Goals**

- Extract playlist information from Spotify using a Chrome extension.
- Store the data in a MongoDB database.
- Display the scraped data through a web interface.

---

## **Prerequisites**

1. **Required Software**:
   - Docker and Docker Compose.
   - Node.js (for local development).
   - Chrome browser.

2. **Spotify Access**:
   - A Spotify account to access playlists.

---

## **Setup and Launch**

### **Step 1: Clone the Repository**

```bash
git clone https://github.com/Kitora12/Spotify_playlist_scrap.git
cd Spotify_playlist_scrap
```

---

### **Step 2: Build and Run the Project with Docker**

1. **Build the Docker Image**:

   ```bash
   docker-compose build
   ```

2. **Start the Containers**:

   ```bash
   docker-compose up
   ```

   Once started:
   - The NestJS backend will be accessible at `http://localhost:3000`.
   - MongoDB will be running inside the Docker container.

---

### **Step 3: Load the Chrome Extension**

1. Open Chrome and navigate to `chrome://extensions`.
2. Enable **Developer Mode** in the top-right corner.
3. Click **Load unpacked**.
4. Browse to the `extension` folder in the project and load it.

---

### **Step 4: Start Scraping**

1. Open Spotify in the Chrome browser.
2. Navigate to a Spotify playlist.
3. Click on the extension icon and start scraping.
4. **Important**: Do not switch tabs during scraping. The extension will automatically send the data to the backend.

---

### **Step 5: View the Data**

1. Once scraping is complete, navigate to `http://localhost:3000/tracks`.
2. The scraped data will be displayed as cards showing:
   - Song title.
   - Artists.
   - Image.
   - Duration.

---

## **Project Structure**

### **Backend (NestJS)**

The backend provides an API to:
- Receive scraped data from the Chrome extension.
- Store the data in a MongoDB database.
- Render the data as cards using Handlebars.

### **Chrome Extension**

The extension:
- Scrapes Spotify playlists visible in the browser.
- Sends the data to the backend using a POST request.

### **Docker**

- Simplifies deployment by containerizing the application and MongoDB.
- Configured using `docker-compose.yml`.

---

## **Useful Commands**

### **Rebuild and Clean Up Docker Containers**

```bash
docker-compose down
docker-compose up --build
```

---

## **Important Notes**

1. **Do Not Switch Tabs During Scraping**: This may interrupt the process.
2. Ensure MongoDB is running before starting the application.

---

## **Contributors**

- **Author**: Kitora12