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
    // Does this state indicate a trigger no longer active?
    const triggerActive = !(
      taskState.type.includes(':complete') ||
      taskState.type.includes(':error')
    )

    // Is this message from an unexpected box?
    if (state.boxIndex !== -1 && taskState.boxIndex !== state.boxIndex) {
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
