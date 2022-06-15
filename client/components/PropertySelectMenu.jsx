import React from 'react'
import PropTypes from 'prop-types'

import { Menu, MenuItem, Skeleton } from '@mui/material'

import { getAllowedPropertyValues, getCameraProperty, setCameraProperty } from '../helpers/serverHelper'
import { trimProp } from '../helpers/utility.js'

export default function PropertySelectMenu (props) {
  const { anchorElement, serverIP, camera, propID, open, onClose } = props

  // Selection state and list of options
  const [selectedIndex, setSelectedIndex] = React.useState('')
  const [options, setOptions] = React.useState(null)

  // Close callback
  const handleClose = React.useCallback(() => {
    if (onClose) { onClose() }
  }, [onClose])

  // Synchronize list of allowed options
  React.useEffect(() => {
    // Update list of allowed values (asynchronous)
    const retrieveAllowedValues = async () => {
      const allowedValues = await getAllowedPropertyValues(serverIP, camera, propID)
      if (Array.isArray(allowedValues) && allowedValues.length > 0) {
        setOptions(allowedValues.map(option => ({ label: option.label, value: option.value })))
      } else {
        handleClose()
      }
    }

    // Run the async process
    if (open) {
      retrieveAllowedValues()
    }
  }, [camera, handleClose, open, propID, serverIP])

  React.useEffect(() => {
    // Update current value (asynchronous)
    const retrieveCurrentValue = async () => {
      const currentValue = await getCameraProperty(serverIP, camera, propID)
      if (typeof currentValue?.value === 'object') {
        const index = options.findIndex(option => option.value.value === currentValue.value)
        setSelectedIndex(index)
      } else if (typeof currentValue?.value !== 'undefined') {
        const index = options.findIndex(option => option.value === currentValue.value)
        setSelectedIndex(index)
      }
    }

    // Run the async process
    if (open && Array.isArray(options) && options.length > 0) {
      retrieveCurrentValue()
    }
  }, [camera, open, options, propID, serverIP])

  // Menu click callback
  const handleMenuItemClick = (newIndex) => {
    // Async function to send selection to camera
    const updateSelection = async () => {
      try {
        await setCameraProperty(serverIP, camera, propID, trimProp(options[newIndex].label))
        setSelectedIndex(newIndex)
      } catch (error) {
        window.alert('Error setting value, see console')
        console.error(error)
      } finally {
        if (onClose) { onClose() }
      }
    }

    // Start async process
    updateSelection()
  }

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
  serverIP: PropTypes.string.isRequired,
  camera: PropTypes.number.isRequired,
  propID: PropTypes.string.isRequired,

  open: PropTypes.bool,
  onClose: PropTypes.func
}

PropertySelectMenu.defaultProps = {
  anchorElement: null,
  open: false,
  onClose: null
}
