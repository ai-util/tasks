import { readFile, writeFile } from 'fs/promises';
import { load } from 'js-yaml';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import frontMatter from 'front-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TASKS_DIR = join(__dirname, '../../../../tasks');

export async function parseTaskFile(filePath, id) {
  try {
    const content = await readFile(filePath, 'utf8');
    const { attributes, body } = frontMatter(content);

    return {
      id,
      ...attributes,
      description: body
    };
  } catch (error) {
    console.error(`Error parsing task file ${filePath}:`, error);
    throw error;
  }
}

export async function parseBoardConfig(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    return load(content);
  } catch (error) {
    console.error(`Error parsing board config ${filePath}:`, error);
    throw error;
  }
}

export async function writeTaskFile(taskId, metadata, description) {
  const filePath = join(TASKS_DIR, `${taskId}.md`);
  const yamlContent = `---
title: ${metadata.title}
state: ${metadata.state}
priority: ${metadata.priority}
---
${description}`;
  await writeFile(filePath, yamlContent, 'utf8');
}

export async function writeBoardConfig(config) {
  const filePath = join(TASKS_DIR, 'board.yaml');
  const content = JSON.stringify(config, null, 2);
  await writeFile(filePath, content, 'utf8');
} 