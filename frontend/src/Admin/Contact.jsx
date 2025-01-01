import React, { useEffect, useState } from "react";
import apiClient from "@/services/apiClient";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Pagination from "./Pagination";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Fetch all contacts
  useEffect(() => {
    setLoading(true);
    apiClient
      .get("/contacts")
      .then((response) => {
        setContacts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch contacts:", error);
        setLoading(false);
      });
  }, []);

  // Function to delete a contact
  const deleteContact = (id) => {
    apiClient
      .delete(`/contacts/${id}`)
      .then(() => {
        setContacts(contacts.filter((contact) => contact._id !== id));
      })
      .catch((error) => {
        console.error("Failed to delete contact:", error);
        alert("Failed to delete the contact.");
      });
  };

  // Function to download contacts as a PDF
  const downloadContactsPDF = () => {
    const doc = new jsPDF();
    doc.text("Contact List", 20, 10);
    doc.autoTable({
      head: [["#", "Name", "Email", "Phone", "Message"]],
      body: contacts.map((contact, index) => [
        index + 1,
        contact.name,
        contact.email,
        contact.phone,
        contact.message,
      ]),
    });
    doc.save("contacts.pdf");
  };

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const pageCount = Math.ceil(filteredContacts.length / pageSize);
  const currentContacts = filteredContacts.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col">
      <div className="flex flex-row justify-between mb-4">
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-2 border-gray-300 p-2 rounded"
        />
        <button
          onClick={downloadContactsPDF}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Download Contact List
        </button>
      </div>

      <div className="overflow-x-auto flex-grow">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="text-left py-3 px-4 uppercase font-semibold text-sm"
                style={{ color: "gray" }}
              >
                No.
              </th>
              <th
                className="text-left py-3 px-4 uppercase font-semibold text-sm"
                style={{ color: "gray" }}
              >
                Name
              </th>
              <th
                className="text-left py-3 px-4 uppercase font-semibold text-sm"
                style={{ color: "gray" }}
              >
                Email
              </th>
              <th
                className="text-left py-3 px-4 uppercase font-semibold text-sm"
                style={{ color: "gray" }}
              >
                Phone
              </th>
              <th
                className="text-left py-3 px-4 uppercase font-semibold text-sm"
                style={{ color: "gray" }}
              >
                Message
              </th>
              <th
                className="text-left py-3 px-4 uppercase font-semibold text-sm"
                style={{ color: "gray" }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentContacts.map((contact, index) => (
              <tr key={contact._id}>
                <td className="text-left py-3 px-4">
                  {currentPage * pageSize + index + 1}
                </td>
                <td className="text-left py-3 px-4">{contact.name}</td>
                <td className="text-left py-3 px-4">{contact.email}</td>
                <td className="text-left py-3 px-4">{contact.phone}</td>
                <td className="text-left py-3 px-4">
                  <div
                    style={{
                      maxWidth: "150px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {contact.message}
                  </div>
                </td>
                <td className="text-left py-3 px-4">
                  <button
                    onClick={() => setSelectedContact(contact)}
                    className="text-blue-500 hover:text-blue-700 underline mr-2"
                  >
                    View
                  </button>
                  <button
                    onClick={() => deleteContact(contact._id)}
                    className="text-red-500 hover:text-red-700 underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-auto">
        <Pagination
          canPreviousPage={currentPage > 0}
          canNextPage={currentPage < pageCount - 1}
          pageOptions={Array.from({ length: pageCount }, (_, i) => i + 1)}
          pageCount={pageCount}
          gotoPage={setCurrentPage}
          nextPage={() => setCurrentPage(currentPage + 1)}
          previousPage={() => setCurrentPage(currentPage - 1)}
          pageIndex={currentPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      </div>

      {selectedContact && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Contact Details
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Name: {selectedContact.name}
                  <br />
                  Email: {selectedContact.email}
                  <br />
                  Phone: {selectedContact.phone}
                  <br />
                  Message: {selectedContact.message}
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setSelectedContact(null)}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
