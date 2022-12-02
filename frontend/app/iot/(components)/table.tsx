'use client';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import TimeAgo from 'react-timeago';
import { useRouter } from 'next/navigation';

type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

type IDevice = {
  available: boolean;
  datetime: string;
  electric_price: number;
  electric_time_to_start: string;
  friendly_name: string;
  fuel_price: number;
  fuel_time_to_start: string;
  heater: string;
  client_id: string;
  operational_mode: string;
  system: string;
  uptime: string;
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
    cell: (info) => <TimeAgo date={info.getValue()} />,
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
];

const IotTable = ({ data }: { data: IDevice[] }) => {
  const router = useRouter();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='p-2'>
      <table className='w-full'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
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
