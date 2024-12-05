import axios from 'axios';

const uploadImage = async (image) => {
  const formData = new FormData();
  formData.append('file', image);
  formData.append('api_key', '791946539476834');
  formData.append('upload_preset', 'laptop_preset');

  try {
    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/dmtek0eaq/image/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return { success: true, url: response.data.secure_url };
  } catch (error) {
    console.error('Error uploading the image:', error);
    return { success: false, message: 'Failed to upload image. Please try again.' };
  }
};

export default uploadImage; 