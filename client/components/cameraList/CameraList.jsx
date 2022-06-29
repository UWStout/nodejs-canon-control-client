import React from 'react'

import localDB, { refreshCameraList } from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { List, ListSubheader, Grid, Stack, Typography } from '@mui/material'

import CameraListItem from './CameraListItem.jsx'
import BulkPropertiesItem from './BulkPropertiesItem.jsx'

export default function CameraList () {
  // Subscribe to changes to servers and cameras
  const serverList = useLiveQuery(() => localDB.servers.toArray())
  const cameraList = useLiveQuery(() => localDB.cameras.toArray())

  // Subscribe to persistent settings
  const cameraSortField = useLiveQuery(() => localDB.settings.get('cameraSortField'))

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
      let serverCams = (Array.isArray(cameraList)
        ? cameraList.filter(camera => camera.serverId === server.id)
        : []
      )

      // Compute server camera stats
      const serverStats = serverCams.reduce(
        (prev, camera) => ({
          expected: prev.expected + 1,
          missing: prev.missing + (camera.missing ? 1 : 0)
        }),
        { expected: 0, missing: 0 }
      )

      // Sort the cameras
      if (typeof cameraSortField?.value === 'string') {
        serverCams = serverCams.sort((a, b) =>
          ('' + a[cameraSortField.value]).localeCompare(b[cameraSortField.value])
        )
      }

      // Convert camera objects to CameraListItem components
      const newCameraListItems = serverCams.map(camera => (
        <CameraListItem
          key={camera.BodyIDEx.value}
          cameraID={camera.id}
          serverID={server.id}
        />
      ))

      // Add to overall list of CameraListItem components with sub-header for server
      cameraListItems = [
        ...cameraListItems,
        <ListSubheader key={server.id} sx={{ borderTop: '1px solid lightgrey', borderBottom: '1px solid lightgrey' }}>
          <Stack direction='row' spacing={1} alignItems='baseline' sx={{ paddingTop: 1, paddingBottom: 1 }}>
            <Typography variant='h6' component='div'>{server.nickname}</Typography>
            <Typography variant='body1' sx={{ flexGrow: 1 }}>{`(${server.IP}:${server.port})`}</Typography>
            <Typography variant='body1'>
              {`${serverStats.missing > 0 ? serverStats.missing + ' missing of ' : ''}`}
              {`${serverStats.expected} cameras`}
            </Typography>
          </Stack>
        </ListSubheader>,
        ...newCameraListItems
      ]
    })
  }

  return (
    <React.StrictMode>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <BulkPropertiesItem />
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
