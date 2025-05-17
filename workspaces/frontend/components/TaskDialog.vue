<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-8 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-bold">
          {{ task.id ? 'Task bearbeiten' : 'Neuer Task' }}
        </h2>
        <button
          @click="$emit('update:modelValue', false)"
          class="text-gray-500 hover:text-gray-700"
        >
          <span class="sr-only">Schließen</span>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="saveTask" class="space-y-6">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">Titel</label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            :class="{ 'border-red-500': errors.title }"
          />
          <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Beschreibung</label>
          <textarea
            id="description"
            v-model="formData.description"
            rows="12"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            :class="{ 'border-red-500': errors.description }"
          ></textarea>
          <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
        </div>

        <div>
          <label for="state" class="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="state"
            v-model="formData.state"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            :class="{ 'border-red-500': errors.state }"
          >
            <option v-for="state in states" :key="state" :value="state">
              {{ state }}
            </option>
          </select>
          <p v-if="errors.state" class="mt-1 text-sm text-red-600">{{ errors.state }}</p>
        </div>

        <div>
          <label for="priority" class="block text-sm font-medium text-gray-700">Priorität</label>
          <select
            id="priority"
            v-model="formData.priority"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            :class="{ 'border-red-500': errors.priority }"
          >
            <option value="low">Niedrig</option>
            <option value="medium">Mittel</option>
            <option value="high">Hoch</option>
          </select>
          <p v-if="errors.priority" class="mt-1 text-sm text-red-600">{{ errors.priority }}</p>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            @click="$emit('update:modelValue', false)"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            :disabled="isSaving"
          >
            {{ isSaving ? 'Wird gespeichert...' : 'Speichern' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';

// Axios-Konfiguration
const api = axios.create({
  baseURL: 'http://localhost:3000'
});

const props = defineProps({
  modelValue: Boolean,
  task: {
    type: Object,
    default: () => ({})
  },
  states: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'saved', 'error']);

const formData = ref({
  title: '',
  description: '',
  state: '',
  priority: 'medium'
});

const errors = ref({});
const isSaving = ref(false);

watch(() => props.task, (newTask) => {
  if (newTask.id) {
    formData.value = { ...newTask };
  } else {
    formData.value = {
      title: '',
      description: '',
      state: props.states[0] || '',
      priority: 'medium'
    };
  }
  errors.value = {};
}, { immediate: true });

const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!formData.value.title.trim()) {
    errors.value.title = 'Bitte geben Sie einen Titel ein';
    isValid = false;
  }

  if (!formData.value.state) {
    errors.value.state = 'Bitte wählen Sie einen Status aus';
    isValid = false;
  }

  if (!formData.value.priority) {
    errors.value.priority = 'Bitte wählen Sie eine Priorität aus';
    isValid = false;
  }

  return isValid;
};

const saveTask = async () => {
  if (!validateForm()) {
    return;
  }

  isSaving.value = true;
  try {
    if (props.task.id) {
      const taskData = {
        title: formData.value.title,
        description: formData.value.description,
        state: formData.value.state,
        priority: formData.value.priority
      };
      await api.put(`/api/tasks/${props.task.id}`, taskData);
      emit('saved', { type: 'success', message: 'Task erfolgreich aktualisiert' });
    } else {
      const taskData = {
        title: formData.value.title,
        description: formData.value.description,
        state: formData.value.state,
        priority: formData.value.priority
      };
      await api.post('/api/tasks', taskData);
      emit('saved', { type: 'success', message: 'Task erfolgreich erstellt' });
    }
    emit('update:modelValue', false);
  } catch (error) {
    console.error('Fehler beim Speichern des Tasks:', error);
    const message = error.response?.data?.message || 'Ein unerwarteter Fehler ist aufgetreten';
    emit('error', { type: 'error', message });
  } finally {
    isSaving.value = false;
  }
};
</script> 