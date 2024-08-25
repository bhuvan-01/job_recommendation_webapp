import React, { useEffect, useState } from 'react';
import apiClient from '@/services/apiClient'; // Adjust the path as necessary

const AdminContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all contacts
    useEffect(() => {
        setLoading(true);
        apiClient.get('/contacts')
            .then(response => {
                setContacts(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch contacts:', error);
                setLoading(false);
            });
    }, []);

    // Function to delete a contact
    const deleteContact = (id) => {
        apiClient.delete(`/contacts/${id}`)
            .then(() => {
                // Remove the contact from the state to update the UI
                setContacts(contacts.filter(contact => contact._id !== id));
            })
            .catch(error => {
                console.error('Failed to delete contact:', error);
                alert('Failed to delete the contact.');
            });
    };

    if (loading) {
        return <div>Loading contacts...</div>;
    }

    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-xl font-bold mb-4">Contact Requests</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Name</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Email</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Phone</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Message</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map(contact => (
                            <tr key={contact._id}>
                                <td className="text-left py-3 px-4">{contact.name}</td>
                                <td className="text-left py-3 px-4">{contact.email}</td>
                                <td className="text-left py-3 px-4">{contact.phone}</td>
                                <td className="text-left py-3 px-4">{contact.message}</td>
                                <td className="text-left py-3 px-4">
                                    <button
                                        className="text-red-500 hover:text-red-700 underline"
                                        onClick={() => deleteContact(contact._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminContacts;
