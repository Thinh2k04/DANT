import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="relative">
        <input
          type="text"
          placeholder="Tìm kiếm laptop..."
          className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FiSearch className="absolute left-3 top-3 text-gray-400 text-lg" />
      </div>
    </div>
  );
};

export default SearchBar; 