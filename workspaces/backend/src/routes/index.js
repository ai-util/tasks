import { Router } from 'express';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { parseTaskFile, parseBoardConfig, writeTaskFile, writeBoardConfig } from '../utils/fileUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TASKS_DIR = join(__dirname, '../../../../tasks');

const router = Router();

// Board-Konfiguration
router.get('/api/board', async (req, res) => {
  try {
    const board = await parseBoardConfig(join(TASKS_DIR, 'board.yaml'));
    res.json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/api/board', async (req, res) => {
  try {
    await writeBoardConfig(req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tasks
router.get('/api/tasks', async (req, res) => {
  try {
    const files = await readdir(TASKS_DIR);
    const tasks = await Promise.all(
      files
        .filter(file => file.endsWith('.md'))
        .map(file => parseTaskFile(join(TASKS_DIR, file), file.substring(0, file.length - 3)))
    );
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, state } = req.body;
    const metadata = { title, state };
    await writeTaskFile(title, metadata, description);
    res.json({ success: true, id: title });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, state } = req.body;
    const metadata = { title, state };
    await writeTaskFile(id, metadata, description);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export function setupRoutes(app) {
  app.use(router);
} 