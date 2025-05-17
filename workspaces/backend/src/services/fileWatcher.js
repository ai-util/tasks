import chokidar from 'chokidar';
import { fileURLToPath } from 'url';
import { dirname, join, sep } from 'path';
import { parseTaskFile, parseBoardConfig } from '../utils/fileUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TASKS_DIR = join(__dirname, '../../../../tasks');

export function setupFileWatcher(io) {
  console.log('Initialisiere FileWatcher für Verzeichnis:', TASKS_DIR);

  const watcher = chokidar.watch([
    join(TASKS_DIR, '*.md'),
    join(TASKS_DIR, 'board.yaml')
  ], {
    persistent: true,
    awaitWriteFinish: {
      stabilityThreshold: 2000,
      pollInterval: 100
    }
  });

  watcher
    .on('ready', () => {
      console.log('FileWatcher ist bereit und überwacht Dateien');
    })
    .on('error', (error) => {
      console.error('FileWatcher Fehler:', error);
    })
    .on('add', async (path) => {
      try {
        console.log(`Datei hinzugefügt: ${path}`);
        if (path.endsWith('.md')) {
          const taskId = path.split(sep).pop().replace('.md', '');
          const task = await parseTaskFile(path, taskId);
          console.log('Task erstellt:', task);
          io.emit('taskCreated', task);
        } else if (path.endsWith('board.yaml')) {
          const board = await parseBoardConfig(path);
          console.log('Board aktualisiert:', board);
          io.emit('boardUpdated', board);
        }
      } catch (error) {
        console.error('Fehler beim Verarbeiten der neuen Datei:', error);
      }
    })
    .on('change', async (path) => {
      try {
        console.log(`Datei geändert: ${path}`);
        if (path.endsWith('.md')) {
          const taskId = path.split(sep).pop().replace('.md', '');
          const task = await parseTaskFile(path, taskId);
          console.log('Task aktualisiert:', task);
          io.emit('taskUpdated', task);
        } else if (path.endsWith('board.yaml')) {
          const board = await parseBoardConfig(path);
          console.log('Board aktualisiert:', board);
          io.emit('boardUpdated', board);
        }
      } catch (error) {
        console.error('Fehler beim Verarbeiten der Änderung:', error);
      }
    })
    .on('unlink', (path) => {
      try {
        console.log(`Datei gelöscht: ${path}`);
        if (path.endsWith('.md')) {
          const taskId = path.split(sep).pop().replace('.md', '');
          console.log('Task gelöscht:', taskId);
          io.emit('taskDeleted', taskId);
        }
      } catch (error) {
        console.error('Fehler beim Verarbeiten der Löschung:', error);
      }
    });

  return watcher;
} 