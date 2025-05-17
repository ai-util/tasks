# Product Requirements Document: Task Board Interface `ai-util/tasks` for file based stored tasks

---

## 1. Introduction

This document outlines the product requirements for the development of a task board interface for the `ai-util/tasks` system. This web-based interface is designed to visually represent, manage, and edit markdown-based task files in a kanban-style board. The interface integrates task metadata from markdown files and board configurations from a YAML file to deliver a dynamic, editable task management experience tailored for technical users and project maintainers.

---

## 2. Product overview

The `ai-util/tasks` board interface is a Vue.js-based web application that displays tasks from markdown files grouped by their states, as defined in a `board.yaml` configuration file. The system supports editing, drag-and-drop task state management, new task creation, and real-time synchronization with the underlying file system. Tailored primarily for developer-oriented project environments, it acts as a visual layer over a file-based task system.

---

## 3. Goals and objectives

- Provide a real-time, editable, and visual representation of tasks using data from markdown files.
- Facilitate seamless task management including editing, state transitions, and file-based persistence.
- Enable real-time synchronization with the file system to reflect any external changes.
- Ensure the system is easily extensible and maintainable using modern UI technologies (Vue.js and TailwindCSS).

---

## 4. Target audience

- Software developers and technical project managers using markdown-based task tracking.
- Teams maintaining open-source or internal projects with flat-file task organization.
- Users preferring local-first task management with a visual interface.

---

## 5. Features and requirements

### 5.1 Board configuration

- **FR1.1** Load board configuration from `tasks/board.yaml`.
- **FR1.2** Display and edit the board title.
- **FR1.3** Render columns corresponding to task states defined in `board.yaml`.
- **FR1.4** Include an "Unknown state" section for misconfigured or undefined task states.

### 5.2 Task management

- **FR2.1** Load all `.md` files in the `tasks/` directory.
- **FR2.2** Place each task in the column based on its `state` frontmatter.
- **FR2.3** Enforce filename format `ID-Name.md`, where `ID` is a unique numeric identifier.
- **FR2.4** Display task description extracted from the markdown body.

### 5.3 Task editing

- **FR3.1** On task click, open an edit dialog with fields: title (updates filename), state, description, and any additional fields from `board.yaml`.
- **FR3.2** Persist changes to the task's `.md` file (frontmatter and content).

### 5.4 Task interaction

- **FR4.1** Allow tasks to be dragged between state columns.
- **FR4.2** Update the task's `state` field in the `.md` file on drag-and-drop.
- **FR4.3** Enable new task creation from the UI, saved as a `.md` file with valid naming format.
- **FR4.4** Support task archiving or deletion by removing or moving the file.

### 5.5 Board state management

- **FR5.1** Allow state name edits within the UI.
- **FR5.2** On renaming a state:
  - Update `board.yaml`.
  - Update all task files referencing the old state.

### 5.6 Data sync

- **FR6.1** Poll the `tasks` directory every few seconds for changes.
- **FR6.2** Refresh UI to reflect updated file content when changes are detected.

### 5.7 UI technology stack

- **FR7.1** Use Vue.js for reactive UI rendering.
- **FR7.2** Style the application using TailwindCSS for consistent and modern UI.

---

## 6. User stories and acceptance criteria

| ID     | User Story                                                                 | Acceptance Criteria                                                                                              |
|--------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| ST-101 | As a user, I want to view tasks grouped by state on a board.               | Tasks appear under correct state columns based on `state` frontmatter.                                           |
| ST-102 | As a user, I want to edit task details via a dialog.                       | Edit dialog shows editable fields and updates file upon save.                                                    |
| ST-103 | As a user, I want to drag a task to a new column to change its state.      | Dragging updates the file's `state` frontmatter.                                                                 |
| ST-104 | As a user, I want to create a new task from the UI.                        | New `.md` file is generated with unique ID and correct format.                                                   |
| ST-105 | As a user, I want to remove/archive a task.                                | File is deleted or moved appropriately.                                                                          |
| ST-106 | As a user, I want to edit state names from the board interface.            | State name changes are reflected in `board.yaml` and all task files.                                             |
| ST-107 | As a user, I want to edit the board title.                                 | Board title field is editable and persists changes.                                                              |
| ST-108 | As a user, I want the UI to reflect file system changes automatically.     | File changes in `tasks/` trigger a refresh and accurate re-render.                                               |
| ST-109 | As a developer, I want to be sure filenames are in `ID-Name.md` format.    | Validation enforces filename rules and rejects invalid formats.                                                  |
| ST-110 | As a user, I want tasks with invalid or missing states shown separately.   | These tasks appear in an "Unknown state" section.                                                                |
| ST-111 | As a user, I want to edit additional custom fields if defined.             | Edit dialog dynamically includes extra fields based on `board.yaml`.                                             |
| ST-112 | As a user, I want to securely access the board (if user-based access).     | (Optional) Authenticated access and user-specific task visibility.                                               |
| ST-113 | As a developer, I want to model task data for internal operations.         | Task data model captures ID, title, state, description, and dynamic fields.                                      |
| ST-114 | As a user, I want real-time, error-free state updates across the board.    | After any task move, file changes are validated and UI shows no inconsistent states.                             |

---

## 7. Technical requirements / stack

### 7.1 Frontend

- **Framework**: Vue.js 3
- **Styling**: TailwindCSS
- **State Management**: Vuex oder Pinia (empfohlen)
- **WebSocket Client**: Socket.io-Client für Echtzeit-Updates

### 7.2 Backend

- **Server**: Node.js mit Express
- **WebSocket**: Socket.io für Echtzeit-Kommunikation
- **Dateisystem-Überwachung**: 
  - `chokidar` für zuverlässige Dateisystem-Überwachung
  - Automatische Erkennung von Änderungen in `.md` und `.yaml` Dateien
- **API-Endpunkte**:
  - GET `/api/board` - Board-Konfiguration abrufen
  - GET `/api/tasks` - Alle Tasks abrufen
  - POST `/api/tasks` - Neuen Task erstellen
  - PUT `/api/tasks/:id` - Task aktualisieren
  - DELETE `/api/tasks/:id` - Task löschen
- **WebSocket-Events**:
  - `task:created` - Neuer Task erstellt
  - `task:updated` - Task aktualisiert
  - `task:deleted` - Task gelöscht
  - `board:updated` - Board-Konfiguration geändert

### 7.3 Datenformat

- **Tasks**: Markdown-Dateien mit YAML-Frontmatter
- **Board-Konfiguration**: `board.yaml`

### 7.4 Echtzeit-Synchronisation

- Server überwacht das `tasks/` Verzeichnis kontinuierlich
- Änderungen werden sofort über WebSocket an verbundene Clients übertragen
- Frontend aktualisiert UI automatisch bei Empfang von WebSocket-Events

---

## 8. Design and user interface

### 8.1 Board layout

- **Header**: Editable board title, control icons
- **Columns**: One for each state in `board.yaml`, plus "Unknown state"
- **Tasks**: Cards displaying title, description snippet, state badge

### 8.2 Task dialog

- Modal popup on click
- Fields:
  - Title (linked to filename)
  - State (dropdown)
  - Description (markdown textarea)
  - Dynamic fields (from board config)

### 8.3 Controls

- **Top bar**: Add task, Edit board, Save, Sync
- **Per-task menu**: Edit, Archive/Delete
- **Drag handles**: For moving tasks between columns

### 8.4 Styling

- Consistent Tailwind-based themes
- Use of badges, hover effects, and modals
- Responsive layout for desktop/tablet use
