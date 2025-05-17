---
title: Board Konfiguration
state: Done
---
# Board-Konfiguration

## Anforderungen

- Laden der Board-Konfiguration aus `tasks/board.yaml`
- Anzeige und Bearbeitung des Board-Titels
- Rendering von Spalten entsprechend der in `board.yaml` definierten States
- "Unknown state" Sektion für fehlkonfigurierte oder undefinierte Task-States

## Implementierung

- Backend-API-Endpunkte für Board-Operationen:
  - GET `/api/board` - Board-Konfiguration abrufen
  - PUT `/api/board` - Board-Konfiguration aktualisieren
  - GET `/api/board/states` - Verfügbare States abrufen
- Frontend-Integration über API-Client
- WebSocket-Events für Echtzeit-Updates
- Validierung der Board-Konfiguration

## Technische Details

- YAML-Parsing und -Validierung im Backend
- Socket.io für Echtzeit-Updates
- State-Validierung und -Verwaltung
- Fehlerbehandlung bei ungültigen Konfigurationen
- Automatische Aktualisierung aller betroffenen Tasks bei State-Änderungen 