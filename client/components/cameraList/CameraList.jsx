import React from 'react'

import localDB from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { List, ListSubheader, Grid, Stack, Typography } from '@mui/material'

import CameraListItem from './CameraListItem.jsx'
import BulkPropertiesCollapse from './BulkPropertiesCollapse.jsx'

export default function CameraList () {
  // Subscribe to changes to servers and cameras
  const serverList = useLiveQuery(() => localDB.servers.toArray())
  const cameraList = useLiveQuery(() => localDB.cameras.toArray())

  // Subscribe to persistent settings
  const bulkModeEnabled = useLiveQuery(() => localDB.settings.get('bulkModeEnabled'))
  const cameraSortField = useLiveQuery(() => localDB.settings.get('cameraSortField'))
  const cameraErrorsAtTop = useLiveQuery(() => localDB.settings.get('cameraErrorsAtTop'))

  // Build camera widget list
  let cameraListItems = []
  if (Array.isArray(serverList)) {
    serverList.forEach(server => {
      // Skip deactivated servers
      if (server.deactivated) return

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
        serverCams = serverCams.sort((a, b) => {
          // Should cameras with errors be at the top?
          if (cameraErrorsAtTop?.value) {
            if (!a.missing || !b.missing) {
              if (a.missing) { return -1 }
              if (b.missing) { return 1 }
            }
          }

          // Sort by the select sorting field
          return ('' + a[cameraSortField.value]).localeCompare(b[cameraSortField.value])
        })
      }

      // Convert camera objects to CameraListItem components
      const newCameraListItems = serverCams.map(camera => (
        <CameraListItem
          key={camera.BodyIDEx.value}
          cameraID={camera.id}
          serverID={server.id}
          readOnly={camera.missing || bulkModeEnabled?.value}
        />
      ))

      // Add to overall list of CameraListItem components with sub-header for server
      cameraListItems = [
        ...cameraListItems,
        <ListSubheader
          key={server.id}
          sx={{
            '& .MuiListSubheader-root': {
              color: 'text.secondary',
              backgroundColor: 'primary'
            },
            borderTop: '1px solid lightgrey',
            borderBottom: '1px solid lightgrey'
          }}
        >
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
          <BulkPropertiesCollapse />
        </Grid>

        <Grid item xs={12}>
          <List
            sx={{
              padding: 0,
              width: '100%',
              bgcolor: 'background.paper',
              overflow: 'auto',
              height: (bulkModeEnabled?.value ? '70vh' : '78vh'),
              transition: 'height 200ms'
            }}
          >
            {cameraListItems}
          </List>
        </Grid>
      </Grid>
    </React.StrictMode>
  )
}
