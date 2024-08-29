import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTable } from "react-table";
import { fetchUsers, deleteUser } from "../app/userSlice";
import UserFormModal from "./UserFormModal";

const UserTable = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.entities);
  const loading = useSelector((state) => state.users.loading);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredUsers =
    searchTerm.length === 0
      ? users
      : users.filter(
          (user) =>
            `${user.firstName} ${user.lastName}`
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

  // Define columns using useMemo to prevent unnecessary re-renders
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: (row) => `${row.firstName} ${row.lastName}`,
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Role",
        accessor: "role",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => handleOpenModal(row.original)}
              className="text-indigo-600 hover:text-indigo-900"
            >
              Update
            </button>
            <button
              onClick={() => dispatch(deleteUser(row.original.id))}
              className="text-red-600 hover:text-red-900"
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [dispatch]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: filteredUsers });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between mb-4 space-y-2 sm:space-y-0">
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
        >
          Create New User
        </button>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-2 border-gray-300 p-2 rounded w-full sm:w-auto"
        />
      </div>
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full leading-normal">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                className="bg-gray-100"
              >
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="bg-white border-b">
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      className="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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
