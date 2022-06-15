import React from 'react'

import useServerStore from '../state/useServerStore.js'
import useCameraStore from '../state/useCameraStore.js'
import useGlobalState from '../state/useGlobalState.js'

import { getCameraList } from '../helpers/serverHelper.js'

import { List, ListSubheader } from '@mui/material'

import CameraListItem from './CameraListItem.jsx'
import CameraListItemReadOnly from './CameraListItemReadOnly.jsx'

export default function CameraList () {
  // Subscribe to server and camera stores
  const { serverList } = useServerStore(state => state)
  const { cameraList, addCameras } = useCameraStore(state => state)
  const { bulkModeEnabled } = useGlobalState(state => state)

  // Syncronize camera list when servers change
  React.useEffect(() => {
    // Async function to update list of cameras
    const updateCameraList = async () => {
      for (let i = 0; i < serverList.length; i++) {
        const server = serverList[i]

        // Retrieve latest list of cameras
        const newCamsList = await getCameraList(server)
        addCameras(newCamsList, server.IP)
      }
    }

    // Start async function
    updateCameraList()
  }, [addCameras, serverList])

  // Build camera widget list
  let cameraListItems = []
  Object.keys(cameraList).forEach((serverIP) => {
    const newCameraListItems = cameraList[serverIP].map((camera) => (
      (bulkModeEnabled
        ? <CameraListItemReadOnly key={`${camera.BodyIDEx.value}RO`} cameraSummary={camera} serverIP={serverIP} />
        : <CameraListItem key={camera.BodyIDEx.value} cameraSummary={camera} serverIP={serverIP} />)
    ))
    cameraListItems = [
      ...cameraListItems,
      <ListSubheader key={serverIP} sx={{ borderTop: '1px solid lightgrey', borderBottom: '1px solid lightgrey' }}>
        {serverIP}
      </ListSubheader>,
      ...newCameraListItems
    ]
  })

  return (
    <React.StrictMode>
      <List sx={{ padding: 0, width: '100%', bgcolor: 'background.paper', overflow: 'auto', maxHeight: '90vh' }}>
        {cameraListItems}
      </List>
    </React.StrictMode>
  )
}
