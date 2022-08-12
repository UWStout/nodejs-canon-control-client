import create from 'zustand'

const useTriggerTaskState = create(set => ({
  triggerActive: false,
  serverId: -1,
  boxIndex: -1,
  currentState: '',

  startTriggerTask: (serverId, boxIndex) => set(state => {
    return {
      triggerActive: true,
      serverId,
      boxIndex,
      currentState: ''
    }
  }),

  updateTriggerTask: (taskState) => set(state => {
    const triggerActive = !(
      taskState.type === 'release:complete' ||
      taskState.type === 'release:error'
    )

    if (taskState.boxIndex !== state.boxIndex) {
      console.error('Unexpected trigger event with new box index')
    }

    return {
      triggerActive,
      boxIndex: taskState.boxIndex,
      currentState: taskState.type
    }
  })
}))

// Expose for other modules to import
export default useTriggerTaskState
