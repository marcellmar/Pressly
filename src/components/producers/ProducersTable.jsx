import React, { useMemo } from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import { MapPin, Star, Clock, DollarSign, ChevronUp, ChevronDown, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import showToast from '../ui/toast/toast';

/**
 * Enhanced producers table component using react-table
 */
const ProducersTable = ({ producers, onSelectProducer }) => {
  const data = useMemo(() => producers, [producers]);
  
  // Define table columns
  const columns = useMemo(() => [
    {
      Header: 'Producer',
      accessor: 'name',
      Cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            <img 
              src={row.original.imageUrl} 
              alt={row.original.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="flex items-center text-xs text-gray-500">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
              {row.original.rating} ({row.original.reviews})
            </div>
          </div>
        </div>
      ),
    },
    {
      Header: 'Location',
      accessor: 'distance',
      Cell: ({ value, row }) => (
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
          <span>{value} miles</span>
        </div>
      ),
    },
    {
      Header: 'Availability',
      accessor: 'availabilityPercent',
      Cell: ({ value }) => (
        <div className="w-full">
          <div className="flex justify-between text-xs mb-1">
            <span className={value > 50 ? 'text-green-600' : 'text-blue-600'}>
              {value}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${value > 50 ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{ width: `${value}%` }}
            ></div>
          </div>
        </div>
      ),
    },
    {
      Header: 'Turnaround',
      accessor: 'turnaround',
      Cell: ({ value }) => (
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1 text-blue-500" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      Header: 'Price',
      accessor: 'priceLevel',
      Cell: ({ value, row }) => (
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 mr-1 text-green-500" />
          <span>{row.original.priceRange}</span>
        </div>
      ),
    },
    {
      Header: 'Actions',
      id: 'actions',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            onClick={() => onSelectProducer(row.original)}
          >
            View
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => {
              showToast.success(`Quote requested from ${row.original.name}`);
            }}
          >
            Quote
          </Button>
        </div>
      ),
    },
  ], [onSelectProducer]);
  
  // Set up react-table
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    setPageSize,
    gotoPage,
  } = useTable(
    { columns, data, initialState: { pageSize: 5 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  
  const { globalFilter, pageIndex, pageSize } = state;

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:items-center">
          <h3 className="font-medium text-lg">Print Producers</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search producers..."
              value={globalFilter || ''}
              onChange={e => setGlobalFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.render('Header')}</span>
                      <span>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronUp className="h-4 w-4" />
                          )
                        ) : (
                          ''
                        )}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <motion.tr 
                  {...row.getRowProps()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  whileHover={{ backgroundColor: '#f9fafb' }}
                  className="hover:bg-gray-50"
                >
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 whitespace-nowrap"
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="px-4 py-3 border-t border-gray-200 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-700">
          <span>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </span>
          <span>
            | Rows per page: 
            <select
              value={pageSize}
              onChange={e => setPageSize(Number(e.target.value))}
              className="ml-2 border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              {[5, 10, 20].map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </span>
        </div>
        <div className="mt-3 sm:mt-0 flex space-x-2">
          <Button 
            onClick={() => previousPage()} 
            disabled={!canPreviousPage}
            variant="outline"
            size="sm"
          >
            Previous
          </Button>
          <Button 
            onClick={() => nextPage()} 
            disabled={!canNextPage}
            variant="outline"
            size="sm"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProducersTable;
