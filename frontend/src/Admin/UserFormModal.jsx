import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createUser, updateUser } from '../app/userSlice'

const UserFormModal = ({ user, closeModal, fetchUsers }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    password: ''  
  });

  useEffect(() => {
    // Set form data with existing user details if user exists, without password
    if (user) {
      const { password, ...rest } = user; // Destructure to omit password
      setFormData(rest);
    } else {
      // Reset form (for creating a new user)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        password: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      dispatch(updateUser({ id: user.id, data: formData }));
    } else {
      dispatch(createUser(formData));
    }
    fetchUsers();
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative p-5 w-1/2 mx-auto bg-white rounded">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="block w-full p-2 border border-gray-300 rounded"
          />
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="block w-full p-2 border border-gray-300 rounded"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="block w-full p-2 border border-gray-300 rounded"
          />
          { !user && ( // Only show password field when creating a new user
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              placeholder="Password"
              className="block w-full p-2 border border-gray-300 rounded"
            />
          )}
          <input
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Role"
            className="block w-full p-2 border border-gray-300 rounded"
          />
          <div className="text-right">
            <button
              type="button"
              onClick={closeModal}
              className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
