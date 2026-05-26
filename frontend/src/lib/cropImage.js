const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', reject);
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

/**
 * Renders a square crop from pixelCrop into a JPEG blob (default 512×512).
 */
export const getCroppedImageBlob = async (imageSrc, pixelCrop, outputSize = 512, quality = 0.92) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Could not prepare image crop.');
  }

  canvas.width = outputSize;
  canvas.height = outputSize;

  context.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputSize,
    outputSize
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Could not process image.'));
          return;
        }
        resolve(blob);
      },
      'image/jpeg',
      quality
    );
  });
};

export const blobToFile = (blob, fileName = 'avatar.jpg') =>
  new File([blob], fileName, { type: blob.type || 'image/jpeg' });
