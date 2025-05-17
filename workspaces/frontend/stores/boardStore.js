import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { parse } from 'yaml'

export const useBoardStore = defineStore('board', () => {
  const boardConfig = ref(null)
  const boardTitle = ref('Task Board')
  const states = ref([])
  const unknownState = ref('Unknown')

  const loadBoardConfig = async () => {
    try {
      const response = await fetch('/tasks/board.yaml')
      const yamlText = await response.text()
      const config = parse(yamlText)
      
      boardConfig.value = config
      boardTitle.value = config.title || 'Task Board'
      states.value = config.states || []
    } catch (error) {
      console.error('Fehler beim Laden der Board-Konfiguration:', error)
      states.value = []
    }
  }

  const updateBoardTitle = (newTitle) => {
    boardTitle.value = newTitle
    // TODO: Speichern in board.yaml
  }

  const getStateColumn = (state) => {
    return states.value.includes(state) ? state : unknownState.value
  }

  return {
    boardConfig,
    boardTitle,
    states,
    unknownState,
    loadBoardConfig,
    updateBoardTitle,
    getStateColumn
  }
}) 