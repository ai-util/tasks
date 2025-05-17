---
undefined
---
# Task-Management

## Anforderungen

- Laden aller `.md` Dateien aus dem `tasks/` Verzeichnis
- Einordnung der Tasks in Spalten basierend auf dem `state` Frontmatter
- Einhaltung des Dateinamenformats `ID-Name.md`
- Anzeige der Task-Beschreibung aus dem Markdown-Body

## Implementierung

- Backend-API für Task-Operationen:
  - GET `/api/tasks` - Alle Tasks abrufen
  - POST `/api/tasks` - Neuen Task erstellen
  - PUT `/api/tasks/:id` - Task aktualisieren
- Dateisystem-Operationen für Task-Dateien
- Validierung des Dateinamenformats
- Frontmatter-Parsing und -Validierung

## Technische Details

- Express.js für API-Endpunkte
- js-yaml für Frontmatter-Parsing
- Dateisystem-Operationen mit Node.js fs/promises
- Validierungsfunktionen für Dateinamen und Frontmatter

## Status

- [x] Backend-API für Task-Operationen
- [x] Dateisystem-Operationen
- [x] Frontmatter-Parsing
- [ ] Frontend-Integration der Task-API
- [ ] Validierung des Dateinamenformats
- [ ] Fehlerbehandlung und Benutzer-Feedback 