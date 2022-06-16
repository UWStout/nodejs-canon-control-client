import React from 'react'

import useServerStore from '../state/useServerStore.js'
import useCameraStore from '../state/useCameraStore.js'
import useGlobalState from '../state/useGlobalState.js'

import { getCameraList } from '../helpers/serverHelper.js'

import { List, ListSubheader, Grid, Collapse } from '@mui/material'

import CameraListItem from './CameraListItem.jsx'
import BulkSettings from './BulkSettings.jsx'

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
      <CameraListItem key={camera.BodyIDEx.value} readOnly={bulkModeEnabled} cameraSummary={camera} serverIP={serverIP} />
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
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Collapse in={bulkModeEnabled} timeout="auto" unmountOnExit>
            <List sx={{ padding: 0, width: '100%', bgcolor: 'background.paper' }}>
              <BulkSettings />
            </List>
          </Collapse>
        </Grid>

        <Grid item xs={12}>
          <List sx={{ padding: 0, width: '100%', bgcolor: 'background.paper', overflow: 'auto', maxHeight: '75vh' }}>
            {cameraListItems}
          </List>
        </Grid>
      </Grid>
    </React.StrictMode>
  )
}
