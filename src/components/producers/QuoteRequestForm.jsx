import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import showToast from '../ui/toast/toast';

/**
 * Enhanced quote request form using react-hook-form for validation
 */
const QuoteRequestForm = ({ producer, onRequestSubmit }) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      projectDetails: '',
      quantity: '',
      timeline: 'standard',
      contactPreference: 'email'
    }
  });

  const onSubmit = (data) => {
    // Show loading toast
    const loadingToastId = showToast.loading('Sending quote request...');
    
    // Simulate API call
    setTimeout(() => {
      // Dismiss loading toast
      showToast.dismiss(loadingToastId);
      
      // Show success toast
      showToast.success('Quote request sent successfully!');
      
      // Call parent handler if provided
      if (onRequestSubmit) {
        onRequestSubmit(data);
      }
      
      // Reset form
      reset();
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project Details
        </label>
        <textarea
          {...register('projectDetails', { 
            required: 'Project details are required',
            minLength: {
              value: 10,
              message: 'Please provide at least 10 characters'
            }
          })}
          rows={4}
          className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe your project, including colors, and any special requirements..."
        ></textarea>
        {errors.projectDetails && (
          <p className="mt-1 text-sm text-red-600">{errors.projectDetails.message}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quantity
        </label>
        <input
          type="number"
          {...register('quantity', { 
            required: 'Quantity is required',
            min: {
              value: 1,
              message: 'Quantity must be at least 1'
            }
          })}
          className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Number of items"
        />
        {errors.quantity && (
          <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Timeline
        </label>
        <select
          {...register('timeline')}
          className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="standard">Standard ({producer?.turnaround || '5-7 business days'})</option>
          <option value="rush">Rush (additional fees apply)</option>
          <option value="flexible">Flexible (may receive discount)</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Preferred Contact Method
        </label>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="contactEmail"
              value="email"
              {...register('contactPreference')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="contactEmail" className="ml-2 text-sm text-gray-700">
              Email
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="contactPhone"
              value="phone"
              {...register('contactPreference')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="contactPhone" className="ml-2 text-sm text-gray-700">
              Phone
            </label>
          </div>
        </div>
      </div>
      
      <Button type="submit" className="w-full">
        Submit Request
      </Button>
    </form>
  );
};

export default QuoteRequestForm;
