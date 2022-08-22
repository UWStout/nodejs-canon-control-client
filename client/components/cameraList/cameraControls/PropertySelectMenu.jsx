import React from 'react'
import PropTypes from 'prop-types'

import localDB, { updateSetting } from '../../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { Menu, MenuItem, Skeleton } from '@mui/material'
import { useSnackbar } from 'notistack'

import { getAllowedPropertyValues, getCameraProperty, setCameraProperty } from '../../../helpers/serverHelper'
import { trimProp } from '../../../helpers/utility.js'
import { CameraObjShape, ServerObjShape } from '../../../state/dataModel'

export default function PropertySelectMenu (props) {
  const { anchorElement, server, camera, useBulkValues, propID, open, onClose } = props
  const { enqueueSnackbar } = useSnackbar()

  // subscribe to changes in bulk exposure settings
  const bulkExposureSettings = useLiveQuery(() => localDB.settings.get('bulkExposureSettings'))

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
  }, [camera, server, handleClose, open, propID, useBulkValues])

  React.useEffect(() => {
    // Update selected index based on current property value in camera (asynchronous)
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
    if (open && Array.isArray(options) && options.length > 0) {
      if (useBulkValues) {
        const currentValue = bulkExposureSettings?.[propID]
        const index = options.findIndex(option => option.value === currentValue)
        setSelectedIndex(index)
      } else {
        retrieveCurrentValue()
      }
    }
  }, [camera, server, open, options, propID, useBulkValues, bulkExposureSettings])

  // Menu click callback
  const handleMenuItemClick = (newIndex) => {
    // Async function to send selection to camera
    const updateSelection = async () => {
      if (camera && server) {
        try {
          if (newIndex !== selectedIndex) {
            await setCameraProperty(server, camera, propID, trimProp(options[newIndex].label, propID))
            setSelectedIndex(newIndex)
            onClose(true)
          }
        } catch (error) {
          enqueueSnackbar(`Error setting property for camera ${camera?.nickname || camera?.BodyIDEx?.value}`, { variant: 'error' })
          console.error(error)
        }

        onClose(false)
      }
    }

    // Send to camera
    if (useBulkValues) {
      if (newIndex !== selectedIndex) {
        updateSetting('bulkExposureSettings', { [propID]: trimProp(options[newIndex].label, propID) })
        setSelectedIndex(newIndex)
        onClose(true)
      } else {
        onClose(false)
      }
    } else {
      updateSelection()
    }
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
      anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
      transformOrigin={{ vertical: 'center', horizontal: 'right' }}
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
              {trimProp(option.label, propID)}
            </MenuItem>
          ))}
      {/* eslint-enable react/jsx-indent, indent */}
    </Menu>
  )
}

PropertySelectMenu.propTypes = {
  propID: PropTypes.string.isRequired,

  anchorElement: PropTypes.instanceOf(Element),
  camera: PropTypes.shape(CameraObjShape),
  server: PropTypes.shape(ServerObjShape),
  useBulkValues: PropTypes.bool,
  open: PropTypes.bool,
  onClose: PropTypes.func
}

PropertySelectMenu.defaultProps = {
  anchorElement: null,
  camera: null,
  server: null,
  useBulkValues: false,
  open: false,
  onClose: null
}
