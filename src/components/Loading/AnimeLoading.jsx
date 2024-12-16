import React, { useState, useEffect } from 'react';

const AnimeLoading = () => {
  const [text, setText] = useState('');
  const fullText = 'Loading...System...Access...Granted...';
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.substring(0, index));
      index++;
      if (index > fullText.length) {
        index = 0;
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <div className="font-mono text-2xl text-green-500">
        <span className="inline-block animate-pulse"></span>
        <span className="ml-2">{text}</span>
        <span className="animate-pulse">_</span>
      </div>
      <div className="mt-4 font-mono text-green-500 text-sm opacity-75">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="my-1">
            {Array.from({ length: 32 }).map((_, j) => (
              <span key={j} className="animate-pulse inline-block" style={{animationDelay: `${(i * 32 + j) * 0.1}s`}}>
                {Math.random() > 0.5 ? '1' : '0'}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimeLoading;