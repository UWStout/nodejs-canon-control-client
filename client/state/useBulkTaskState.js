import create from 'zustand'

const useBulkTaskState = create(set => ({
  taskList: {},

  addBulkTask: (id, type, snackbarKey, serverNickname) => set(state => {
    if (!state.taskList[id]) {
      console.log('Adding task', id)
      return {
        taskList: {
          ...state.taskList,
          [id]: { type, snackbarKey, serverNickname }
        }
      }
    }
  }),

  completeBulkTask: (id, failed = false, summary) => set(state => {
    if (state.taskList[id]) {
      console.log('Completing task', id)
      return {
        taskList: {
          ...state.taskList,
          [id]: {
            ...state.taskList[id],
            completed: true,
            failed,
            summary
          }
        }
      }
    }
  }),

  removeBulkTask: (id) => set(state => {
    console.log('Removing task', id)
    return {
      taskList: {
        ...state.taskList,
        [id]: undefined
      }
    }
  })
}))

// Expose for other modules to import
export default useBulkTaskState
