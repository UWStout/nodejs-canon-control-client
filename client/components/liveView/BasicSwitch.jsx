import React from 'react'
import { FormControlLabel, Switch } from '@mui/material'

export default function BasicSwitch (props) {
  const { checked, setChecked, label } = props

  return (
    <FormControlLabel
      color="inherit"
      control={
        <Switch
          color="primary"
          checked={checked}
          onChange={ (e) => setChecked(e.target.checked) }
        />
      }
      label={label}
    />
  )
}
