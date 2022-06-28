import React from 'react'

import localDB from '../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import useCameraStore from '../state/useCameraStore.js'
import useGlobalState from '../state/useGlobalState.js'

import { getCameraList } from '../helpers/serverHelper.js'

import { List, ListSubheader, Grid, Collapse } from '@mui/material'

import CameraListItem from './CameraListItem.jsx'
import BulkSettings from './BulkSettings.jsx'

export default function CameraList () {
  // Subscribe to changes to servers array
  const serverList = useLiveQuery(() => localDB.servers.toArray())

  const { cameraList, addCameras } = useCameraStore(state => state)
  const { bulkModeEnabled } = useGlobalState(state => state)

  // Syncronize camera list when servers change
  React.useEffect(() => {
    // Async function to update list of cameras
    const updateCameraList = async () => {
      if (Array.isArray(serverList)) {
        for (let i = 0; i < serverList.length; i++) {
          const server = serverList[i]

          // Retrieve latest list of cameras
          const newCamsList = await getCameraList(server)
          addCameras(newCamsList, server.id)
        }
      }
    }

    // Start async function
    updateCameraList()
  }, [addCameras, serverList])

  // Build camera widget list
  let cameraListItems = []
  Object.keys(cameraList).forEach((serverId) => {
    const server = serverList.find(server => server.id === serverId)
    if (server) {
      const newCameraListItems = cameraList[serverId].map((camera) => (
        <CameraListItem key={camera.BodyIDEx.value} readOnly={bulkModeEnabled} cameraSummary={camera} server={server} />
      ))
      cameraListItems = [
        ...cameraListItems,
        <ListSubheader key={server.id} sx={{ borderTop: '1px solid lightgrey', borderBottom: '1px solid lightgrey' }}>
          {`${server.name} (${server.ip}:${server.port})`}
        </ListSubheader>,
        ...newCameraListItems
      ]
    }
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
