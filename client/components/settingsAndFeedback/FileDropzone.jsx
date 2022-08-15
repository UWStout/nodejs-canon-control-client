import React from 'react'
import PropTypes from 'prop-types'

import { useDropzone } from 'react-dropzone'

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  cursor: 'pointer'
}

const focusedStyle = { borderColor: '#2196f3' }
const acceptStyle = { borderColor: '#00e676' }
const rejectStyle = { borderColor: '#ff1744' }

export default function FileDropzone (props) {
  const { onFileSelected } = props

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: { 'application/json': ['.json'] },
    maxFiles: 1,
    multiple: false
  })

  const style = React.useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [isFocused, isDragAccept, isDragReject])

  React.useEffect(() => {
    if (!Array.isArray(acceptedFiles) || acceptedFiles.length <= 0) {
      return
    }
    if (onFileSelected) { onFileSelected(acceptedFiles[0]) }
  }, [acceptedFiles, onFileSelected])

  return (
    <div className='container'>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>Drag and drop a JSON file here, or click to browse</p>
      </div>
    </div>
  )
}

FileDropzone.propTypes = {
  onFileSelected: PropTypes.func
}

FileDropzone.defaultProps = {
  onFileSelected: null
}
