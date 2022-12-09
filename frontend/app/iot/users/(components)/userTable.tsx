'use client';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import TimeAgo from 'react-timeago';
// import { useRouter } from 'next/navigation';
import { IUsers } from '@/lib/types';

const columnHelper = createColumnHelper<IUsers>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    // footer: (info) => info.column.id,
  }),
  columnHelper.accessor('email', {
    header: () => <span>Email</span>,
    // footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.createdAt, {
    header: () => 'Created',
    id: 'createdAt',
    size: 150,
    cell: (date) => <TimeAgo date={date.getValue()} live={true} />,
  }),
];

const UsersTable = ({ users }: { users: any }) => {
  //   const router = useRouter();

  const table = useReactTable({
    data: JSON.parse(users),
    columns,
    getCoreRowModel: getCoreRowModel(),
    // debugTable: true,
    // debugHeaders: true,
    // debugColumns: true,
  });

  return (
    <div className='pt-5'>
      <table className='w-full table-auto'>
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
              //   onClick={() => router.push(`/iot/${row.original.client_id}`)}
              className='cursor-pointer hover:bg-gray-500'
            >
              {row.getVisibleCells().map((cell: any) => (
                <td className='border border-gray-600 p-1' key={cell.id}>
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

export default UsersTable;
