import React from 'react'
import PropTypes from 'prop-types'

import localDB from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import TextField from '@mui/material/TextField'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'

const filter = createFilterOptions()

export default function CameraGroupCombobox (props) {
  const { value, setValue } = props

  // Subscribe to changes to the camera and server objects
  const groups = useLiveQuery(() => localDB.groups.toArray(), null, [])

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          setValue({
            label: newValue
          })
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setValue({
            label: newValue.inputValue
          })
        } else {
          setValue(newValue)
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params)
        const { inputValue } = params

        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.label)
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            inputValue,
            label: `Add "${inputValue}"`
          })
        }

        return filtered
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="cameraGroupCombobox"
      options={groups.map(group => ({ label: group.name, id: group.id }))}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue
        }
        // Regular option
        return option.label
      }}
      renderOption={(props, option) => <li {...props}>{option.label}</li>}
      sx={{ width: 300 }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} label="Camera Group" />
      )}
    />
  )
}

CameraGroupCombobox.propTypes = {
  value: PropTypes.shape({ label: PropTypes.string.isRequired }),
  setValue: PropTypes.func.isRequired
}

CameraGroupCombobox.defaultProps = {
  value: null
}
