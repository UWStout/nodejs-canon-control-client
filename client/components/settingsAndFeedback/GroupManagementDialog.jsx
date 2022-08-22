import React from 'react'

import localDB from '../../state/localDB.js'
import useGlobalState from '../../state/useGlobalState.js'

import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, Stack, Typography } from '@mui/material'

import CameraGroupCombobox from './CameraGroupCombobox.jsx'

export default function GroupManagementDialog (props) {
  const { groupManagementDialogVisible, hideGroupManagementDialog, selectedCameras } = useGlobalState(state => state)

  // State of the selected group
  const [groupValue, setGroupValue] = React.useState(null)
  const createOrUpdateGroup = async () => {
    try {
      // Does this group already exist?
      const existingGroup = await localDB.groups.get({ name: groupValue.label })
      if (existingGroup) {
        // Attempt to update existing group
        const numUpdated = await localDB.groups.update(existingGroup.id, {
          cameras: [...existingGroup.cameras, ...selectedCameras]
        })

        // Verify expected results
        if (numUpdated === 1) {
          hideGroupManagementDialog()
        } else {
          console.error('Failed to update group, returned numUpdated was not 1', numUpdated)
        }
      } else {
        // Make a new group
        const newId = await localDB.groups.add({ name: groupValue.label, cameras: selectedCameras })
        console.log('Group created:', newId)
        hideGroupManagementDialog()
      }
    } catch (error) {
      alert('Failed to create/update group (see console)')
      console.error('Failed to create/update group')
      console.error(error)
    }
  }

  return (
    <Dialog fullWidth maxWidth='md' onClose={hideGroupManagementDialog} open={groupManagementDialogVisible}>
      <DialogTitle>{'Manage Camera Groups'}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ marginLeft: 2, marginRight: 2, marginBottom: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body1">
              {`Add ${selectedCameras.length} ${selectedCameras.length === 1 ? 'camera' : 'cameras'} to the group:`}
            </Typography>
            <CameraGroupCombobox value={groupValue} setValue={setGroupValue} />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={hideGroupManagementDialog}>{'Cancel'}</Button>
        <Button onClick={createOrUpdateGroup}>{'Ok'}</Button>
      </DialogActions>
    </Dialog>
  )
}
