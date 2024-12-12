import React from 'react';

const AnimeLoading = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <div className="relative w-32 h-32">
        {/* Vòng xoay bên ngoài */}
        <div className="absolute inset-0 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        
        {/* Vòng xoay bên trong */}
        <div className="absolute inset-2 border-4 border-t-pink-500 border-r-transparent border-b-transparent border-l-pink-500 rounded-full animate-spin-reverse"></div>
        
        {/* Logo hoặc icon ở giữa */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Text animation */}
      <div className="mt-8 text-xl font-medium text-gray-700">
        <span className="inline-block animate-bounce">Đ</span>
        <span className="inline-block animate-bounce" style={{animationDelay: '0.1s'}}>a</span>
        <span className="inline-block animate-bounce" style={{animationDelay: '0.2s'}}>n</span>
        <span className="inline-block animate-bounce" style={{animationDelay: '0.3s'}}>g</span>
        <span className="inline-block animate-bounce" style={{animationDelay: '0.4s'}}> </span>
        <span className="inline-block animate-bounce" style={{animationDelay: '0.5s'}}>t</span>
        <span className="inline-block animate-bounce" style={{animationDelay: '0.6s'}}>ả</span>
        <span className="inline-block animate-bounce" style={{animationDelay: '0.7s'}}>i</span>
        <span className="inline-block animate-bounce" style={{animationDelay: '0.8s'}}>.</span>
        <span className="inline-block animate-bounce" style={{animationDelay: '0.9s'}}>.</span>
        <span className="inline-block animate-bounce" style={{animationDelay: '1s'}}>.</span>
      </div>
    </div>
  );
};

export default AnimeLoading; 