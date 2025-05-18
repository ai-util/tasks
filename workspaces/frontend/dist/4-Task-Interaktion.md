---
title: Task Interaktion
state: Backlog
---
# Task-Interaktion

## Anforderungen

- Drag-and-Drop von Tasks zwischen State-Spalten
- Aktualisierung des `state` Frontmatter bei Drag-and-Drop
- Erstellung neuer Tasks über die UI
- Archivierung oder Löschung von Tasks

## Implementierung

- Backend-API-Endpunkte für Task-Interaktion:
  - PUT `/api/tasks/:id/state` - Task-State aktualisieren
  - POST `/api/tasks` - Neuen Task erstellen
  - DELETE `/api/tasks/:id` - Task löschen
- Frontend-Integration über API-Client
- WebSocket-Events für Echtzeit-Updates
- Drag-and-Drop-Integration

## Technische Details

- Drag-and-Drop mit Vue Draggable
- Optimistische UI-Updates
- State-Validierung
- Dateisystem-Operationen im Backend
- Fehlerbehandlung und Rollback
- Automatische Datei-Backups 