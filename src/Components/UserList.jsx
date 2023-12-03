// UsersList.js

import React, { useEffect, useState } from "react";
import "./UsersList.css";
import "antd/dist/reset.css";
import ReactPaginate from "react-paginate";
import { AiFillDelete, AiFillEdit, AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const itemPerPage = 10;
  const pageVisited = pageCount * itemPerPage;
  const totalPages = Math.ceil(users.length / itemPerPage);

  const pageChange = ({ selected }) => {
    setPageCount(selected);
  };

  useEffect(() => {
    getUsersDetails();
  }, []);

  const getUsersDetails = () => {
    fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  };

  const deleteUser = (selectedUser) => {
    let userAfterDeletion = users.filter((user) => user.id !== selectedUser);
    setUsers(userAfterDeletion);
    setSelectedRows([]);
  };

  const editUserDetails = (userId, name, email) => {
    setEditingUserId(userId);
    setEditedName(name);
    setEditedEmail(email);
  };

  const saveEditedDetails = (userId) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return { ...user, name: editedName, email: editedEmail };
      }
      return user;
    });

    setUsers(updatedUsers);
    setEditingUserId(null);
    setEditedName("");
    setEditedEmail("");
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditedName("");
    setEditedEmail("");
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === itemPerPage) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredUsers.map((user) => user.id));
    }
  };

  const toggleRowSelection = (userId) => {
    if (selectedRows.includes(userId)) {
      setSelectedRows(selectedRows.filter((id) => id !== userId));
    } else {
      setSelectedRows([...selectedRows, userId]);
    }
  };

  const deleteSelectedRows = () => {
    const usersAfterDeletion = users.filter((user) => !selectedRows.includes(user.id));
    setUsers(usersAfterDeletion);
    setSelectedRows([]);
  };

  const filteredUsers = users.filter((user) => {
    if (!searchName.trim()) return true; // Check if searchName is empty or contains only whitespaces
    return user.name.toLowerCase().includes(searchName.toLowerCase());
  });

  return (
    <div className="container">
      <div className="status-container">
        <p className="selected-status">
          {selectedRows.length > 0
            ? `${selectedRows.length} of ${filteredUsers.length} row(s) selected`
            : "No rows selected"}
        </p>
      </div>

      <div className="search-delete-container">
        <input
          type="text"
          name="name"
          placeholder="Enter any value..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="search-input"
        />

        {selectedRows.length > 0 && (
          <button onClick={deleteSelectedRows} className="delete-selected-btn">
            <AiFillDelete />
            Delete Selected
          </button>
        )}
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" onChange={toggleSelectAll} checked={selectedRows.length === itemPerPage} />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers
            .slice(pageVisited, pageVisited + itemPerPage)
            .map((user) => (
              <tr key={user.id} className={selectedRows.includes(user.id) ? "selected-row" : "normal-row"}>
                <td>
                  <input type="checkbox" onChange={() => toggleRowSelection(user.id)} checked={selectedRows.includes(user.id)} />
                </td>
                <td>
                  {editingUserId === user.id ? (
                    <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editingUserId === user.id ? (
                    <input type="text" value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} />
                  ) : (
                    user.email
                  )}
                </td>
                <td>{user.role}</td>
                <td className="btn">
                  {editingUserId === user.id ? (
                    <>
                      <button onClick={() => saveEditedDetails(user.id)}>
                        <AiFillCheckCircle />
                      </button>
                      <button onClick={cancelEdit}>
                        <AiFillCloseCircle />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => editUserDetails(user.id, user.name, user.email)}>
                      <AiFillEdit />
                    </button>
                  )}
                  <button onClick={() => deleteUser(user.id)} className="delete-btn">
                    <AiFillDelete />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <ReactPaginate
        className="pagination"
        previousLabel={"Prev"}
        nextLabel={"Next"}
        pageCount={totalPages}
        onPageChange={pageChange}
        containerClassName={"pagination"}
        activeClassName={"active"}
        pageLinkClassName="page"
        previousLinkClassName="page"
        nextLinkClassName="page"
        disabledClassName="disabled"
        breakLabel={"..."}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        initialPage={pageCount}
        style={{ marginTop: "10px" }}
      />

      <div className="status-container">
        <p className="page-status">
          Page {pageCount + 1} out of {totalPages}
        </p>
      </div>
    </div>
  );
}

export default UsersList;
