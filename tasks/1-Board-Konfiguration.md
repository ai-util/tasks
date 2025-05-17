---
title: Board Konfiguration
state: Backlog
priority: high
---
# Board-Konfiguration

## Anforderungen

- Laden der Board-Konfiguration aus `tasks/board.yaml`
- Anzeige und Bearbeitung des Board-Titels
- Rendering von Spalten entsprechend der in `board.yaml` definierten Task-States
- "Unknown state" Sektion für fehlkonfigurierte oder undefinierte Task-States

## Implementierung

### Frontend
- Vue.js Komponenten für Board-Darstellung
- TailwindCSS für Styling
- Drag-and-Drop Integration
- WebSocket-Client für Echtzeit-Updates

### Backend
- API-Endpunkte für Board-Operationen:
  - GET `/api/board` - Board-Konfiguration abrufen
  - PUT `/api/board` - Board-Konfiguration aktualisieren
  - GET `/api/board/states` - Verfügbare States abrufen
- WebSocket-Events für Echtzeit-Updates
- YAML-Parsing und -Validierung
- Dateisystem-Operationen

## Technische Details

### Frontend
- Vue.js 3 Composition API
- TailwindCSS für Styling
- Socket.io-Client für WebSocket
- Axios für API-Kommunikation
- Responsive Design

### Backend
- Node.js mit Express
- Socket.io für WebSocket
- YAML-Parsing mit js-yaml
- Dateisystem-Überwachung mit chokidar
- Validierung und Fehlerbehandlung

## API-Spezifikation

### GET /api/board
```json
{
  "title": "Board Titel",
  "states": ["Backlog", "In Progress", "Done"]
}
```

### PUT /api/board
```json
{
  "title": "Neuer Board Titel",
  "states": ["Backlog", "In Progress", "Review", "Done"]
}
```

### WebSocket Events
- `board:updated` - Board-Konfiguration wurde aktualisiert
- `state:added` - Neuer State wurde hinzugefügt
- `state:removed` - State wurde entfernt
- `state:renamed` - State wurde umbenannt

## Status
- [x] Backend-API für Board-Operationen
- [x] YAML-Parsing und -Validierung
- [x] WebSocket-Events für Board-Updates
- [ ] Frontend-Integration der Board-API
- [ ] UI für Board-Konfiguration
- [ ] Validierung und Fehlerbehandlung 