import React from 'react'

import { Box, FormControlLabel, Switch } from '@mui/material' 

import { useLiveQuery } from 'dexie-react-hooks'
import localDB, { updateSetting } from '../../state/localDB.js'

export default function AutoIncrementSwitch() {
  
  const autoIncrementCapture = useLiveQuery(() => localDB.settings.get('autoIncrementCapture'))

  return (
    <Box textAlign="right">
      <FormControlLabel
        control={
          <Switch
            checked={!!autoIncrementCapture?.value}
            onChange={(e) => updateSetting('autoIncrementCapture', e.target.checked)}
          />
        }
        label="Auto-Increment Capture Number"
        labelPlacement='start'
      />
    </Box>
  )
}