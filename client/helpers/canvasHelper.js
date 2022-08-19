/**
 * Draw an image into a canvas element
 * @param {HTMLCanvasElement} canvas A canvas image element
 * @param {string} imageData Base64 encoded JPEG image data
 * @param {number} rotation Rotation value in 90 deg units
 * @param {boolean} clear Should we clear the canvas first
 */
export function drawImageToCanvas (canvas, imageData, histograms, rotation, zoomScale, clear = false) {
  const img = new Image()
  img.src = 'data:image/jpeg;base64,' + imageData
  img.onload = () => {
    // Determine image dims with rotation
    const imgDims = { width: img.width, height: img.height }
    if (Math.abs(rotation) === 1) {
      imgDims.width = img.height
      imgDims.height = img.width
    }

    // Resize canvas
    if (canvas.width !== imgDims.width) {
      canvas.width = imgDims.width
      canvas.height = imgDims.height
    }

    // Clear the canvas if requested
    if (clear) { clearCanvas(canvas) }

    // Get a clean context
    const ctx = canvas.getContext('2d')
    ctx.resetTransform()

    // Add the zoom scaling and recenter
    if (zoomScale !== 1.0) {
      ctx.translate(
        canvas.width / 2 - zoomScale * imgDims.width / 2,
        canvas.height / 2 - zoomScale * imgDims.height / 2
      )
      ctx.scale(zoomScale, zoomScale)
    }

    // Apply any rotation
    ctx.translate(imgDims.width / 2, imgDims.height / 2)
    ctx.rotate(rotation * Math.PI / 2)
    ctx.translate(-img.width / 2, -img.height / 2)

    // Draw the image
    ctx.drawImage(img, 0, 0, img.width, img.height)

    // Draw the histograms
    drawHistogramsToCanvas(ctx, histograms, imgDims.width, imgDims.height)
  }

  img.onerror = (error) => {
    console.error('Error drawing image:', error)
  }
}

/**
 * Graph the given histogram data to the given canvas element
 * @param {Array(UInt32Array)} histograms A set of UInt32 arrays with histogram data (Y, R, G, and B channels)
 */
function drawHistogramsToCanvas (ctx, histograms, width, height) {
  if (!Array.isArray(histograms) || histograms.length < 1) {
    return
  }

  // Setup a reasonable scaling
  ctx.resetTransform()
  ctx.scale(2, 2)

  // Get a render context from the canvas and setup the path style
  ctx.lineWidth = 1
  for (let i = 0; i < histograms.length; i++) {
    // Set path color
    switch (i) {
      case 1: ctx.strokeStyle = ctx.fillStyle = '#ff0000'; break
      case 2: ctx.strokeStyle = ctx.fillStyle = '#00ff00'; break
      case 3: ctx.strokeStyle = ctx.fillStyle = '#0000ff'; break
      default: ctx.strokeStyle = ctx.fillStyle = '#ffffff'; break
    }

    // Start a path for the histogram object
    ctx.beginPath()

    // Start at lower left corner
    ctx.moveTo(0, height / 2)

    // Add vertices for each point in the histogram
    const histData = new Uint32Array(histograms[i])
    histData.forEach((value, bin) => {
      ctx.lineTo(bin, (height / 2) - (value / 64))
    })

    // End at lower right corner
    ctx.lineTo(255, height / 2)

    // Draw the line
    ctx.globalAlpha = 1.0
    ctx.stroke()

    // Draw the area under the line
    ctx.globalAlpha = 0.33
    ctx.closePath()
    ctx.fill()

    // Set opacity back to 100%
    ctx.globalAlpha = 1.0
  }
}

/**
 * Clear a canvas element
 * @param {HTMLCanvasElement} canvas The canvas element to clear
 */
export function clearCanvas (canvas) {
  const ctx = canvas.getContext('2d')
  ctx.resetTransform()
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}
