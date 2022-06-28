import React from 'react'

import localDB, { refreshCameraList } from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import useGlobalState from '../../state/useGlobalState.js'

import { List, ListSubheader, Grid, Collapse } from '@mui/material'

import CameraListItem from './CameraListItem.jsx'
import BulkProperties from './BulkProperties.jsx'

export default function CameraList () {
  // Subscribe to changes to servers and cameras
  const serverList = useLiveQuery(() => localDB.servers.toArray())
  const cameraList = useLiveQuery(() => localDB.cameras.toArray())

  // const { cameraList, addCameras } = useCameraStore(state => state)
  const { bulkModeEnabled } = useGlobalState(state => state)

  // Syncronize camera list when servers change
  React.useEffect(() => {
    // Async function to refresh list of cameras
    const updateCameraList = async () => {
      if (Array.isArray(serverList)) {
        for (let i = 0; i < serverList.length; i++) {
          await refreshCameraList(serverList[i])
        }
      }
    }

    // Start async function
    updateCameraList()
  }, [serverList])

  // Build camera widget list
  let cameraListItems = []
  if (Array.isArray(serverList)) {
    serverList.forEach(server => {
      // Filter for cameras on this server
      const serverCams = (Array.isArray(cameraList)
        ? cameraList.filter(camera => camera.serverId === server.id)
        : []
      )

      // Convert camera objects to CameraListItem components
      const newCameraListItems = serverCams.map(camera => (
        <CameraListItem
          key={camera.BodyIDEx.value}
          readOnly={bulkModeEnabled}
          cameraID={camera.id}
          serverID={server.id}
        />
      ))

      // Add to overall list of CameraListItem components with sub-header for server
      cameraListItems = [
        ...cameraListItems,
        <ListSubheader key={server.id} sx={{ borderTop: '1px solid lightgrey', borderBottom: '1px solid lightgrey' }}>
          {`${server.nickname} (${server.IP}:${server.port})`}
        </ListSubheader>,
        ...newCameraListItems
      ]
    })
  }

  return (
    <React.StrictMode>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Collapse in={bulkModeEnabled} timeout="auto" unmountOnExit>
            <List sx={{ padding: 0, width: '100%', bgcolor: 'background.paper' }}>
              <BulkProperties />
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
