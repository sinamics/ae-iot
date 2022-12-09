'use client';
import { useState } from 'react';
import { Button, Menu, Text } from '@mantine/core';
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

      <Menu.Dropdown>
        <Menu.Label>Menu</Menu.Label>
        <Menu.Item
          onClick={() => router.push('/iot/user/profile')}
          icon={<IconMessageCircle size={14} />}
        >
          Profile
        </Menu.Item>
        <Menu.Item
          onClick={() => router.push('/iot/users')}
          icon={<IconSettings size={14} />}
        >
          Users
        </Menu.Item>
        <Menu.Divider />

        {/* <Menu.Label>Danger zone</Menu.Label> */}
        <Menu.Item
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
