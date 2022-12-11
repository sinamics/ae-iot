import { db } from '@/lib/db';
import Link from 'next/link';
import React, { use } from 'react';
import UsersTable from './(components)/userTable';

const fetchUsers = () => {
  return db.user.findMany();
};

const Users = async () => {
  const users = JSON.stringify(await fetchUsers());

  return (
    <div className='container'>
      <div className='flex justify-center text-2xl pt-5'>Users</div>
      <div>
        <Link
          href='/iot/users/adduser'
          className='mt-3 uppercase rounded-l inline-block px-6 py-1.5 border border-gray-400 bg-transparent text-center text-sm  font-medium text-slate-300 hover:border-slate-200 hover:bg-slate-600 focus:z-10 focus:outline-none transition duration-150 ease-in-out'
        >
          Add User
        </Link>
      </div>
      <div>
        <UsersTable users={users} />
      </div>
    </div>
  );
};

export default Users;
