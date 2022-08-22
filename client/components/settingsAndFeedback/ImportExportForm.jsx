import React from 'react'
import download from 'downloadjs'

import useGlobalState from '../../state/useGlobalState.js'

import { exportLocalData, importLocalData } from '../../state/localDB.js'

import { Box, Grid, Button } from '@mui/material'
import { useSnackbar } from 'notistack'

import FileDropzone from './FileDropzone.jsx'
import ConfirmImportDialog from './ConfirmImportDialog.jsx'

export default function ImportExportForm () {
  const { enqueueSnackbar } = useSnackbar()

  const { hideImportExportDialog } = useGlobalState(state => state)

  const onExportClick = async () => {
    try {
      const dataBlob = await exportLocalData()
      download(dataBlob, 'c4-data-export.json', 'application/json')
      hideImportExportDialog()
    } catch (error) {
      enqueueSnackbar('Local data export failed', { variant: 'error' })
      console.error(error)
    }
  }

  const [file, setFile] = React.useState(null)
  const [showConfirm, setShowConfirm] = React.useState(false)
  React.useEffect(() => {
    if (file) { setShowConfirm(true) }
  }, [file, setShowConfirm])

  const handleConfirm = async (confirmed, servers, cameras, groups, sessions, settings) => {
    setShowConfirm(false)

    if (confirmed && file) {
      try {
        await importLocalData(file, servers, cameras, groups, sessions, settings)
        hideImportExportDialog()
      } catch (error) {
        enqueueSnackbar('Local data import failed', { variant: 'error' })
        console.error(error)
      }
    }
  }

  return (
    <Box sx={{ marginLeft: 2, marginRight: 2, marginBottom: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FileDropzone onFileSelected={setFile} />
        </Grid>
        <Grid item xs={12}>
          <Button onClick={onExportClick} variant='contained' fullWidth>Export Local Data</Button>
        </Grid>
      </Grid>
      <ConfirmImportDialog open={showConfirm} onClose={handleConfirm} />
    </Box>
  )
}
