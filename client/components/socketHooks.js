import React from 'react'

import { refreshCameraList } from '../state/localDB.js'
import useBulkTaskState from '../state/useBulkTaskState.js'

// State of the underlying Socket.io connections
import useSocketState from '../state/useSocketState.js'

export function useServerSockets (serverList) {
  // Subscribe to socket.io connection state
  const { socketList, updateServerSockets } = useSocketState(state => state)
  const { completeBulkTask } = useBulkTaskState(state => state)

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
        console.log('Download started for camera', camIndex, 'on server', serverId)
      })
      socket.on('DownloadEnd', ({ camIndex }) => {
        console.log('Download complete for camera', camIndex, 'on server', serverId)
      })

      // Receive bulk task events
      socket.off('BulkTaskSucceeded')
      socket.off('BulkTaskFailed')
      socket.on('BulkTaskSucceeded', ({ taskId, summary }) => {
        console.log('Bulk task finished', taskId)
        completeBulkTask(taskId, false, summary)
      })
      socket.on('BulkTaskFailed', ({ taskId, summary }) => {
        console.error('Failed bulk task', taskId)
        completeBulkTask(taskId, true, summary)
      })
    })
  }, [completeBulkTask, socketList])
}
