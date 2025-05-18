import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { setupFileWatcher } from './services/fileWatcher.js';
import { setupRoutes } from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Statische Dateien aus dem tasks-Verzeichnis
app.use(express.static(join(__dirname, '../../../tasks')));

// Routen einrichten
setupRoutes(app);

// Frontend-Build servieren (nur im Produktionsmodus)
if (process.env.NODE_ENV === 'production') {
  // Zuerst statische Dateien aus dem Frontend-Build
  app.use(express.static(join(__dirname, '../../../workspaces/frontend/dist')));
  
  // Dann die Catch-All-Route für das Frontend
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../../../workspaces/frontend/dist/index.html'));
  });
}

// WebSocket-Verbindung
io.on('connection', (socket) => {
  console.log('Client verbunden:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client getrennt:', socket.id);
  });
});

// Dateisystem-Überwachung einrichten
setupFileWatcher(io);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
}); 