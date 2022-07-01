import React from 'react'

import localDB, { updateSetting } from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { Box, FormControlLabel, Checkbox } from '@mui/material'

export default function ErrorsAtTopCheckbox (props) {
  // Subscribe to persistent settings
  const cameraErrorsAtTop = useLiveQuery(() => localDB.settings.get('cameraErrorsAtTop'))

  return (
    <Box {...props}>
      <FormControlLabel
        control={
          <Checkbox
            checked={!!cameraErrorsAtTop?.value}
            onChange={(e) => updateSetting('cameraErrorsAtTop', e.target.checked)}
          />
        }
        label="Cameras with errors at top"
      />
    </Box>
  )
}
