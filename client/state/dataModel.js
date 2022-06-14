import PropTypes from 'prop-types'

export const CameraDateTime = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  day: PropTypes.number.isRequired,
  hour: PropTypes.number.isRequired,
  minute: PropTypes.number.isRequired,
  second: PropTypes.number.isRequired,
  milliseconds: PropTypes.number.isRequired
}

export const CameraProperty = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.shape(CameraDateTime)
  ]).isRequired,
  label: PropTypes.string
}

export const CameraObjShape = {
  // Always present (even in summarized list)
  index: PropTypes.number.isRequired,
  portName: PropTypes.string.isRequired,
  ProductName: PropTypes.shape(CameraProperty).isRequired,
  BodyIDEx: PropTypes.shape(CameraProperty).isRequired,

  // Only present in full details
  DateTime: PropTypes.shape(CameraProperty),
  SaveTo: PropTypes.shape(CameraProperty),
  ImageQuality: PropTypes.shape(CameraProperty),
  WhiteBalance: PropTypes.shape(CameraProperty),
  ColorSpace: PropTypes.shape(CameraProperty),
  AEMode: PropTypes.shape(CameraProperty),
  ISOSpeed: PropTypes.shape(CameraProperty),
  Av: PropTypes.shape(CameraProperty),
  Tv: PropTypes.shape(CameraProperty),
  ExposureCompensation: PropTypes.shape(CameraProperty)
}

export const ServerObjShape = {
  IP: PropTypes.string.isRequired,
  nickname: PropTypes.string
}
