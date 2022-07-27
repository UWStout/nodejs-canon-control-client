import React from 'react'

import { refreshCameraList } from '../state/localDB.js'
import useBulkTaskState from '../state/useBulkTaskState.js'
import useCaptureState from '../state/useCaptureState.js'

// State of the underlying Socket.io connections
import useSocketState from '../state/useSocketState.js'

export function useServerSockets (serverList) {
  // Subscribe to socket.io connection state
  const { socketList, updateServerSockets } = useSocketState(state => state)
  const completeBulkTask = useBulkTaskState(state => state.completeBulkTask)
  const { downloadStarted, downloadFinished } = useCaptureState(state => ({
    downloadStarted: state.downloadStarted,
    downloadFinished: state.downloadFinished
  }))

  // Ensure the low-level socket connections are up to date
  React.useEffect(() => {
    if (Array.isArray(serverList)) {
      updateServerSockets(serverList)
    }
  }, [serverList, updateServerSockets])

  React.useEffect(() => {
    // Setup callbacks for all the sockets in the list
    socketList.forEach(({ socket, serverId }) => {
      // Subscribe to the events we are interested in
      socket.emit('subscribe', ['CameraList', 'Download-*'])

      // Receive changes in the camera list
      socket.off('CameraListUpdate')
      socket.on('CameraListUpdate', (newList) => {
        console.log('New camera list received')
        refreshCameraList(newList, serverId)
      })

      // Receive download events
      socket.off('DownloadStart')
      socket.off('DownloadEnd')
      socket.on('DownloadStart', ({ camIndex }) => {
        downloadStarted(serverId, camIndex)
      })
      socket.on('DownloadEnd', ({ camIndex }) => {
        downloadFinished(serverId, camIndex, false)
      })

      // Receive bulk task events
      socket.off('BulkTaskStarted')
      socket.off('BulkTaskSucceeded')
      socket.off('BulkTaskFailed')
      socket.on('BulkTaskSucceeded', ({ taskId, summary }) => {
        completeBulkTask(taskId, false, summary)
      })
      socket.on('BulkTaskFailed', ({ taskId, summary }) => {
        completeBulkTask(taskId, true, summary)
      })
    })
  }, [completeBulkTask, downloadFinished, downloadStarted, serverList, socketList])
}
