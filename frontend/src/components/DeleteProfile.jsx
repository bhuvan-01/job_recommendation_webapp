import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUserAccount } from '@/app/auth/authSlice';
import apiClient from '@/services/apiClient';

const DeleteProfileCard = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.auth.isLoading);
  const deleteError = useSelector((state) => state.auth.deleteError);

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    const resultAction = await dispatch(deleteUserAccount());
    if (deleteUserAccount.fulfilled.match(resultAction)) {
      navigate('/login'); 
    } else {
      console.error('Failed to delete profile:', deleteError);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <div className="max-w-sm mx-auto bg-white border rounded-lg overflow-hidden mt-2">
      <div className="px-6 py-4">
        <h3 className="text-xl  text-gray-1000">Delete Profile</h3>
        {deleteError && <p className="text-red-500 mb-4">{deleteError}</p>}
        <button
          className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleDeleteClick}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Delete Profile'}
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-gray-800 mb-4">
              Are you sure you want to delete your profile?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleConfirmDelete}
                disabled={isLoading}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleCancelDelete}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteProfileCard;
