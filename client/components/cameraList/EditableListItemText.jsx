import React from 'react'
import PropTypes from 'prop-types'

import localDB from '../../state/localDB.js'

import { ListItemText, TextField, InputAdornment, IconButton } from '@mui/material'
import { Edit as EditIcon } from '@mui/icons-material'
import { useSnackbar } from 'notistack'

import { CameraObjShape } from '../../state/dataModel.js'

export default function EditableListItemText (props) {
  const { camera } = props

  const { enqueueSnackbar } = useSnackbar()

  // Local nickname editing state
  const inputRef = React.useRef()
  const [mouseOver, setMouseOver] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  const [isSyncing, setIsSyncing] = React.useState(false)
  const [nickname, setNickname] = React.useState(camera?.nickname || '')
  const [oldNickname, setOldNickname] = React.useState(nickname)

  // Update nickname once camera object is avialable
  React.useEffect(() => {
    // Has the nickname syncing finished?
    if (isSyncing && nickname === camera?.nickname) {
      setIsSyncing(false)
    }

    // Only use the 'camera.nickname' if it is ready
    if (!isEditing && !isSyncing && camera && nickname !== camera.nickname) {
      setNickname(camera.nickname)
    }
  }, [camera, isEditing, isSyncing, nickname])

  // Toggling edit mode on and off
  const doneEditing = async (accept) => {
    if (accept && camera) {
      try {
        setIsSyncing(true)
        const updated = await localDB.cameras.update(camera.id, { nickname })
        if (updated !== 1) {
          enqueueSnackbar(`Failed to save nickname for camera ${camera?.nickname || camera?.BodyIDEx?.value}`, { variant: 'error' })
          console.error('Dexie table updated returned', updated)
        }
      } catch (error) {
        enqueueSnackbar(`Failed to save nickname for camera ${camera?.nickname || camera?.BodyIDEx?.value}`, { variant: 'error' })
        console.error(error)
      }
    } else {
      setNickname(oldNickname)
    }
    setIsEditing(false)
  }

  // Edit button is clicked
  const onEditClicked = () => {
    if (isEditing) {
      doneEditing(true)
    } else {
      setIsEditing(true)
      setOldNickname(nickname)
      setTimeout(() => {
        inputRef.current.focus()
        inputRef.current.setSelectionRange(0, inputRef.current.value.length)
      }, 100)
    }
  }

  // Responding to key presses when editing
  const onInputKeyPress = (e) => {
    switch (e.keyCode) {
      case 13: doneEditing(true); break // Enter key
      case 27: doneEditing(false); break // Esc key
      case 9: e.preventDefault(); break // Tab key
    }
  }

  // Do we have a basic camera object yet?
  if (camera) {
    // Build secondary text
    let secondaryText = `SN: ${camera.BodyIDEx?.value}`
    if (camera.FirmwareVersion) {
      secondaryText += ` / v${camera.FirmwareVersion?.value}`
    } else {
      secondaryText += ' / refreshing details ...'
    }

    return (
      <ListItemText secondary={secondaryText}>
        <TextField
          value={nickname || camera.ProductName.value}
          variant='standard'
          size='small'
          onChange={(e) => setNickname(e.target.value)}
          disabled={!isEditing}
          onMouseEnter={() => setMouseOver(true)}
          onMouseLeave={() => setMouseOver(false)}
          inputRef={inputRef}
          InputProps={{
            sx: {
              '& .Mui-disabled': {
                color: (theme) => theme.palette.text.primary,
                WebkitTextFillColor: (theme) => theme.palette.text.primary + '!important'
              }
            },
            onKeyDown: onInputKeyPress,
            onBlur: () => doneEditing(true),
            disableUnderline: !isEditing,
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  onClick={onEditClicked}
                  size='small'
                  disabled={!mouseOver || isEditing || isSyncing}
                  sx={{ visibility: mouseOver && !isEditing ? 'visible' : 'hidden' }}
                >
                  <EditIcon fontSize='inherit' />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </ListItemText>
    )
  } else {
    return (
      <ListItemText primary={'Updating ...'} secondary={'(please wait)'} />
    )
  }
}

EditableListItemText.propTypes = {
  camera: PropTypes.shape(CameraObjShape)
}

EditableListItemText.defaultProps = {
  camera: null
}
