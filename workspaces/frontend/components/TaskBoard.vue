<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">{{ board.title }}</h1>
        <button
          @click="openNewTaskDialog"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Neuer Task
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <TaskColumn
          v-for="state in board.states"
          :key="state"
          :title="state"
          :tasks="getTasksByState(state)"
          @edit="editTask"
          @move="moveTask"
        />
      </div>
    </div>

    <TaskDialog
      v-model="showDialog"
      :task="currentTask"
      :states="board.states"
      @saved="handleTaskSaved"
      @error="handleTaskError"
    />

    <Notification
      v-if="notification.show"
      :type="notification.type"
      :title="notification.title"
      :message="notification.message"
      @close="notification.show = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { io } from 'socket.io-client';
import axios from 'axios';
import TaskColumn from './TaskColumn.vue';
import TaskDialog from './TaskDialog.vue';
import Notification from './Notification.vue';

// Axios-Konfiguration
const api = axios.create({
  baseURL: 'http://localhost:3000'
});

// WebSocket-Konfiguration
const socket = io('http://localhost:3000', {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

const board = ref({ states: [] });
const tasks = ref([]);
const showDialog = ref(false);
const currentTask = ref({});
const notification = ref({
  show: false,
  type: 'info',
  title: '',
  message: ''
});

// WebSocket Event Listener
socket.on('connect', () => {
  console.log('WebSocket verbunden');
});

socket.on('disconnect', () => {
  console.log('WebSocket getrennt');
});

socket.on('taskUpdated', (updatedTask) => {
  console.log('Task aktualisiert empfangen:', updatedTask);
  const index = tasks.value.findIndex(t => t.id === updatedTask.id);
  if (index !== -1) {
    // Task im Array aktualisieren
    tasks.value[index] = { ...updatedTask };
    // Vue's Reaktivität erzwingen
    tasks.value = [...tasks.value];
    showNotification('success', 'Task aktualisiert', 'Der Task wurde aktualisiert');
  } else {
    console.warn('Task nicht gefunden:', updatedTask.id);
  }
});

socket.on('taskCreated', (task) => {
  console.log('Task erstellt empfangen:', task);
  // Prüfen ob Task bereits existiert
  const exists = tasks.value.some(t => t.id === task.id);
  if (!exists) {
    tasks.value.push(task);
    showNotification('success', 'Task erstellt', 'Der Task wurde erstellt');
  }
});

socket.on('taskDeleted', (taskId) => {
  console.log('Task gelöscht empfangen:', taskId);
  const index = tasks.value.findIndex(t => t.id === taskId);
  if (index !== -1) {
    tasks.value.splice(index, 1);
    showNotification('success', 'Task gelöscht', 'Der Task wurde gelöscht');
  }
});

socket.on('boardUpdated', (updatedBoard) => {
  console.log('Board aktualisiert empfangen:', updatedBoard);
  board.value = { ...updatedBoard };
  showNotification('info', 'Board aktualisiert', 'Das Board wurde aktualisiert');
});

// Hilfsfunktionen
const getTasksByState = (state) => {
  return tasks.value.filter(task => task.state === state);
};

const openNewTaskDialog = () => {
  currentTask.value = {};
  showDialog.value = true;
};

const editTask = (task) => {
  currentTask.value = { ...task };
  showDialog.value = true;
};

const moveTask = async (taskId, newState) => {
  try {
    const task = tasks.value.find(t => t.id === taskId);
    if (task && task.state !== newState) {
      await api.put(`/api/tasks/${taskId}`, {
        title: task.title,
        description: task.description,
        state: newState
      });
      
      // Lokale Task-Liste aktualisieren
      const updatedTask = { ...task, state: newState };
      const index = tasks.value.findIndex(t => t.id === taskId);
      if (index !== -1) {
        tasks.value[index] = updatedTask;
      }
    }
  } catch (error) {
    console.error('Fehler beim Verschieben des Tasks:', error);
    showNotification('error', 'Fehler', 'Der Task konnte nicht verschoben werden');
  }
};

const handleTaskSaved = (result) => {
  showNotification(result.type, result.type === 'success' ? 'Erfolg' : 'Info', result.message);
};

const handleTaskError = (result) => {
  showNotification(result.type, 'Fehler', result.message);
};

const showNotification = (type, title, message) => {
  notification.value = {
    show: true,
    type,
    title,
    message
  };
};

// Initiales Laden
onMounted(async () => {
  try {
    const [boardResponse, tasksResponse] = await Promise.all([
      api.get('/api/board'),
      api.get('/api/tasks')
    ]);
    board.value = boardResponse.data;
    tasks.value = tasksResponse.data;
  } catch (error) {
    console.error('Fehler beim Laden der Daten:', error);
    showNotification('error', 'Fehler', 'Die Daten konnten nicht geladen werden');
  }
});

// Cleanup bei Komponenten-Unmount
onUnmounted(() => {
  socket.disconnect();
});
</script>

<style scoped>
.flex-nowrap {
  flex-wrap: nowrap;
}

.overflow-x-auto {
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: #CBD5E0 #EDF2F7;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #EDF2F7;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #CBD5E0;
  border-radius: 4px;
}
</style> 