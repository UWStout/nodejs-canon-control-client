import React from 'react'
import download from 'downloadjs'

import useGlobalState from '../../state/useGlobalState.js'

import { exportLocalData, importLocalData } from '../../state/localDB.js'

import { Box, Grid, Button } from '@mui/material'

import FileDropzone from './FileDropzone.jsx'
import ConfirmImportDialog from './ConfirmImportDialog.jsx'

export default function ImportExportForm () {
  const { hideImportExportDialog } = useGlobalState(state => state)

  const onExportClick = async () => {
    try {
      const dataBlob = await exportLocalData()
      download(dataBlob, 'c4-data-export.json', 'application/json')
      hideImportExportDialog()
    } catch (error) {
      window.alert('Export failed (see console for details')
      console.error(error)
    }
  }

  const [file, setFile] = React.useState(null)
  const [showConfirm, setShowConfirm] = React.useState(false)
  React.useEffect(() => {
    if (file) { setShowConfirm(true) }
  }, [file, setShowConfirm])

  const handleConfirm = async (proceed) => {
    setShowConfirm(false)

    if (proceed && file) {
      try {
        await importLocalData(file)
        hideImportExportDialog()
      } catch (error) {
        window.alert('Import failed (see console for details')
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
