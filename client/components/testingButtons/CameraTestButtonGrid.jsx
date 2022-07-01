import React from 'react'

import localDB from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { Grid, Chip } from '@mui/material'
import { CameraOutlined as CameraIcon } from '@mui/icons-material'
import { useSnackbar } from 'notistack'

import { releaseShutter } from '../../helpers/serverHelper.js'

export default function CameraTestButtonGrid () {
  const { enqueueSnackbar } = useSnackbar()

  // Subscribe to list of servers and cameras
  const cameraList = useLiveQuery(() => localDB.cameras.toArray(), [], [])
  const sortedCameras = cameraList.sort(
    (a, b) => ('' + a.nickname).localeCompare(b.nickname)
  )

  // Respond to a camera click
  const triggerCamera = async (cameraId) => {
    // Retrieve specific camera and server
    const camera = await localDB.cameras.get(cameraId)
    const server = (camera ? await localDB.servers.get(camera.serverId) : null)

    // Try to release the shutter without auto-focus
    try {
      if (!server || !camera) {
        throw new Error(`Cannot release shutter: server and/or camera are null (${server?.id}/${camera?.id})`)
      }
      await releaseShutter(server, camera)
    } catch (error) {
      enqueueSnackbar(`Shutter release failed on camera ${camera?.nickname}`, { variant: 'error' })
      console.error(error)
    }
  }

  return (
    <Grid
      container
      justifyContent="space-around"
      alignItems="center"
      spacing={1}
      sx={{
        margin: 0,
        width: '100%',
        bgcolor: 'background.paper',
        overflow: 'auto',
        height: '80vh'
      }}
    >
      {sortedCameras.map(camera => (
        <Grid key={camera.id} item xs={3} md={2} sx={{ textAlign: 'center' }}>
          <Chip
            onClick={() => triggerCamera(camera.id)}
            icon={<CameraIcon fontSize='small' />}
            label={camera.nickname}
            color={camera.missing ? 'error' : 'success'}
          />
        </Grid>
      ))}
    </Grid>
  )
}
