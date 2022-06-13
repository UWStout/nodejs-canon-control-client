import PropTypes from 'prop-types'

export const CameraObjShape = {
  serial: PropTypes.string.isRequired,
  server: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  model: PropTypes.string.isRequired
}
