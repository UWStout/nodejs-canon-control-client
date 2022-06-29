import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import localDB from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { Menu, MenuItem, Skeleton } from '@mui/material'

import { getAllowedPropertyValues, getCameraProperty, setCameraProperty } from '../../helpers/serverHelper'
import { trimProp } from '../../helpers/utility.js'

export default function PropertySelectMenu (props) {
  const { anchorElement, serverID, cameraID, propID, open, onClose, isbulkProperty } = props

  // Subscribe to changes to the camera object
  const camera = useLiveQuery(() => localDB.cameras.get(cameraID))
  const server = useLiveQuery(() => localDB.servers.get(serverID))

  // Selection state and list of options
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [options, setOptions] = React.useState(null)

  // Close callback
  const handleClose = React.useCallback(() => {
    if (onClose) { onClose() }
  }, [onClose])

  // Synchronize list of allowed options
  React.useEffect(() => {
    // Update list of allowed values (asynchronous)
    const retrieveAllowedValues = async () => {
      if (camera && server) {
        const allowedValues = await getAllowedPropertyValues(server, camera, propID)
        if (Array.isArray(allowedValues) && allowedValues.length > 0) {
          setOptions(allowedValues.map(option => ({ label: option.label, value: option.value })))
        } else {
          handleClose(false)
        }
      }
    }

    // Run the async process
    if (open) {
      retrieveAllowedValues()
    }
  }, [camera, handleClose, open, propID, server])

  React.useEffect(() => {
    // Update current value (asynchronous)
    const retrieveCurrentValue = async () => {
      if (camera && server) {
        const currentValue = await getCameraProperty(server, camera, propID)
        if (typeof currentValue?.value === 'object') {
          const index = options.findIndex(option => option.value === currentValue.value.value)
          setSelectedIndex(index)
        } else if (typeof currentValue?.value !== 'undefined') {
          const index = options.findIndex(option => option.value === currentValue.value)
          setSelectedIndex(index)
        }
      }
    }

    // Run the async process
    if (!isbulkProperty && open && Array.isArray(options) && options.length > 0) {
      retrieveCurrentValue()
    }
  }, [camera, open, options, isbulkProperty, propID, server])

  // Menu click callback
  const handleMenuItemClick = (newIndex) => {
    // Async function to send selection to camera
    const updateSelection = async () => {
      if (camera && server) {
        try {
          if (newIndex !== selectedIndex) {
            await setCameraProperty(server, camera, propID, trimProp(options[newIndex].label))
            setSelectedIndex(newIndex)
            onClose(true)
          }
        } catch (error) {
          window.alert('Error setting value, see console')
          console.error(error)
        }

        onClose(false)
      }
    }

    if (isbulkProperty) {
      // Set as a bulk update settings instead
    } else {
      // Send to camera
      updateSelection()
    }
  }

  // If overrideValue is provided, set the selected index from that
  useEffect(() => {
    if (isbulkProperty && Array.isArray(options)) {
      // const index = options.findIndex(option => option.value === overrideValue)
      // if (index >= 0) {
      //   setSelectedIndex(index)
      // }
    }
  }, [options, isbulkProperty])

  // Options is defined and is an empty array (or anchorElement is not ready yet) so don't render the menu
  if (options?.length === 0 || !anchorElement) {
    return (<div />)
  }

  // Render the menu
  return (
    <Menu
      anchorEl={anchorElement}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'lock-button',
        role: 'listbox'
      }}
    >
      {/* eslint-disable react/jsx-indent, indent */}
      {options === null
        ? [0, 1, 2].map((val) => (
            <Skeleton key={val} variant="text" />
          ))
        : options.map((option, index) => (
            <MenuItem
              key={option.value}
              selected={index === selectedIndex}
              onClick={() => handleMenuItemClick(index)}
            >
              {trimProp(option.label)}
            </MenuItem>
          ))}
      {/* eslint-enable react/jsx-indent, indent */}
    </Menu>
  )
}

PropertySelectMenu.propTypes = {
  anchorElement: PropTypes.oneOfType([PropTypes.element, PropTypes.object]),
  propID: PropTypes.string.isRequired,

  cameraID: PropTypes.string,
  serverID: PropTypes.number,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  isbulkProperty: PropTypes.bool
}

PropertySelectMenu.defaultProps = {
  cameraID: '',
  serverID: -1,
  anchorElement: null,
  open: false,
  onClose: null,
  isbulkProperty: false
}
