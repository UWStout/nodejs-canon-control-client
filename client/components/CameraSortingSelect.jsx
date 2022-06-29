import React from 'react'

import localDB, { updateSetting } from '../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material'

export default function CameraSortingSelect (props) {
  // Subscribe to persistent settings
  const cameraSortField = useLiveQuery(() => localDB.settings.get('cameraSortField'))

  return (
    <Box {...props}>
      <FormControl sx={{ m: 1, minWidth: 300 }} size='small'>
        <InputLabel id="camera-sort-label">Sort Cameras By</InputLabel>
        <Select
          labelId="camera-sort-label"
          id="camera-sort-select"
          value={cameraSortField?.value || 'id'}
          label="Sort Cameras By"
          onChange={(e) => updateSetting('cameraSortField', e.target.value)}
        >
          <MenuItem value={'id'}>Camera Serial Number</MenuItem>
          <MenuItem value={'nickname'}>Camera Nickname</MenuItem>
          <MenuItem value={'index'}>Server Index</MenuItem>
          <MenuItem value={'portName'}>USB Port Name</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
