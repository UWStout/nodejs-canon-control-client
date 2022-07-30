import EventEmitter from 'eventemitter3'

// Enumeration of MJPEG stream phases
const enumValue = (name) => Object.freeze({ toString: () => name })
const MJPEGPhase = Object.freeze({
  STARTING: enumValue('MJPEGPhase.STARTING'),
  SEARCHING_FOR_IMAGE: enumValue('MJPEGPhase.SEARCHING_FOR_IMAGE'),
  EXTRACTING_IMAGE: enumValue('MJPEGPhase.EXTRACTING_IMAGE')
})

export default class MJPEGConsumer extends EventEmitter {
  constructor (MJPEGUrl, autoStart = true, emitterOptions = undefined) {
    // Initialize parent
    super(emitterOptions)

    // Save parameters in local context
    this.url = MJPEGUrl

    // Initialize remaining local state
    this.currentPhase = MJPEGPhase.STARTING

    // Fetch the stream
    fetch(MJPEGUrl).then(response => {
      // Check that response is OK
      if (!response.ok) {
        this.emit('error', new Error(`Unexpected response: (${response.status}) ${response.statusText}`))
        return
      }

      // Check that readable streams are supported
      if (!response.body) {
        this.emit('error', new Error('MJPEG Error: Browser does not support readable streams.'))
        return
      }

      // Check that content-type is some sort of multipart type
      if (!response.headers['Content-Type'].includes('multipart')) {
        this.emit('error', new Error('MJPEG Error: Expected a multipart content type.'))
        return
      }

      // Determine the multipart boundary string
      this.boundary = response.headers['Content-Type'].split('boundary=')?.[1]
      if (!this.boundary) {
        this.emit('error', new Error('MJPEG Error: Could not determine MJPEG stream multipart boundary.'))
        return
      }

      // Extract the Readable Stream from the body and start reading from it
      this.streamReader = response.body.getReader()
      if (autoStart) { this.readImageFromStream() }
    })
  }

  async readImageFromStream () {
    try {
      // Try to read the next chunk
      const chunkObject = await this.streamReader.read()

      // Stream has closed
      if (!chunkObject || chunkObject.done) {
        this.emit('end')
        return
      }

      // Examine the chunk according to current phase
      const chunkData = chunkObject.value
      const chunkString = chunkData.toString()
      switch (this.currentPhase) {
        case MJPEGPhase.STARTING:
        case MJPEGPhase.SEARCHING_FOR_IMAGE: {
          // 1) Scan the chunk data for recognizable start of multipart content
          const boundaryIndex = chunkString.indexOf(this.boundary)

          // 2) If start of next part found
          // 3)   - Clear the image buffer of any previous data
          // 4)   - Update phase to 'EXTRACTING_IMAGE'
          // 5)   - Append any image data already received
        } break

        case MJPEGPhase.EXTRACTING_IMAGE: {
          // 1) Scan the chunk data for start of next part (as end of image)
          const boundaryIndex = chunkString.indexOf(this.boundary)

          // 3) If end of image was found
          // 4)   - Append only the data up to the image end to the image buffer
          // 5)   - Emit the image buffer as a 'data' event
          // 6)   - Update phase to 'SEARCHING_FOR_IMAGE'
          // 7) Else
          // 8)   - Append all data to the image buffer
        } break
      }

      // Recursively read the next chunk
      this.readImageFromStream()
    } catch (error) {
      // Emit an error and stop reading
      this.emit('error', new Error('MJPEG stream encountered and error', { cause: error }))
    }
  }
}
