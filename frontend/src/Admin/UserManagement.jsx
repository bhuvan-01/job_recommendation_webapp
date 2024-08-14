import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, deleteUser } from '../app/userSlice';
import UserFormModal from './UserFormModal';

const UserTable = () => {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.users.entities);
    const loading = useSelector((state) => state.users.loading);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleOpenModal = (user = null) => {
        setCurrentUser(user); 
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setCurrentUser(null);
    };

    const filteredUsers = searchTerm.length === 0
        ? users
        : users.filter(user => 
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mx-auto mt-5">
            <div className="flex justify-between mb-4">
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Create New User
                </button>
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-2 border-gray-300 p-2 rounded"
                />
            </div>
            <table className="min-w-full leading-normal">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Email
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Role
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id} className="bg-white border-b">
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {user.firstName} {user.lastName}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {user.email}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {user.role}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm flex items-center">
                                <button
                                    onClick={() => handleOpenModal(user)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => dispatch(deleteUser(user.id))}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {modalOpen && (
                <UserFormModal
                    user={currentUser}
                    closeModal={handleCloseModal}
                    fetchUsers={() => dispatch(fetchUsers())}
                />
            )}
        </div>
    );
};

export default UserTable;
