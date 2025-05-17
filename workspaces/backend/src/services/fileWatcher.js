import chokidar from 'chokidar';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { parseTaskFile, parseBoardConfig } from '../utils/fileUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TASKS_DIR = join(__dirname, '../../../tasks');

export function setupFileWatcher(io) {
  const watcher = chokidar.watch([
    join(TASKS_DIR, '*.md'),
    join(TASKS_DIR, 'board.yaml')
  ], {
    ignored: /(^|[\/\\])\../,
    persistent: true
  });

  watcher
    .on('add', async (path) => {
      console.log(`File ${path} has been added`);
      if (path.endsWith('.md')) {
        const task = await parseTaskFile(path);
        io.emit('task:created', task);
      } else if (path.endsWith('board.yaml')) {
        const board = await parseBoardConfig(path);
        io.emit('board:updated', board);
      }
    })
    .on('change', async (path) => {
      console.log(`File ${path} has been changed`);
      if (path.endsWith('.md')) {
        const task = await parseTaskFile(path);
        io.emit('task:updated', task);
      } else if (path.endsWith('board.yaml')) {
        const board = await parseBoardConfig(path);
        io.emit('board:updated', board);
      }
    })
    .on('unlink', (path) => {
      console.log(`File ${path} has been removed`);
      if (path.endsWith('.md')) {
        const taskId = path.split('/').pop().replace('.md', '');
        io.emit('task:deleted', { id: taskId });
      }
    });

  return watcher;
} 