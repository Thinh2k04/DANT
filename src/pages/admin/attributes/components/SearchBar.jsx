import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm laptop..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-2.5 text-gray-400 text-lg" />
        </div>
      </div>
    </div>
  );
};

export default SearchBar; 