export async function bulkAction (type, actionCB, serverList, bulkState, enqueueSnackbar) {
  // Loop through servers and start bulk tasks
  const taskIds = []
  for (let i = 0; i < serverList.length; i++) {
    const server = serverList[i]
    if (!server.disabled) {
      try {
        const results = await actionCB(server, '*')
        taskIds.push(results.taskId)
      } catch (error) {
        enqueueSnackbar(`${type} failed for ${server.nickname}`, { variant: 'error' })
      }
    }
  }

  // Enqueue the bulk task in bulk task state
  if (taskIds.length > 0) {
    enqueueSnackbar(`${type} started`)
    bulkState.newBulkTask(type, taskIds)
  }
}

export async function singleCamAction (type, actionCB, server, camera, enqueueSnackbar) {
  // Attempt to perform action
  try {
    if (!server || !camera) {
      throw new Error(`Cannot ${type}: server and/or camera are null (${server?.id}/${camera?.id})`)
    } else {
      await actionCB(server, camera)
    }
  } catch (error) {
    enqueueSnackbar(`Failed to ${type} on camera ${camera?.nickname || camera?.BodyIDEx?.value}`, { variant: 'error' })
    console.error(error)
  }
}
