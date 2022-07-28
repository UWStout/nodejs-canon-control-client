import React from 'react'

import useGlobalState from '../../state/useGlobalState.js'

import { IconButton, Menu, MenuItem } from '@mui/material'
import { Settings as SettingsIcon } from '@mui/icons-material'

export default function SettingsMenu (props) {
  // Functions to show the appropriate settings dialogs
  const { showServerEditDialog, showImportExportDialog, showCameraNicknameSyncDialog } = useGlobalState(state => state)

  // Control anchor element of menu
  const [anchorEl, setAnchorEl] = React.useState(null)
  const handleSettingsMenu = (e) => { setAnchorEl(e.currentTarget) }
  const handleSettingsClose = () => { setAnchorEl(null) }

  // Trigger the server edit dialog and close the menu
  const onViewEditServers = () => {
    showServerEditDialog()
    handleSettingsClose()
  }

  // Trigger the local data dialog and close the menu
  const onImportExportLocalData = () => {
    showImportExportDialog()
    handleSettingsClose()
  }

  // Trigger the nickname sync dialog and close the menu
  const onSyncronizeCameraNicknames = () => {
    showCameraNicknameSyncDialog()
    handleSettingsClose()
  }

  return (
    <React.Fragment>
      <IconButton
        size="large"
        aria-label="settings menu"
        aria-controls="menu-settings-appbar"
        aria-haspopup="true"
        onClick={handleSettingsMenu}
        color="inherit"
      >
        <SettingsIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={!!anchorEl}
        onClose={handleSettingsClose}
      >
        <MenuItem onClick={onViewEditServers}>View / Edit Servers</MenuItem>
        <MenuItem onClick={onImportExportLocalData}>Import / Export Local Data</MenuItem>
        <MenuItem onClick={onSyncronizeCameraNicknames}>Syncronize Camera Nicknames</MenuItem>
      </Menu>
    </React.Fragment>
  )
}
