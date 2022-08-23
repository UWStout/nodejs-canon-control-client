import React from 'react'
import PropTypes from 'prop-types'

import { useSnackbar } from 'notistack'
import { pingServer } from '../../helpers/serverHelper'

import { ServerObjShape } from '../../state/dataModel.js'
export default function ServerStatusVerifier (props) {
  const { serverList } = props

  // Snackbar hooks
  const { enqueueSnackbar } = useSnackbar()

  React.useEffect(() => {
    async function checkServerStatus () {
      if (Array.isArray(serverList)) {
        serverList.forEach(async server => {
          if (!server.deactivated) {
            const result = await pingServer(server)
            if (!result.pong) {
              enqueueSnackbar(`Unable to ping ${server.nickname} - ${result.message}`, { variant: 'error' })
            }
          }
        })
      }
    }
    checkServerStatus()
  }, [enqueueSnackbar, serverList])

  return (null)
}

ServerStatusVerifier.propTypes = {
  serverList: PropTypes.arrayOf(PropTypes.shape(ServerObjShape))
}

ServerStatusVerifier.defaultProps = {
  serverList: []
}
