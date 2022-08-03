import create from 'zustand'

const useBulkTaskState = create(set => ({
  task: null,
  completeCount: 0,
  failedCount: 0,
  serverInfo: [],
  done: true,

  newBulkTask: (type, serverIds) => set(state => {
    console.log('New Bulk Task:', type, serverIds)
    return {
      task: { type },
      completeCount: 0,
      failedCount: 0,
      serverInfo: serverIds.map(id => ({ taskId: id })),
      done: false
    }
  }),

  completeBulkTask: (taskId, failed = false, summary) => set(state => {
    const index = state.serverInfo.findIndex(info => info.taskId === taskId)
    if (index >= 0) {
      const newServerInfo = [...state.serverInfo]
      newServerInfo[index].summary = summary
      const done = (state.completeCount + 1 === newServerInfo.length)
      if (done) {
        console.log('Bulk task complete')
      }

      return {
        serverInfo: newServerInfo,
        failedCount: state.failedCount + (failed ? 1 : 0),
        completeCount: state.completeCount + 1,
        done
      }
    } else {
      console.error('Bulk task not found', taskId)
    }
  })
}))

// Expose for other modules to import
export default useBulkTaskState
