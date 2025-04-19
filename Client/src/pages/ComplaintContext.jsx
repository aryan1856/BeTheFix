import React, { createContext, useContext, useState } from 'react';

const ComplaintContext = createContext();

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      title: "Overflowing garbage near Central Park",
      description: "Garbage hasn't been collected for 5 days, causing foul smell and rodent problems in the area.",
      status: "open",
      upvotes: 24,
      image: "https://images.unsplash.com/photo-1584473457409-ce9e0c1e6bfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
      location: "Central Park West",
      date: "2023-05-15"
    },
    {
      id: 2,
      title: "Dangerous potholes on Main Street",
      description: "Multiple large potholes causing damage to vehicles and creating traffic hazards.",
      status: "resolved",
      upvotes: 42,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
      location: "Main Street & 5th Avenue",
      date: "2023-05-10",
      resolution: "Repaired on May 12th by city works department"
    },
    {
      id: 3,
      title: "Broken streetlight on Oak Lane",
      description: "Light has been out for 2 weeks, making nighttime walking dangerous.",
      status: "neglected",
      upvotes: 15,
      image: "https://images.unsplash.com/photo-1512058531953-9aca45847df1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
      location: "Oak Lane Residential Area",
      date: "2023-04-28"
    },
    {
      id: 4,
      title: "Vandalized playground equipment",
      description: "Swings and slides damaged by vandals, creating safety hazards for children.",
      status: "open",
      upvotes: 31,
      image: "https://images.unsplash.com/photo-1591382386627-349b692688ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
      location: "Riverside Park",
      date: "2023-05-14"
    },
    {
      id: 5,
      title: "Illegal dumping in alleyway",
      description: "Construction debris and old furniture being dumped behind commercial buildings.",
      status: "open",
      upvotes: 18,
      image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
      location: "Commerce Street Alley",
      date: "2023-05-16"
    },
    {
      id: 6,
      title: "Flooded intersection after rains",
      description: "Poor drainage causes dangerous flooding that lasts for days after rainfall.",
      status: "resolved",
      upvotes: 27,
      image: "https://images.unsplash.com/photo-1437957146754-f6377debe171?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
      location: "3rd Street & Maple Ave",
      date: "2023-05-05",
      resolution: "Drainage system cleared and improved on May 9th"
    },
    {
      id: 7,
      title: "Abandoned vehicle on residential street",
      description: "Car has been parked in same spot for 3 months with flat tires and broken windows.",
      status: "open",
      upvotes: 12,
      image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
      location: "Pine Street",
      date: "2023-04-10"
    },
    {
      id: 8,
      title: "Graffiti on historic building",
      description: "Tagging covering the side of the 1920s post office building.",
      status: "neglected",
      upvotes: 9,
      image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
      location: "Main Street Post Office",
      date: "2023-03-22"
    }
  ]);

  const updateComplaintStatus = (id, newStatus, remark = '') => {
    setComplaints(prevComplaints =>
      prevComplaints.map(complaint =>
        complaint.id === id
          ? {
              ...complaint,
              status: newStatus,
              ...(newStatus === 'resolved' && { resolution: remark }),
              ...(newStatus === 'resolved' && { resolvedDate: new Date().toISOString().split('T')[0] })
            }
          : complaint
      )
    );
  };

  const upvoteComplaint = (id) => {
    setComplaints(prevComplaints =>
      prevComplaints.map(complaint =>
        complaint.id === id
          ? { ...complaint, upvotes: complaint.upvotes + 1 }
          : complaint
      )
    );
  };

  const addComplaint = (newComplaint) => {
    const id = Math.max(...complaints.map(c => c.id)) + 1;
    setComplaints(prev => [
      ...prev,
      {
        ...newComplaint,
        id,
        status: 'open',
        upvotes: 0,
        date: new Date().toISOString().split('T')[0]
      }
    ]);
  };

  return (
    <ComplaintContext.Provider 
      value={{ 
        complaints, 
        setComplaints,
        updateComplaintStatus,
        upvoteComplaint,
        addComplaint
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => useContext(ComplaintContext);