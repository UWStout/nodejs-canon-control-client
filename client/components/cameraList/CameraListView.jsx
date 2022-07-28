import React from 'react'

import localDB, { updateSetting } from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { Grid, Stack, Box, Tabs, Tab } from '@mui/material'

import BulkPropertiesCollapse from './BulkPropertiesCollapse.jsx'
import CameraListPanel from './CameraListPanel.jsx'
import CameraSortingSelect from './CameraSortingSelect.jsx'
import BulkModeSwitch from './BulkModeSwitch.jsx'
import ErrorsAtTopCheckbox from './ErrorsAtTopCheckbox.jsx'

function a11yProps (serverId) {
  return {
    id: `server-tab-${serverId}`,
    'aria-controls': `server-tabpanel-${serverId}`
  }
}

export default function CameraListView () {
  // Subscribe to changes in the server list and the current server tab
  const serverList = useLiveQuery(() => localDB.servers.toArray())
  const currentServerTabIndex = useLiveQuery(() => localDB.settings.get('currentServerTabIndex'))

  // Update current tab
  const changeTab = async (event, newValue) => {
    console.log(`setting server tab to ${newValue}`)
    await updateSetting('currentServerTabIndex', newValue)
  }

  return (
    <React.Fragment>
      {/* Quck Settings */}
      <Stack
        direction='row'
        spacing={1}
        alignItems='center'
        sx={{ bgcolor: 'background.cameraList', padding: 1, paddingBottom: 0 }}
      >
        <CameraSortingSelect />
        <ErrorsAtTopCheckbox sx={{ flexGrow: 1 }} />
        <BulkModeSwitch />
      </Stack>

      <Grid container sx={{ bgcolor: 'background.cameraList', padding: 2, paddingTop: 0 }}>
        {/* Bulk Camera Controls */}
        <Grid item xs={12}>
          <BulkPropertiesCollapse />
        </Grid>

        <Grid item xs={12}>
          {/* Server List Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={currentServerTabIndex?.value || 0} onChange={changeTab} aria-label="server camera list tabs">
              {Array.isArray(serverList) && serverList.map(server => (
                <Tab key={server.id} label={`${server.nickname}`} disabled={server.deactivated} {...a11yProps(server.id)} />
              ))}
            </Tabs>
          </Box>

          {/* Server List Tab Panels */}
          {Array.isArray(serverList) && serverList.filter(item => !item.deactivated)
            .map((server, i) => (
              <CameraListPanel key={server.id} index={i} serverId={server.id} />
            ))}
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
