import React from 'react'
import PropTypes from 'prop-types'

import localDB from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { List, Grid, Stack, Typography } from '@mui/material'

import CameraListItem from './CameraListItem.jsx'
import ServerTabPanel from './ServerTabPanel.jsx'
// import BulkPropertiesCollapse from './BulkPropertiesCollapse.jsx'

export default function CameraListPanel (props) {
  const { serverId, index } = props

  // Subscribe to changes to servers and cameras
  const server = useLiveQuery(() => localDB.servers.get(serverId))
  const cameraList = useLiveQuery(() => localDB.cameras.where({ serverId }).toArray())

  // Subscribe to persistent settings
  const bulkModeEnabled = useLiveQuery(() => localDB.settings.get('bulkModeEnabled'))
  const cameraSortField = useLiveQuery(() => localDB.settings.get('cameraSortField'))
  const cameraErrorsAtTop = useLiveQuery(() => localDB.settings.get('cameraErrorsAtTop'))

  // Build camera widget list
  let serverStats = {}
  let cameraListItems = []
  let serverCams = cameraList
  if (server && Array.isArray(serverCams)) {
    // Compute server camera stats
    serverStats = serverCams.reduce(
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
    cameraListItems = serverCams.map(camera => (
      <CameraListItem
        key={camera.BodyIDEx.value}
        cameraID={camera.id}
        serverID={server.id}
        readOnly={camera.missing || bulkModeEnabled?.value}
      />
    ))
  }

  return (
    <ServerTabPanel serverId={serverId} index={index}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {!!server &&
            <Stack direction='row' spacing={1} alignItems='baseline' sx={{ paddingTop: 1 }}>
              <Typography variant='h6' component='div'>{server.nickname}</Typography>
              <Typography variant='body1' sx={{ flexGrow: 1 }}>{`(${server.IP}:${server.port})`}</Typography>
              <Typography variant='body1'>
                {`${serverStats.missing > 0 ? serverStats.missing + ' missing of ' : ''}`}
                {`${serverStats.expected || 0} cameras`}
              </Typography>
            </Stack>}
        </Grid>
        <Grid item xs={12}>
          <List
            sx={{
              padding: 0,
              width: '100%',
              bgcolor: 'background.paper',
              overflow: 'auto',
              height: (bulkModeEnabled?.value ? '57vh' : '65vh')
            }}
          >
            {cameraListItems}
          </List>
        </Grid>
      </Grid>
    </ServerTabPanel>
  )
}

CameraListPanel.propTypes = {
  serverId: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
}
