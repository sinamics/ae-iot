import { Menu, ActionIcon, Text } from '@mantine/core';
import { IconSearch, IconPhoto, IconMessageCircle, IconTrash, IconArrowsLeftRight, IconSettings  } from '@tabler/icons';
import { useRef, useState } from 'react';

export function Dropdown({onSelect, clientId}:any) {
    const handler = (e:any)=>{
        const operational_mode = e.target.innerHTML.toLowerCase()
        onSelect({operational_mode, clientId})
    }

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target  >
        <ActionIcon variant="light"><IconSettings size={21} /></ActionIcon>
      </Menu.Target>

      <Menu.Dropdown onClick={handler}>
        <Menu.Label>Actionlist</Menu.Label>
        <Menu.Item icon={<IconSettings size={14} />}>Auto</Menu.Item>
        <Menu.Item icon={<IconMessageCircle size={14} />}>Stopp</Menu.Item>
        <Menu.Item icon={<IconPhoto size={14} />}>Electric</Menu.Item>
        <Menu.Item icon={<IconPhoto size={14} />}>Fuel</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}