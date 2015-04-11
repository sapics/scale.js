/**
 * Downscale canvas or image element
 * @param {CanvasElement | ImageElement} canvasOrImage
 * @param {Number | Object} scale
 * @param {CanvasElement} opt_destinationCanvas
 *                         if undefined, original canvas is rewriten
 * @return {CanvasElement}
 */
function scale (canvasOrImage, scale, opt_destinationCanvas) {
	var canvas
	if (canvasOrImage.src) {
		canvas = document.createElement('canvas')
		canvas.width = canvasOrImage.naturalWidth
		canvas.height = canvasOrImage.naturalHeight
		canvas.getContext('2d').drawImage(canvasOrImage, 0, 0)
	} else {
		canvas = canvasOrImage
	}
	var sw = canvas.width, sh = canvas.height
		, dw, dh
		, scaleX, scaleY, scaleXY
		, sourceBuffer = canvas.getContext('2d').getImageData(0, 0, sw, sh).data
	if (canvasOrImage.src || !opt_destinationCanvas) {
		canvas.clearRect(0, 0, sw, sh)
	}
	if (typeof scale === 'object') {
		if (scale.width) {
			dw = scale.width + 0.5 | 0
			dh = scale.height + 0.5 | 0
		} else {
			dw = sw * scale.scaleX + 0.5 | 0
			dh = sh * scale.scaleY + 0.5 | 0
		}
	} else {
		dw = scale * sw + 0.5 | 0
		dh = scale * sh + 0.5 | 0
	}
	scaleX = dw / sw
	scaleY = dh / sh
	scaleXY = scaleX * scaleY
	var dw4 = dw << 2
		,	sw4 = sw << 2
		, sx, sy, sindex = 0
		, dx, dy, dyindex, dindex = 0
		, idx, idy, isx, isy
		, w, wx, nwx, wy, nwy
		, crossX, crossY
		, dwh4 = dw4 * dh
		, tmpBuffer
		, r, g, b, a
		,	isx4
		,	dsy, dsx
		, newCanvas, imageData, byteBuffer
		,	TIMES = 255.99 / 255
		, row0, row1, row2, row3
		, col0, col1, col2, col3

	function getNewCanvas() {
		// CREATE downscale canvas
		var newCanvas
		if (typeof opt_destinationCanvas === 'object') {
			newCanvas = opt_destinationCanvas
		} else if (!opt_destinationCanvas || canvasOrImage.src) {
			newCanvas = canvas
		} else {
			newCanvas = document.createElement('canvas')
		}
		newCanvas.width = dw
		newCanvas.height = dh
		return newCanvas
	}
	function getImageData(canvas, tmpBuffer) {
		if (!tmpBuffer) {
			return canvas.getContext('2d').getImageData(0, 0, dw, dh)
		} else {
			var imageData = newCanvas.getContext('2d').getImageData(0, 0, dw, dh)
				, byteBuffer = imageData.data
				,	dindex
			for (dindex = 0; dindex < dwh4; dindex += 4) {
				byteBuffer[dindex    ] = tmpBuffer[dindex    ] * TIMES | 0
				byteBuffer[dindex + 1] = tmpBuffer[dindex + 1] * TIMES | 0
				byteBuffer[dindex + 2] = tmpBuffer[dindex + 2] * TIMES | 0
				byteBuffer[dindex + 3] = HAS_ALPHA ? tmpBuffer[dindex + 3] * TIMES | 0 : 255
			}
			delete tmpBuffer
			return imageData
		}
	}

	if (scaleX > 1 || scaleY > 1) {
		// UPSCALE by bicubic
		function bicubic (t, a, b, c, d) {
			return 0.5 * (c - a + (2 * a - 5 * b + 4 * c - d + (3 * (b - c) + d - a) * t) * t) * t + b
		}
		newCanvas = getNewCanvas()
		imageData = getImageData(newCanvas)
		byteBuffer = imageData.data
		for (dy = 0; dy < dh; dy++) {
			sy = dy / scaleY
			isy = sy | 0
			dsy = sy - isy
			row1 = isy * sw4
			row0 = isy < 1 ? row1 : row1 - sw4
			if (isy < sh - 2) {
				row2 = row1 + sw4
				row3 = (isy + 2) * sw4
			} else {
				row2 = isy > sh - 2 ? row1 : row1 + sw4
				row3 = row2
			}

			for (dx = 0; dx < dw; dx++, dindex += 4) {
				sx = dx / scaleX
				isx = sx | 0
				dsx = sx - isx
				col1 = isx4 = isx << 2
				col0 = isx < 1 ? col1 : isx4 - 4
				if (isx < sw - 2) {
					col2 = isx4 + 4
					col3 = isx4 + 8
				} else {
					col2 = isx > sw - 2 ? col1 : isx4 + 4
					col3 = col2
				}

				r = bicubic(dsy,
							bicubic(dsx
							,	sourceBuffer[row0 + col0]
							,	sourceBuffer[row0 + col1]
							,	sourceBuffer[row0 + col2]
							,	sourceBuffer[row0 + col3]
							)
						,	bicubic(dsx
							,	sourceBuffer[row1 + col0]
							,	sourceBuffer[row1 + col1]
							,	sourceBuffer[row1 + col2]
							,	sourceBuffer[row1 + col3]
							)
						,	bicubic(dsx
							,	sourceBuffer[row2 + col0]
							,	sourceBuffer[row2 + col1]
							,	sourceBuffer[row2 + col2]
							,	sourceBuffer[row2 + col3]
							)
						,	bicubic(dsx
							,	sourceBuffer[row3 + col0]
							,	sourceBuffer[row3 + col1]
							,	sourceBuffer[row3 + col2]
							,	sourceBuffer[row3 + col3]
							)
						) * TIMES | 0
				g = bicubic(dsy,
							bicubic(dsx
							,	sourceBuffer[row0 + col0 + 1]
							,	sourceBuffer[row0 + col1 + 1]
							,	sourceBuffer[row0 + col2 + 1]
							,	sourceBuffer[row0 + col3 + 1]
							)
						,	bicubic(dsx
							,	sourceBuffer[row1 + col0 + 1]
							,	sourceBuffer[row1 + col1 + 1]
							,	sourceBuffer[row1 + col2 + 1]
							,	sourceBuffer[row1 + col3 + 1]
							)
						,	bicubic(dsx
							,	sourceBuffer[row2 + col0 + 1]
							,	sourceBuffer[row2 + col1 + 1]
							,	sourceBuffer[row2 + col2 + 1]
							,	sourceBuffer[row2 + col3 + 1]
							)
						,	bicubic(dsx
							,	sourceBuffer[row3 + col0 + 1]
							,	sourceBuffer[row3 + col1 + 1]
							,	sourceBuffer[row3 + col2 + 1]
							,	sourceBuffer[row3 + col3 + 1]
							)
						) * TIMES | 0
				b = bicubic(dsy,
							bicubic(dsx
							,	sourceBuffer[row0 + col0 + 2]
							,	sourceBuffer[row0 + col1 + 2]
							,	sourceBuffer[row0 + col2 + 2]
							,	sourceBuffer[row0 + col3 + 2]
							)
						,	bicubic(dsx
							,	sourceBuffer[row1 + col0 + 2]
							,	sourceBuffer[row1 + col1 + 2]
							,	sourceBuffer[row1 + col2 + 2]
							,	sourceBuffer[row1 + col3 + 2]
							)
						,	bicubic(dsx
							,	sourceBuffer[row2 + col0 + 2]
							,	sourceBuffer[row2 + col1 + 2]
							,	sourceBuffer[row2 + col2 + 2]
							,	sourceBuffer[row2 + col3 + 2]
							)
						,	bicubic(dsx
							,	sourceBuffer[row3 + col0 + 2]
							,	sourceBuffer[row3 + col1 + 2]
							,	sourceBuffer[row3 + col2 + 2]
							,	sourceBuffer[row3 + col3 + 2]
							)
						) * TIMES | 0

				byteBuffer[dindex    ] = r >= 0 ? r < 256 ? r : 255 : 0
				byteBuffer[dindex + 1] = g >= 0 ? g < 256 ? g : 255 : 0
				byteBuffer[dindex + 2] = b >= 0 ? b < 256 ? b : 255 : 0

				if (HAS_ALPHA) {
					a = bicubic(dsy,
							bicubic(dsx
							,	sourceBuffer[row0 + col0 + 3]
							,	sourceBuffer[row0 + col1 + 3]
							,	sourceBuffer[row0 + col2 + 3]
							,	sourceBuffer[row0 + col3 + 3]
							)
						,	bicubic(dsx
							,	sourceBuffer[row1 + col0 + 3]
							,	sourceBuffer[row1 + col1 + 3]
							,	sourceBuffer[row1 + col2 + 3]
							,	sourceBuffer[row1 + col3 + 3]
							)
						,	bicubic(dsx
							,	sourceBuffer[row2 + col0 + 3]
							,	sourceBuffer[row2 + col1 + 3]
							,	sourceBuffer[row2 + col2 + 3]
							,	sourceBuffer[row2 + col3 + 3]
							)
						,	bicubic(dsx
							,	sourceBuffer[row3 + col0 + 3]
							,	sourceBuffer[row3 + col1 + 3]
							,	sourceBuffer[row3 + col2 + 3]
							,	sourceBuffer[row3 + col3 + 3]
							)
						) * TIMES | 0
					byteBuffer[dindex + 3] = a >= 0 ? a < 256 ? a : 255 : 0
				} else {
					byteBuffer[dindex + 3] = 255
				}
			}
		}
	} else {
		// DOWNSCALE
		if (window.Float32Array) {
			tmpBuffer = new Float32Array(dwh4)
		} else {
			tmpBuffer = []
			for (var i = 0; i < dwh4; ++i) {
				tmpBuffer[i] = 0
			}
		}
		// CREATE float buffer
		for (sy = 0; sy < sh; sy++) {
			dy = sy * scaleY
			idy = dy | 0
			dyindex = idy * dw4
			crossY = (!!((idy - (dy + scaleY | 0)) * (sh - 1 - sy))) << 1
			if (crossY) {
				wy = idy + 1 - dy
				nwy = dy + scaleY - idy - 1
			}
			for (sx = 0; sx < sw; sx++, sindex += 4) {
				dx = sx * scaleX
				idx = dx | 0
				dindex = dyindex + (idx << 2)
				crossX = !!((idx - (dx + scaleX | 0)) * (sw - 1 - sx))
				if (crossX) {
					wx = idx + 1 - dx
					nwx = dx + scaleX - idx - 1
				}
				r = sourceBuffer[sindex    ]
				g = sourceBuffer[sindex + 1]
				b = sourceBuffer[sindex + 2]
				if (HAS_ALPHA) a = sourceBuffer[sindex + 3]
				switch (crossX + crossY) {
					case 0:
						tmpBuffer[dindex    ] += r * scaleXY
						tmpBuffer[dindex + 1] += g * scaleXY
						tmpBuffer[dindex + 2] += b * scaleXY
						if (HAS_ALPHA) tmpBuffer[dindex + 3] += a * scaleXY
						break
					case 1:
						w = wx * scaleY
						tmpBuffer[dindex    ] += r * w
						tmpBuffer[dindex + 1] += g * w
						tmpBuffer[dindex + 2] += b * w
						if (HAS_ALPHA) tmpBuffer[dindex + 3] += a * w
						w = nwx * scaleY
						tmpBuffer[dindex + 4] += r * w
						tmpBuffer[dindex + 5] += g * w
						tmpBuffer[dindex + 6] += b * w
						if (HAS_ALPHA) tmpBuffer[dindex + 7] += a * w
						break
					case 2:
						w = scaleX * wy
						tmpBuffer[dindex    ] += r * w
						tmpBuffer[dindex + 1] += g * w
						tmpBuffer[dindex + 2] += b * w
						if (HAS_ALPHA) tmpBuffer[dindex + 3] += a * w
						w = scaleX * nwy
						dindex += dw4
						tmpBuffer[dindex    ] += r * w
						tmpBuffer[dindex + 1] += g * w
						tmpBuffer[dindex + 2] += b * w
						if (HAS_ALPHA) tmpBuffer[dindex + 3] += a * w
						break
					default:
						w = wx * wy
						tmpBuffer[dindex    ] += r * w
						tmpBuffer[dindex + 1] += g * w
						tmpBuffer[dindex + 2] += b * w
						if (HAS_ALPHA) tmpBuffer[dindex + 3] += a * w
						w = nwx * wy
						tmpBuffer[dindex + 4] += r * w
						tmpBuffer[dindex + 5] += g * w
						tmpBuffer[dindex + 6] += b * w
						if (HAS_ALPHA) tmpBuffer[dindex + 7] += a * w
						w = wx * nwy
						dindex += dw4
						tmpBuffer[dindex    ] += r * w
						tmpBuffer[dindex + 1] += g * w
						tmpBuffer[dindex + 2] += b * w
						if (HAS_ALPHA) tmpBuffer[dindex + 3] += a * w
						w = nwx * nwy
						tmpBuffer[dindex + 4] += r * w
						tmpBuffer[dindex + 5] += g * w
						tmpBuffer[dindex + 6] += b * w
						if (HAS_ALPHA) tmpBuffer[dindex + 7] += a * w
						break
				}
			}
		}
		delete sourceBuffer
		newCanvas = getNewCanvas()
		imageData = getImageData(newCanvas, tmpBuffer)
	}
	newCanvas.getContext('2d').putImageData(imageData, 0, 0)
	return newCanvas
}
