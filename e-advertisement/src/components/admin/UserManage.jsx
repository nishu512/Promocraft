import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UserManage.css';

const UserManage = () => {
  const [users, setUsers] = useState([]);
  const [searchTermUser, setSearchTermUser] = useState('');
  const [searchTermAgency, setSearchTermAgency] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredAgencies, setFilteredAgencies] = useState([]);

  const userRoleId = '67f7eeedadb0cadeb9af3da1';
  const agencyRoleId = '67f7eecfadb0cadeb9af3d9f';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users');
      const allUsers = response.data.data;
      const usersFiltered = allUsers.filter(user => user.roleId && user.roleId._id === userRoleId);
      const agenciesFiltered = allUsers.filter(user => user.roleId && user.roleId._id === agencyRoleId);

      setUsers(allUsers);
      setFilteredUsers(usersFiltered);
      setFilteredAgencies(agenciesFiltered);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/user/${id}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Error deleting user');
    }
  };

  const handleSearchUser = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTermUser(value);
    const filtered = users.filter(user =>
      user.roleId && user.roleId._id === userRoleId &&
      (user.firstName.toLowerCase().includes(value) ||
       user.lastName.toLowerCase().includes(value) ||
       user.email.toLowerCase().includes(value))
    );
    setFilteredUsers(filtered);
  };

  const handleSearchAgency = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTermAgency(value);
    const filtered = users.filter(user =>
      user.roleId && user.roleId._id === agencyRoleId &&
      (user.firstName.toLowerCase().includes(value) ||
       user.lastName.toLowerCase().includes(value) ||
       user.email.toLowerCase().includes(value))
    );
    setFilteredAgencies(filtered);
  };

  return (
    <div className="container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="table-wrapper">
        <motion.div
          className="section"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Users</h2>
          <input
            type="text"
            value={searchTermUser}
            onChange={handleSearchUser}
            placeholder="Search users..."
            className="search-input"
          />
          <table>
            <thead>
              <tr>
                <th>First Name</th><th>Last Name</th><th>Email</th><th>Gender</th><th>Contact No.</th><th>Role</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.gender}</td>
                    <td>{user.contactNo}</td>
                    <td>{user.roleId ? user.roleId.name : 'N/A'}</td>
                    <td><button onClick={() => handleDeleteUser(user._id)} className="delete-btn">Delete</button></td>
                  </motion.tr>
                ))
              ) : (
                <tr><td colSpan="7">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </motion.div>

        <motion.div
          className="section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>Agencies</h2>
          <input
            type="text"
            value={searchTermAgency}
            onChange={handleSearchAgency}
            placeholder="Search agencies..."
            className="search-input"
          />
          <table>
            <thead>
              <tr>
                <th>First Name</th><th>Last Name</th><th>Email</th><th>Gender</th><th>Contact No.</th><th>Role</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgencies.length > 0 ? (
                filteredAgencies.map((user) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.gender}</td>
                    <td>{user.contactNo}</td>
                    <td>{user.roleId ? user.roleId.name : 'N/A'}</td>
                    <td><button onClick={() => handleDeleteUser(user._id)} className="delete-btn">Delete</button></td>
                  </motion.tr>
                ))
              ) : (
                <tr><td colSpan="7">No agencies found.</td></tr>
              )}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
};

export default UserManage;
