import React, { useState } from 'react';
import axios from 'axios';

function UploadImage() {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setError(null);
    } else {
      setError('Vui lòng chọn một tệp ảnh');
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setError('Vui lòng chọn ảnh trước');
      return;
    }

    setLoading(true);
    setError(null);

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

      const uploadedImageUrl = response.data.secure_url;
      setUrl(uploadedImageUrl);
      
      alert('Tải ảnh lên thành công!');
    } catch (error) {
      console.error('Lỗi tải ảnh:', error);
      setError('Tải ảnh thất bại. Vui lòng thử lại.');
      
      if (error.response) {
        console.error('Chi tiết lỗi:', error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container p-4 max-w-md mx-auto">
      <div className="mb-4">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
          className="w-full p-2 border rounded"
        />
      </div>

      {image && (
        <div className="mb-4">
          <p className="mb-2">Ảnh đã chọn: {image.name}</p>
          <img 
            src={URL.createObjectURL(image)} 
            alt="Preview" 
            className="max-w-full h-auto rounded" 
          />
        </div>
      )}

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button 
        onClick={handleUpload} 
        disabled={!image || loading}
        className={`w-full p-2 rounded ${
          !image || loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {loading ? 'Đang tải...' : 'Tải ảnh lên'}
      </button>

      {url && (
        <div className="mt-4">
          <p className="mb-2">URL ảnh:</p>
          <input 
            type="text" 
            value={url} 
            readOnly 
            className="w-full p-2 border rounded mb-2" 
          />
          <img 
            src={url} 
            alt="Uploaded" 
            className="max-w-full h-auto rounded" 
          />
        </div>
      )}
    </div>
  );
}

export default UploadImage;
