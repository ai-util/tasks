<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <!-- Board Header -->
    <div class="mb-6">
      <input
        v-model="boardTitle"
        @blur="updateTitle"
        class="text-2xl font-bold bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
        :placeholder="'Board Titel'"
      />
    </div>

    <!-- Main Board Columns -->
    <div class="flex flex-nowrap overflow-x-auto gap-4 pb-4">
      <!-- Known States -->
      <div v-for="state in states" :key="state" class="flex-none w-80 bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-semibold mb-4">{{ state }}</h3>
        <div class="space-y-2 min-h-[200px]">
          <!-- Tasks werden hier später hinzugefügt -->
        </div>
      </div>
    </div>

    <!-- Unknown State Section -->
    <div class="mt-8">
      <div class="w-full bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-semibold mb-4">{{ unknownState }}</h3>
        <div class="space-y-2 min-h-[200px]">
          <!-- Tasks mit unbekanntem State werden hier später hinzugefügt -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useBoardStore } from '../stores/boardStore'

const boardStore = useBoardStore()
const boardTitle = ref('')

onMounted(async () => {
  await boardStore.loadBoardConfig()
  boardTitle.value = boardStore.boardTitle
})

const updateTitle = () => {
  boardStore.updateBoardTitle(boardTitle.value)
}

const states = computed(() => boardStore.states)
const unknownState = computed(() => boardStore.unknownState)
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