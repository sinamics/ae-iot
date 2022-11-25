import { Menu, ActionIcon } from '@mantine/core';
import {
  IconPlugConnected,
  IconSettings,
  IconAlertTriangle,
  IconGasStation,
  IconPlayerPlay,
} from '@tabler/icons';

export function Dropdown({ onSelect, client_id }: any) {
  const handler = (e: any) => {
    const operational_mode = e.target.innerHTML.toLowerCase();
    onSelect({ operational_mode, client_id });
  };

  return (
    <Menu shadow='md' width={200}>
      <Menu.Target>
        <ActionIcon variant='light'>
          <IconSettings size={21} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown onClick={handler}>
        <Menu.Label>Actionlist</Menu.Label>
        <Menu.Item icon={<IconPlayerPlay size={14} />}>Auto</Menu.Item>
        <Menu.Item icon={<IconAlertTriangle size={14} />}>Stopp</Menu.Item>
        <Menu.Item icon={<IconPlugConnected size={14} />}>Electric</Menu.Item>
        <Menu.Item icon={<IconGasStation size={14} />}>Fuel</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
