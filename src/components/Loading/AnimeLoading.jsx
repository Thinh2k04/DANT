import React from 'react';

const AnimeLoading = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-5 rounded-lg flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-semibold text-gray-700">Loading...</p>
      </div>
    </div>
  );
};

export default AnimeLoading;