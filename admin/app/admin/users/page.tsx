"use client";

import axios from 'axios';
import React, { useEffect, useState } from 'react';

type UserType = {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string;
  company_name: string;
  company_phone: string;
  company_email: string;
}

const Users = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<UserType[] | []>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, status } = await axios.get('http://localhost:8000/api/admin/users');

        if (status !== 200) {
          throw new Error(`Failed to fetch users: ${status}`);
        }
        setUsers(data.data.users);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);


  // handle delete
  const handleDelete = async (id: number) => {
    try {
      const { status } = await axios.delete(`http://localhost:8000/api/admin/users/${id}`);
      if (status !== 200) {
        throw new Error("Failed to delete user");
      }
      setUsers((prevUsers: UserType[]) => prevUsers.filter((user) => user.id !== id));
    } catch (err: any) {
      if (err?.response) {
        setError(err.response.data.message);
      } else {
        setError(err.message)
      }
    }
  }

  return (
    <div>
      {isLoading && <p>Loading users...</p>}
      {error && <div className='my-4 p-2 bg-red-500 text-white'>Error: {error}</div>}
      {(users && users.length > 0) ? (
        <table className='w-full'>
          <thead>
            <tr className='border-b text-left'>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Company Name</th>
              <th>Company Phone</th>
              <th>Company Email</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: UserType) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.phone}</td>
                <td>{user.company_name ? user.company_name : "-"}</td>
                <td>{user.company_phone ? user.company_phone : "-"}</td>
                <td>{user.company_email ? user.company_email : "-"}</td>
                <td><button onClick={() => handleDelete(user.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      ):(
        <p className='py-4'>No users yet</p>
      )}
    </div>
  );
};

export default Users;