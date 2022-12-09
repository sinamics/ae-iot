import { db } from '@/lib/db';
import React from 'react';
import UsersTable from './(components)/userTable';

const fetchUsers = () => {
  return db.user.findMany();
};

const Users = async () => {
  const users = await fetchUsers();
  console.log(users);
  return (
    <div>
      <div className='flex justify-center text-2xl pt-5'>Users</div>
      <div className='container'>
        <UsersTable users={users} />
      </div>
    </div>
  );
};

export default Users;
