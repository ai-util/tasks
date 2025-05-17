# Functional Requirements for ai-util/tasks

## 1. Board Configuration

- **FR1.1**: Load board configuration from `tasks/board.yaml`.
- **FR1.2**: Display the board title and allow it to be edited.
- **FR1.3**: Display columns for each state defined in `board.yaml`.
- **FR1.4**: Display an "Unknown state" section for tasks with undefined states.

## 2. Task Management

- **FR2.1**: Load all `.md` task files from the `tasks` directory.
- **FR2.2**: Display each task under the corresponding state column based on its `state` frontmatter.
- **FR2.3**: The filename of each task must follow the format `ID-Name.md`, where:
  - `ID` is a unique numeric identifier
  - `Name` is the title of the task
- **FR2.4**: Display the task description from the markdown content.

## 3. Task Editing

- **FR3.1**: On task click, open an edit dialog to update:
  - Title (filename)
  - State
  - Description
  - Any additional fields defined in `board.yaml`
- **FR3.2**: Persist all edits back to the corresponding `.md` file with updated frontmatter and content.

## 4. Task Interaction

- **FR4.1**: Allow tasks to be dragged between columns.
- **FR4.2**: On drag-and-drop, update the task's `state` in its `.md` file.
- **FR4.3**: Allow creation of new tasks via the UI, resulting in a new `.md` file in the `tasks` directory with the `ID-Name.md` format.
- **FR4.4**: Allow archiving/removal of tasks, which deletes or moves the file.

## 5. Board State Management

- **FR5.1**: Allow editing of state names in the board.
- **FR5.2**: When a state is renamed, update:
  - `board.yaml`
  - All `.md` task files using the old state

## 6. Data Sync

- **FR6.1**: Poll the `tasks` directory every few seconds for file changes.
- **FR6.2**: On detection of changes, re-render the UI to reflect updates.

## 7. UI Technology Stack

- **FR7.1**: Use `Vue.js` for the frontend framework.
- **FR7.2**: Style the application using `TailwindCSS`.