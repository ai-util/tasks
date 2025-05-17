# ai-util/tasks

A task planner UI like Trello is also in the browser, but for the .md files of a repository. Add, edit, move and archive tasks in a simple UI and have all data stored in the repository.

## Files in the repository

### Board settings

- The file `tasks/board.yaml` describes the board itself with the states, e.g.:
```yaml
title: Tasks
states:
  - Ideas
  - Backlog
  - In Progress
  - Done
additionalFields:
  - assignee
    type: string
  - priority
    type: string
    options:
      - Low
      - Medium
      - High
```

### Tasks

- Each task is a separated .md file
- All .md file of the tasks are stored in the `tasks` directory
- The filename of the task is also the numeric ID and the title
- In each .md file there is a frontmatter area with the metadata of the task, e.g.:
```md
---
title: Example
state: Ideas
---
This is an example task.
```
- The content of the file is the description of the task

## UI

- The UI shows the title from the Board settings
- Bellow the title each state is an own column
- Each task is displayed in their column
- If a state is not defined in the Board settings, the task will be displayed bellow the columns in a "unknown state" area

## User interactions

- The title of the board is editable
- The names of the states are editable. If the name of a state get changed, Board settings get updated and also the state in each task get updated
- Each task is draggable from one to another column, if a state changes the field in the task file get updated
- A click on a task opens the edit dialog to edit all fields including the additional fields defined in the board settings and the description
- The UI should poll regularly every few seconds for changes in the directory and update the UI

## Tech stack

- For the UI `Vue.js` and `TailwindCSS` should be used