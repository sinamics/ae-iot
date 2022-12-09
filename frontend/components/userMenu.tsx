'use client';
import { useState } from 'react';
import { Menu } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { IconSettings, IconMessageCircle, IconTrash } from '@tabler/icons';
import { signOut } from 'next-auth/react';

export default function UserMenu({ children }: any) {
  const [opened, setOpened] = useState(false);
  const router = useRouter();
  return (
    <Menu opened={opened} onChange={setOpened} width={'70%'}>
      {/* Menu content */}
      <Menu.Target>{children}</Menu.Target>

      <Menu.Dropdown className='bg-[#2c2e3b]'>
        <Menu.Label>Menu</Menu.Label>
        <Menu.Item
          className='text-white hover:bg-gray-500/95'
          onClick={() => router.push('/iot/user/profile')}
          icon={<IconMessageCircle size={14} />}
        >
          Profile
        </Menu.Item>
        <Menu.Item
          className='text-white hover:bg-gray-500'
          onClick={() => router.push('/iot/users')}
          icon={<IconSettings size={14} />}
        >
          Users
        </Menu.Item>
        <Menu.Divider />

        {/* <Menu.Label>Danger zone</Menu.Label> */}
        <Menu.Item
          className='hover:bg-gray-500'
          onClick={() => signOut({ callbackUrl: '/' })}
          color='red'
          icon={<IconTrash size={14} />}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
