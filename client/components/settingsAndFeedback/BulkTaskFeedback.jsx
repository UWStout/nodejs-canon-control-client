import React from 'react'

import useGlobalState from '../../state/useGlobalState.js'

import { Button, ButtonGroup, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Stack } from '@mui/material'
import { useSnackbar } from 'notistack'

import useBulkTaskState from '../../state/useBulkTaskState.js'

export default function BulkTaskFeedback (props) {
  // Dialog visibility state
  const {
    bulkTaskFeedbackDialogVisible,
    showBulkTaskFeedbackDialog,
    hideBulkTaskFeedbackDialog
  } = useGlobalState(state => state)

  // Snackbar hooks
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  // Show feedback or dismiss actions
  const action = React.useMemo(snackbarId => (
    <ButtonGroup size="small" color="monochrome" variant="contained" disableElevation>
      <Button onClick={showBulkTaskFeedbackDialog}>{'More Info'}</Button>
      <Button onClick={() => { closeSnackbar(snackbarId) }}>{'Dismiss'}</Button>
    </ButtonGroup>
  ), [closeSnackbar, showBulkTaskFeedbackDialog])

  // Show bulk state snackbars on completion
  const bulkState = useBulkTaskState(state => state)
  React.useEffect(() => {
    if (bulkState.done && bulkState.completeCount > 0) {
      if (bulkState.failedCount === bulkState.completeCount) {
        enqueueSnackbar(`${bulkState.task?.type} failed`, { variant: 'error', action, persist: true })
      } else if (bulkState.failedCount > 0) {
        enqueueSnackbar(`${bulkState.task?.type} partial failure`, { variant: 'warning', action, persist: true })
      } else {
        enqueueSnackbar(`${bulkState.task?.type} complete`, { variant: 'success' })
      }
    }
  }, [action, bulkState, enqueueSnackbar])

  const requestClose = () => {
    hideBulkTaskFeedbackDialog()
  }

  // Coiunt failed servers
  const failedServers = bulkState?.serverInfo.reduce(
    (prev, info) => (prev + (info?.summary?.failed > 0 ? 1 : 0)),
    0
  )

  // Don't go further if its not visible
  if (!bulkTaskFeedbackDialogVisible) {
    return null
  }

  return (
    <Dialog fullWidth maxWidth='md' onClose={requestClose} open={bulkTaskFeedbackDialogVisible}>
      <DialogTitle>{'Bulk Task Error/Warning Info'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ width: '100%' }}>
          <Typography variant="h4" component='div' sx={{ width: '100%' }}>
            {`Server Info: ${failedServers} of ${bulkState.serverInfo?.length} server(s) had failures`}
          </Typography>
          {bulkState.serverInfo?.map((info) => (
            <React.Fragment key={info.taskId}>
              <Typography variant="body1" sx={{ width: '100%' }}>
                {`Server Bulk Task: ${info.taskId}`}
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', width: '100%' }}>
                {info.summary?.messages?.length === 0
                  ? '- No messages'
                  : info.summary?.messages?.map(message => (`- ${message}\n`))}
              </Typography>
            </React.Fragment>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={requestClose}>{'Close'}</Button>
      </DialogActions>
    </Dialog>
  )
}
