// components/UrlList.jsx
import React from 'react';

const UrlList = ({ urls }) => {
  if (urls.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <p className="text-gray-500 text-lg">No URLs shortened yet. Start by shortening your first URL above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Shortened URLs</h2>
      <div className="space-y-4">
        {urls.map((urlItem) => (
          <div key={urlItem.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className={`w-3 h-3 rounded-full mr-2 ${
                    urlItem.analysis.isMalicious ? 'bg-red-500' : 'bg-green-500'
                  }`}></span>
                  <a 
                    href={urlItem.shortUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-semibold break-all"
                  >
                    {urlItem.shortUrl}
                  </a>
                </div>
                <p className="text-gray-600 text-sm break-all">
                  Original: {urlItem.originalUrl}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Created: {new Date(urlItem.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  urlItem.analysis.isMalicious 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {urlItem.analysis.isMalicious ? 'Malicious' : 'Safe'}
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText(urlItem.shortUrl)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UrlList;