import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Pencil, 
  Trash2, 
  Filter, 
  PlusCircle, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  ArrowUpDown,
  ChevronDown
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';

/**
 * Component for producers to manage their gallery items
 * @param {Object} props Component props
 * @param {Array} props.items Gallery items to manage
 * @param {boolean} props.loading Whether the items are loading
 * @param {Function} props.onEdit Function to call when an item is edited
 * @param {Function} props.onDelete Function to call when an item is deleted
 * @param {Function} props.onCreateNew Function to call when a new item is created
 */
const GalleryManagement = ({ 
  items = [], 
  loading = false,
  onEdit,
  onDelete,
  onCreateNew
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredItems, setFilteredItems] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  
  useEffect(() => {
    // Apply filters
    let results = [...items];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter(item => item.status === statusFilter);
    }
    
    // Sort by date (newest first)
    results.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
    
    setFilteredItems(results);
  }, [items, searchQuery, statusFilter]);
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const confirmDelete = (itemId) => {
    setShowDeleteConfirm(itemId);
  };
  
  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };
  
  const executeDelete = (itemId) => {
    onDelete(itemId);
    setShowDeleteConfirm(null);
  };
  
  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      'approved': { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-3 w-3 mr-1" /> },
      'pending': { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-3 w-3 mr-1" /> },
      'rejected': { color: 'bg-red-100 text-red-800', icon: <AlertTriangle className="h-3 w-3 mr-1" /> }
    };
    
    const config = statusConfig[status] || statusConfig['pending'];
    
    return (
      <Badge variant="outline" className={`flex items-center ${config.color}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="gallery-management">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gallery Management</h1>
        <Button onClick={onCreateNew}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Gallery Item
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Search and Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search gallery items..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
            
            <div className="w-full md:w-48">
              <div className="relative">
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-10 rounded-md border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 pr-8 appearance-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {filteredItems.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No gallery items found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || statusFilter !== 'all' 
              ? 'Try adjusting your search filters or' 
              : 'Get started by'} creating a new gallery item.
          </p>
          <div className="mt-6">
            <Button onClick={onCreateNew}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Gallery Item
            </Button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-sm font-medium text-gray-500 border-b">Image</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 border-b">
                  <div className="flex items-center">
                    Title
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 border-b">Status</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 border-b">Created</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 border-b">Featured</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden border border-gray-200">
                      {item.images && item.images.length > 0 ? (
                        <img 
                          src={item.images[0]} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-200">
                          <span className="text-xs text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">{item.description}</div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(item.dateCreated).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item.featured ? (
                      <Badge className="bg-yellow-500">Featured</Badge>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {showDeleteConfirm === item.id ? (
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => executeDelete(item.id)}
                        >
                          Confirm
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={cancelDelete}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <Link to={`/gallery/${item.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-red-200 hover:bg-red-50 text-red-600"
                          onClick={() => confirmDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;