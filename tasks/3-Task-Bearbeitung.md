---
title: Task Bearbeitung
state: Backlog
---
# Task-Bearbeitung

## Anforderungen

- Bearbeitungsdialog bei Task-Klick mit Feldern:
  - Titel (aktualisiert Dateinamen)
  - State (Dropdown)
  - Beschreibung (Markdown-Textbereich)
  - Zusätzliche Felder aus `board.yaml`
- Persistierung von Änderungen in der Task-`.md` Datei

## Implementierung

- Backend-API-Endpunkte für Task-Bearbeitung:
  - PUT `/api/tasks/:id` - Task aktualisieren
  - GET `/api/tasks/:id` - Task-Details abrufen
- Frontend-Integration über API-Client
- WebSocket-Events für Echtzeit-Updates
- Validierung der Task-Daten

## Technische Details

- Frontmatter-Parsing und -Validierung
- Dateinamen-Validierung und -Aktualisierung
- Markdown-Editor-Integration
- Optimistische UI-Updates
- Fehlerbehandlung und Rollback
- Automatische Datei-Backups vor Änderungen 