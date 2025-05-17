<template>
  <div class="bg-gray-50 rounded-lg p-4">
    <h2 class="text-lg font-semibold mb-4">{{ title }}</h2>
    <div 
      class="space-y-4 min-h-[200px]"
      @dragover.prevent
      @drop="onDrop"
    >
      <div
        v-for="task in tasks"
        :key="task.id"
        class="bg-white p-4 rounded shadow cursor-move hover:shadow-md transition-shadow"
        draggable="true"
        @dragstart="onDragStart($event, task)"
        @click="$emit('edit', task)"
      >
        <h3 class="font-medium">{{ task.title }}</h3>
        <p class="text-gray-600 text-sm mt-2 line-clamp-2">{{ task.description }}</p>
        <div class="mt-3 flex items-center justify-between">
          <span class="text-xs text-gray-500">{{ formatDate(task.createdAt) }}</span>
          <span 
            class="px-2 py-1 text-xs rounded-full"
            :class="getPriorityClass(task.priority)"
          >
            {{ task.priority }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  tasks: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['edit', 'move']);

const onDragStart = (event, task) => {
  event.dataTransfer.setData('taskId', task.id);
  event.dataTransfer.setData('sourceState', props.title);
};

const onDrop = (event) => {
  const taskId = event.dataTransfer.getData('taskId');
  const sourceState = event.dataTransfer.getData('sourceState');
  
  if (sourceState !== props.title) {
    emit('move', {
      taskId,
      sourceState,
      targetState: props.title
    });
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const getPriorityClass = (priority) => {
  const classes = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };
  return classes[priority] || 'bg-gray-100 text-gray-800';
};
</script> 