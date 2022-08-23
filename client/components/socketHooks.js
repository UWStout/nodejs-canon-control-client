import React from 'react'

import { refreshCameraList } from '../state/localDB.js'
import useBulkTaskState from '../state/useBulkTaskState.js'
import useTriggerTaskState from '../state/useTriggerTaskState.js'
import useCaptureState from '../state/useCaptureState.js'

// State of the underlying Socket.io connections
import useSocketState from '../state/useSocketState.js'

export function useServerSockets (serverList) {
  // Subscribe to socket.io connection state
  const { socketList, updateServerSockets } = useSocketState(state => state)

  // Subscribe to various global state to keep it updated
  const completeBulkTask = useBulkTaskState(state => state.completeBulkTask)
  const { downloadStarted, downloadFinished } = useCaptureState(state => ({
    downloadStarted: state.downloadStarted,
    downloadFinished: state.downloadFinished
  }))

  const updateTriggerTask = useTriggerTaskState(state => state.updateTriggerTask)

  // Ensure the low-level socket connections are up to date
  React.useEffect(() => {
    if (Array.isArray(serverList)) {
      updateServerSockets(serverList)
    }
  }, [serverList, updateServerSockets])

  React.useEffect(() => {
    // Setup callbacks for all the sockets in the list
    socketList.forEach(({ socket, serverId }) => {
      // Receive changes in the camera list
      socket.off('CameraListUpdate')
      socket.on('CameraListUpdate', (newList) => {
        console.log('New camera list received')
        refreshCameraList(newList, serverId)
      })

      // Receive download events
      socket.off('DownloadStart')
      socket.off('DownloadEnd')
      socket.on('DownloadStart', ({ camIndex, filename }) => {
        downloadStarted(serverId, camIndex, filename)
      })
      socket.on('DownloadEnd', ({ camIndex, filename, exposureInfo }) => {
        downloadFinished(serverId, camIndex, filename, exposureInfo, false)
      })

      // Receive trigger task events
      socket.off('TriggerBoxEvent')
      socket.on('TriggerBoxEvent', updateTriggerTask)

      // Receive bulk task events
      socket.off('BulkTaskStarted')
      socket.off('BulkTaskSucceeded')
      socket.off('BulkTaskFailed')
      socket.on('BulkTaskSucceeded', ({ taskId, summary }) => {
        completeBulkTask(taskId, summary.failed > 0, summary)
      })
      socket.on('BulkTaskFailed', ({ taskId, summary }) => {
        completeBulkTask(taskId, true, summary)
      })

      // Other messages
      // socket.off('CameraState')
      // socket.on('CameraState', message => {
      //   console.log('State SocketMessage', message)
      // })

      // socket.off('CameraPropertyValue')
      // socket.on('CameraPropertyValue', message => {
      //   console.log('Prop Value SocketMessage', message)
      // })

      // socket.off('CameraPropertyOptions')
      // socket.on('CameraPropertyOptions', message => {
      //   console.log('Prop Options SocketMessage', message)
      // })
    })
  }, [completeBulkTask, downloadFinished, downloadStarted, serverList, socketList, updateTriggerTask])
}
