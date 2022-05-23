import cloudinary from 'cloudinary';

const mainRoute = 'iTechArt/Portal';

export async function fileUploader(file, options) {
  return await cloudinary.v2.uploader.upload(
    file,
    { resource_type: 'auto', ...options },
    (error, result) => {
      if (error) {
        console.log(error.message);
        throw new Error(error);
      }

      return result;
    }
  );
}
