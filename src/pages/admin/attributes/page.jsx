import React, { useState } from 'react';
import NavbarAdmin from '../Navbar/NavbarAdmin';
import uploadImage from '../../../utils/imageUpload';

const AttributeManagement = () => {
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
      setError('Please select an image file');
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await uploadImage(image);

    if (result.success) {
      setUrl(result.url);
      alert('Image uploaded successfully!');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      <NavbarAdmin />
      <main className="flex-1 bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-6">Quản lý thuộc tính</h1>
        
        <div className="mt-4">
          <input 
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="mb-4"
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button 
            onClick={handleUpload}
            disabled={loading || !image}
            className={`px-4 py-2 rounded ${
              loading || !image
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {loading ? 'Uploading...' : 'Upload Image'}
          </button>

          {url && (
            <div className="mt-4">
              <img 
                src={url} 
                alt="Uploaded" 
                className="max-w-md h-auto rounded shadow-lg"
              />
              <p className="mt-2">Image URL: {url}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AttributeManagement;