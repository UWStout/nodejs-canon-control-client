import React from 'react'

import { Box, FormControlLabel, Switch } from '@mui/material' 

import { useLiveQuery } from 'dexie-react-hooks'
import localDB, { updateSetting } from '../../state/localDB.js'

export default function AutoIncrementSwitch(props) {
  
  const autoIncrementCapture = useLiveQuery(() => localDB.settings.get('autoIncrementCapture'))

  return (
    <Box {...props} textAlign="right">
      <FormControlLabel
        color="inherit"
        control={
          <Switch
            color="primary"
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