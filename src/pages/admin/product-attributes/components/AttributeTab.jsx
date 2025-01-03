import React from 'react';

const AttributeTab = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex space-x-4 mb-6">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 rounded-lg ${
            activeTab === tab.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default AttributeTab; 