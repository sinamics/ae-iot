'use client';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import TimeAgo from 'react-timeago';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { IDevice } from '@/lib/types';

type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

const formatter: any = (
  value: any,
  unit: any,
  suffix: any,
  nextFormatter: any
) => {
  return `${value} ${unit}`;
};

const columnHelper = createColumnHelper<IDevice>();

const columns = [
  columnHelper.accessor('friendly_name', {
    header: 'Name',
    // footer: (info) => info.column.id,
  }),
  //   columnHelper.accessor('available', {
  //     cell: (info) => info.getValue(),
  //     // footer: (info) => info.column.id,
  //   }),
  columnHelper.accessor((row) => row.datetime, {
    header: () => 'Lastseen',
    id: 'datetime',
    size: 150,
    cell: (info) => (
      <TimeAgo date={info.getValue()} live={true} formatter={formatter} />
    ),
    // footer: (info) => info.column.id,
  }),
  columnHelper.accessor('electric_price', {
    header: () => 'Electric Price',
    cell: (info) => info.renderValue(),
    // footer: (info) => info.column.id,
  }),
  columnHelper.accessor('electric_time_to_start', {
    header: () => <span>Electric Start Time</span>,
    // footer: (info) => info.column.id,
  }),
  columnHelper.accessor('fuel_price', {
    header: () => 'Fuel Price',
    cell: (info) => info.renderValue(),
    // footer: (info) => info.column.id,
  }),
  columnHelper.accessor('fuel_time_to_start', {
    header: () => <span>Fuel Start Time</span>,
    // footer: (info) => info.column.id,
  }),
  columnHelper.accessor('heater', {
    header: 'heater',
    // footer: (info) => info.column.id,
  }),
  columnHelper.accessor('operational_mode', {
    header: 'Operational Mode',
    // footer: (info) => info.column.id,
  }),
  columnHelper.accessor('system', {
    header: 'System',
    // footer: (info) => info.column.id,
  }),
];

const IotTable = ({ data }: { data: IDevice[] }) => {
  const [tableData, setTableData] = useState(data);

  const socket = useSocket('/api/socketio');
  const router = useRouter();

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // debugTable: true,
    // debugHeaders: true,
    // debugColumns: true,
  });

  useEffect(() => {
    socket?.on('iot_broadcasting', (devices: any) => {
      const msg: IDevice = JSON.parse(devices);

      setTableData((prev: any) => {
        const p = [...prev];
        // check if device exsist in list
        const index: any = p.findIndex(
          (f: any) => f['client_id'] === msg['client_id']
        );
        // update or add
        if (index !== -1) {
          p[index] = msg;
          return p;
        }

        return [...prev, { ...msg }];
      });
      console.log('new socket message', msg);
    });

    return () => {
      socket?.off('iot_broadcasting');
    };
  }, [socket]);

  return (
    <div className='p-2'>
      <table className='w-full'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  {...{
                    style: {
                      width: header.getSize(),
                    },
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className='text-center'>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => router.push(`/iot/${row.original.client_id}`)}
              className='cursor-pointer hover:bg-gray-500'
            >
              {row.getVisibleCells().map((cell: any) => (
                <td className='border border-gray-600 p-2' key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
};

export default IotTable;
