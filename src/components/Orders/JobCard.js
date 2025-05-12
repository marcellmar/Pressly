import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Clock, 
  User, 
  Calendar, 
  CheckCircle, 
  Map, 
  Star, 
  ArrowRight,
  FileText,
  Zap
} from 'lucide-react';

const JobCard = ({ job, onAccept }) => {
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Calculate days until deadline
  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const dueDate = new Date(deadline);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Get badge color based on priority
  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'urgent':
        return { color: 'bg-red-100 text-red-800', icon: <Zap className="h-3 w-3 mr-1" /> };
      case 'high':
        return { color: 'bg-orange-100 text-orange-800', icon: <Clock className="h-3 w-3 mr-1" /> };
      case 'medium':
        return { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-3 w-3 mr-1" /> };
      case 'low':
        return { color: 'bg-green-100 text-green-800', icon: <Clock className="h-3 w-3 mr-1" /> };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: <Clock className="h-3 w-3 mr-1" /> };
    }
  };
  
  // Get label for design type
  const getDesignTypeLabel = (type) => {
    const types = {
      'apparel': 'Apparel & Clothing',
      'stationery': 'Stationery & Cards',
      'packaging': 'Packaging',
      'large-format': 'Large Format',
      'menu': 'Menu & Restaurant',
    };
    return types[type] || type;
  };
  
  const priorityBadge = getPriorityBadge(job.priority);
  const daysUntilDeadline = getDaysUntilDeadline(job.deadline);
  const isUrgent = daysUntilDeadline <= 3;
  
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="mb-1">{job.designName}</CardTitle>
            <CardDescription className="flex items-center text-sm">
              <User className="h-3.5 w-3.5 mr-1" />
              {job.designer.name}
            </CardDescription>
          </div>
          <Badge className={`flex items-center ${priorityBadge.color}`}>
            {priorityBadge.icon}
            {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="flex items-center text-sm mb-3">
          <Map className="h-3.5 w-3.5 mr-1 text-gray-500" />
          <span className="text-gray-600 mr-3">{job.designer.location}</span>
          
          <Star className="h-3.5 w-3.5 mr-1 text-yellow-500" />
          <span className="text-gray-600">{job.designer.rating} rating</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 p-2 rounded">
            <div className="text-xs text-gray-500 mb-1">Design Type</div>
            <div className="font-medium">{getDesignTypeLabel(job.designType)}</div>
          </div>
          
          <div className="bg-gray-50 p-2 rounded">
            <div className="text-xs text-gray-500 mb-1">Quantity</div>
            <div className="font-medium">{job.requirements.quantity} units</div>
          </div>
          
          <div className="bg-gray-50 p-2 rounded">
            <div className="text-xs text-gray-500 mb-1">Est. Production</div>
            <div className="font-medium">{job.estimatedHours} hours</div>
          </div>
          
          <div className="bg-gray-50 p-2 rounded">
            <div className="text-xs text-gray-500 mb-1">Match Score</div>
            <div className="font-medium">{job.matchScore}% match</div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="text-sm font-medium mb-1">Requirements</div>
          <div className="text-sm text-gray-600">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-500">Size:</span> {job.requirements.size}
              </div>
              <div>
                <span className="text-gray-500">Colors:</span> {job.requirements.colors}
              </div>
              <div>
                <span className="text-gray-500">Material:</span> {job.requirements.material}
              </div>
            </div>
          </div>
        </div>
        
        {job.requirements.specialInstructions && (
          <div className="mb-4">
            <div className="text-sm font-medium mb-1">Special Instructions</div>
            <div className="text-sm text-gray-600 italic">
              "{job.requirements.specialInstructions}"
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Calendar className={`h-4 w-4 mr-1 ${isUrgent ? 'text-red-500' : 'text-gray-500'}`} />
            <span className={`text-sm ${isUrgent ? 'text-red-500 font-medium' : 'text-gray-600'}`}>
              Due {formatDate(job.deadline)}
              {isUrgent && ` (${daysUntilDeadline} days left)`}
            </span>
          </div>
          
          <div className="text-xs text-gray-500">
            Submitted {formatDate(job.submitted)}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 flex justify-between pt-3">
        <Button
          variant="outline"
          size="sm"
          className="text-gray-600 hover:text-gray-800"
        >
          <FileText className="h-4 w-4 mr-1" />
          View Details
        </Button>
        
        <Button
          size="sm"
          onClick={() => onAccept(job.id)}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Accept Job
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;