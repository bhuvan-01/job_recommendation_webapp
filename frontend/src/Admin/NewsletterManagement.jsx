import React, { useState, useEffect } from 'react';
import apiClient from '@/services/apiClient';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Ensure jsPDF-autotable is installed

const SubscriberList = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch subscribers from the backend
    useEffect(() => {
        setLoading(true);
        apiClient.get('/subscribers')
            .then(response => {
                setSubscribers(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch subscribers:', error);
                setLoading(false);
            });
    }, []);

    // Function to delete a subscriber
    const deleteSubscriber = (id) => {
        apiClient.delete(`/subscriber/${id}`)
            .then(() => {
                setSubscribers(subscribers.filter(subscriber => subscriber._id !== id));
            })
            .catch(error => {
                console.error('Failed to delete subscriber:', error);
                alert('Failed to delete the subscriber.');
            });
    };

    // Download all subscribers as PDF
    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.text('Subscribers List', 20, 10);
        doc.autoTable({
            head: [['No.', 'Email']],
            body: subscribers.map((subscriber, index) => [index + 1, subscriber.email]),
        });
        doc.save('subscribers.pdf');
    };

    // Filter subscribers based on search term
    const filteredSubscribers = subscribers.filter(subscriber =>
        subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div>Loading subscribers...</div>;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between mb-4 space-y-2 sm:space-y-0">
                <input
                    type="text"
                    placeholder="Search subscribers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-2 border-gray-300 p-2 rounded w-full sm:w-auto"
                />
                <button
                    onClick={handleDownloadPDF}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Download PDF
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No.</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSubscribers.map((subscriber, index) => (
                            <tr key={subscriber._id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{index + 1}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{subscriber.email}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <button
                                        onClick={() => deleteSubscriber(subscriber._id)}
                                        className="text-red-600 hover:text-red-900"
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

export default SubscriberList;
