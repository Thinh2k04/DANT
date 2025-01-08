import React from 'react';

const AttributeTab = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex flex-wrap -mb-px gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center px-4 py-2.5 rounded-t-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AttributeTab; 