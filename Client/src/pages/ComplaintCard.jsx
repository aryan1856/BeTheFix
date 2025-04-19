import React, { useState } from 'react';
import { ChevronDown, Check, Forward } from 'lucide-react';

const ComplaintCard = ({ complaint, onStatusChange, onForwardComplaint }) => {
  const [showRemarkInput, setShowRemarkInput] = useState(false);
  const [showForwardDropdown, setShowForwardDropdown] = useState(false);
  const [remark, setRemark] = useState('');
  const [forwardTo, setForwardTo] = useState('');

  const departmentOptions = [
    { id: 1, name: 'Municipal Corporation', value: 'municipal_corporation' },
    { id: 2, name: 'Nagar Nigam', value: 'nagar_nigam' },
    { id: 3, name: 'Public Works Department', value: 'pwd' },
    { id: 4, name: 'Sanitation Department', value: 'sanitation' },
    { id: 5, name: 'Electrical Department', value: 'electrical' }
  ];

  const handleForwardClick = () => {
    setShowForwardDropdown(!showForwardDropdown);
    setShowRemarkInput(false); // Close resolve input if open
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] border border-gray-100 overflow-hidden relative">
      {/* Image section */}
      <div className="relative h-48 overflow-hidden rounded-lg mb-4 group">
        <img
          src={complaint.image || getRandomImage()}
          alt={complaint.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="px-1">
        <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{complaint.title}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2 min-h-[2.5rem]">
          {complaint.description}
        </p>

        <div className="flex justify-between items-center mt-3">
          <div>
            <p className="text-sm">
              <span className="font-medium text-gray-800">Status:</span>{' '}
              <span className={`font-medium capitalize ${getStatusColor(complaint.status)}`}>
                {complaint.status}
              </span>
            </p>
            <p className="text-sm text-gray-700 mt-1">Upvotes: {complaint.upvotes}</p>
          </div>

          {/* Action buttons */}
          {!['resolved', 'neglected'].includes(complaint.status) && !showRemarkInput && (
            <div className="flex gap-2">
              {/* Resolve Button */}
              <button
                onClick={() => setShowRemarkInput(true)}
                className="flex items-center px-3 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Check className="h-4 w-4 mr-1" />
                Resolve
              </button>

              {/* Forward Dropdown */}
              <div className="relative">
                <button
                  onClick={handleForwardClick}
                  className="flex items-center px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Forward className="h-4 w-4 mr-1" />
                  Forward
                  <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showForwardDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown positioned above */}
                {showForwardDropdown && (
                  <div className="absolute bottom-full right-0 mb-2 w-56 bg-white rounded-md shadow-xl ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                      <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b">
                        Forward to department:
                      </div>
                      {departmentOptions.map((dept) => (
                        <button
                          key={dept.id}
                          onClick={() => setForwardTo(dept.value)}
                          className={`flex w-full items-center px-4 py-2 text-sm text-left ${
                            forwardTo === dept.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {forwardTo === dept.value && (
                            <Check className="h-4 w-4 mr-2 text-blue-500" />
                          )}
                          {dept.name}
                        </button>
                      ))}
                      <div className="border-t px-3 py-2">
                        <button
                          onClick={() => {
                            onForwardComplaint(complaint.id, forwardTo);
                            setShowForwardDropdown(false);
                          }}
                          disabled={!forwardTo}
                          className={`w-full py-1 px-3 rounded text-sm ${
                            forwardTo
                              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Confirm Forward
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Resolution Input */}
        {showRemarkInput && (
          <div className="mt-4 space-y-2">
            <textarea
              rows="3"
              placeholder="Enter resolution details..."
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onStatusChange(complaint.id, 'resolved', remark);
                  setShowRemarkInput(false);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200 shadow-md"
              >
                Confirm Resolution
              </button>
              <button
                onClick={() => setShowRemarkInput(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm transition-colors duration-200 shadow-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ... (keep the same getStatusColor and getRandomImage functions)

// Helper functions
const getStatusColor = (status) => {
  const colors = {
    open: 'text-amber-500',
    resolved: 'text-green-500',
    neglected: 'text-red-500',
    default: 'text-gray-500'
  };
  return colors[status] || colors.default;
};

const getRandomImage = () => {
  const placeholderImages = {
    default: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80',
    construction: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80',
    garbage: 'https://images.unsplash.com/photo-1584473457409-ce9e0c1e6bfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80',
    road: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80'
  };
  const categories = Object.keys(placeholderImages);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  return placeholderImages[randomCategory];
};

export default ComplaintCard;