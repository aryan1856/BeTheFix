import { useState } from 'react';
import { ChevronDown, Check, Forward, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ComplaintCard = ({ complaint, onStatusChange }) => {
  console.log(complaint )
  const [showRemarkInput, setShowRemarkInput] = useState(false);
  const [showForwardDropdown, setShowForwardDropdown] = useState(false);
  const [remark, setRemark] = useState('');
  const [forwardTo, setForwardTo] = useState('');

  const departmentType = useSelector(state => state.user.loggedinUser.departmentType);

  const departmentOptions = [
    { id: 1, name: 'Public Works Department', value: 'PWD' },
    { id: 2, name: 'Cleanliness Department', value: 'Cleanliness' },
    { id: 3, name: 'Sewage Department', value: 'Sewage' },
    { id: 4, name: 'Electrical Department', value: 'Electrical' },
    { id: 5, name: 'Education Department', value: 'Education' },
    { id: 6, name: 'Water Supply Department', value: 'Water Supply' }
  ];

  const handleResolve = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/resolve`, {
        postId: complaint._id,
        resolutionText: remark,
      }, { withCredentials: true });

      setShowRemarkInput(false);
      setRemark('');
      toast.success('Complaint resolved successfully ✅');
      if (onStatusChange) onStatusChange();
    } catch (err) {
      console.error('Failed to resolve complaint:', err);
      toast.error('Failed to resolve complaint ❌');
    }
  };

  const handleReject = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/reject`, {
        postId: complaint._id,
        rejectionReason: remark
      }, { withCredentials: true });

      setShowRemarkInput(false);
      setRemark('');
      toast.success('Complaint rejected successfully ❌');
      if (onStatusChange) onStatusChange();
    } catch (err) {
      console.error('Failed to reject complaint:', err);
      toast.error('Failed to reject complaint ❌');
    }
  };

  const handleForward = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/forward`, {
        postId: complaint._id,
        targetDepartment: forwardTo
      }, { withCredentials: true });

      setShowForwardDropdown(false);
      setForwardTo('');
      toast.success('Complaint forwarded successfully 📤');
      if (onStatusChange) onStatusChange();
    } catch (err) {
      console.error('Failed to forward complaint:', err);
      toast.error('Failed to forward complaint ❌');
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] border border-gray-100 overflow-hidden relative">
      <div className="relative h-48 overflow-hidden rounded-lg mb-4 group">
        {complaint.images?.length > 0 ? (
          complaint.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Image ${i}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ))
        ) : (
          <img
            src="/default.jpg"
            alt="Default"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="px-1">
        <h3 className="text-lg font-bold text-gray-800">{complaint.title}</h3>
        <p className="text-sm text-gray-600 mt-1 min-h-[2.5rem]">{complaint.description}</p>

        <div className="flex justify-between items-center mt-3">
          <div>
            <p className="text-sm">
              <span className="font-medium text-gray-800">Status:</span>{' '}
              <span className={`font-medium capitalize ${getStatusColor(complaint.status.state)}`}>
                {complaint.status.state}
              </span>
            </p>
            {complaint.status.remarks && (
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-medium text-gray-800">Remark:</span> {complaint.status.remarks}
              </p>
            )}
            <p className="text-sm text-gray-700 mt-1">Upvotes: {complaint.upvotes?.length}</p>
          </div>

          {!['Resolved', 'Rejected'].includes(complaint.status.state) && !showRemarkInput && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowRemarkInput(true)}
                className="flex items-center px-3 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg"
              >
                <Check className="h-4 w-4 mr-1" /> Resolve
              </button>

              <button
                onClick={() => setShowRemarkInput(true)}
                className="flex items-center px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                <X className="h-4 w-4 mr-1" /> Reject
              </button>

              {departmentType === 'Municipality' && (
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowForwardDropdown(!showForwardDropdown);
                      setShowRemarkInput(false);
                    }}
                    className={`flex items-center px-3 py-2 text-sm rounded-lg ${
                      complaint.status.state.includes("Pending at")
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                    disabled={complaint.status.state === 'Pending at'}
                  >
                    <Forward className="h-4 w-4 mr-1" />
                    Forward
                    <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showForwardDropdown ? 'rotate-180' : ''}`} />
                  </button>

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
                            {forwardTo === dept.value && <Check className="h-4 w-4 mr-2 text-blue-500" />}
                            {dept.name}
                          </button>
                        ))}
                        <div className="border-t px-3 py-2">
                          <button
                            onClick={handleForward}
                            disabled={!forwardTo}
                            className={`w-full py-1 px-3 rounded text-sm ${
                              forwardTo
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
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
              )}
            </div>
          )}
        </div>

        {showRemarkInput && (
          <div className="mt-4 space-y-2">
            <textarea
              rows="3"
              placeholder="Enter resolution or rejection remark..."
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 shadow-sm"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={handleResolve}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                Confirm Resolve
              </button>
              <button
                onClick={handleReject}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                Confirm Reject
              </button>
              <button
                onClick={() => setShowRemarkInput(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm"
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

const getStatusColor = (status) => {
  const colors = {
    open: 'text-amber-500',
    Resolved: 'text-green-500',
    Rejected: 'text-red-500',
    forwarded: 'text-blue-500',
    'Pending at': 'text-blue-400',
    default: 'text-gray-500',
  };
  return colors[status] || colors.default;
};

export default ComplaintCard;
