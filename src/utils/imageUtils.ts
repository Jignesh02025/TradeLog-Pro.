/**
 * Compresses an image data URL by drawing it to a canvas and exporting as a lower quality JPEG.
 */
export async function compressImage(dataUrl: string, maxWidth = 800, quality = 0.7): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = dataUrl
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height

      if (width > maxWidth) {
        height = (maxWidth / width) * height
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0, width, height)

      resolve(canvas.toDataURL('image/jpeg', quality))
    }
  })
}
