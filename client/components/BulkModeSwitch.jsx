import React from 'react'

import localDB, { updateSetting } from '../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { Box, FormControlLabel, Switch } from '@mui/material'

export default function BulkModeSwitch (props) {
  // Subscribe to persistent settings
  const bulkModeEnabled = useLiveQuery(() => localDB.settings.get('bulkModeEnabled'))

  return (
    <Box {...props}>
      <FormControlLabel
        color="inherit"
        control={
          <Switch
            color="primary"
            checked={!!bulkModeEnabled?.value}
            onChange={(e) => updateSetting('bulkModeEnabled', e.target.checked)}
          />
        }
        label="Bulk Mode"
      />
    </Box>
  )
}
