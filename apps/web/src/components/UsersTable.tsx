import React from 'react';

interface Column {
  key: string;
  header: string;
}

interface Action {
  label: string;
  onClick: (data: any) => void;
}

interface UsersTableProps {
  columns: Column[];
  tableData: Array<any>;
  actions?: Action[];
  children: React.ReactNode;
  tableName: string;
  describe: string;
}

const UsersTable: React.FC<UsersTableProps> = ({ children, columns, tableName, describe, tableData, actions = [] }) => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">{tableName}</h1>
          <p className="mt-2 text-sm text-gray-700">
            {describe}
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          {children}
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.key} scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      {column.header}
                    </th>
                  ))}
                  {actions.length > 0 && (
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Actions</span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tableData.map((data) => (
                  <tr key={data.email}>
                    {columns.map((column) => (
                      <td key={column.key} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                        {data[column.key]}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        {actions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => action.onClick(data)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4 last:mr-0"
                          >
                            {action.label}
                          </button>
                        ))}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;