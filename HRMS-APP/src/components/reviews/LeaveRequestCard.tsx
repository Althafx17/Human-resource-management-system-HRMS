// # ---> NEW: LeaveRequestCard Component
import React, { useState } from 'react';
import { Calendar, User, Check, X } from 'lucide-react';
import { leaveApi } from '../../apis/operations/leaveApi';
import { useToast } from '../../contexts/ToastContext';

interface LeaveRequest {
  id: string | number;
  employeeName: string;
  avatar: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
}

interface LeaveRequestCardProps {
  leaveRequest: LeaveRequest;
  onStatusChange?: (id: string | number, newStatus: 'Approved' | 'Rejected') => void;
}

export default function LeaveRequestCard({ leaveRequest, onStatusChange }: LeaveRequestCardProps) {
  const { showToast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStatus = (status: 'Approved' | 'Rejected') => {
    setIsUpdating(true);
    leaveApi.updateLeaveStatus(leaveRequest.id, status)
      .then(() => {
        showToast(`Leave request ${status.toLowerCase()} successfully!`, 'success');
        setIsUpdating(false);
        if (onStatusChange) {
          onStatusChange(leaveRequest.id, status);
        }
      })
      .catch(err => {
        console.error(`Failed to update leave status to ${status}:`, err);
        showToast(`Failed to update leave status. Please try again.`, 'error');
        setIsUpdating(false);
      });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        {/* Employee Header */}
        <div className="flex items-center gap-3 mb-4">
          {leaveRequest.avatar ? (
            <img 
              src={leaveRequest.avatar} 
              alt={leaveRequest.employeeName} 
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
              <User size={18} />
            </div>
          )}
          <div>
            <h4 className="font-semibold text-gray-800 text-sm">{leaveRequest.employeeName}</h4>
            <p className="text-xs text-gray-500">ID: #{leaveRequest.id}</p>
          </div>
        </div>

        {/* Leave Type Badge */}
        <div className="mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
            {leaveRequest.type}
          </span>
        </div>

        {/* Dates Block */}
        <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
          <Calendar size={14} className="text-gray-400" />
          <span>{leaveRequest.startDate}</span>
          <span className="text-gray-400">to</span>
          <span>{leaveRequest.endDate}</span>
        </div>

        {/* Reason Text */}
        <p className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2.5 mb-4 line-clamp-3 italic">
          "{leaveRequest.reason || 'No reason provided'}"
        </p>
      </div>

      {/* Approve / Reject Actions Grid */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleUpdateStatus('Rejected')}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={isUpdating}
        >
          <X size={14} />
          {isUpdating ? 'Wait...' : 'Reject'}
        </button>
        <button
          type="button"
          onClick={() => handleUpdateStatus('Approved')}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={isUpdating}
        >
          <Check size={14} />
          {isUpdating ? 'Wait...' : 'Approve'}
        </button>
      </div>
    </div>
  );
}
