import React, { useState } from 'react';
import { 
  Upload, 
  PlusCircle, 
  Trash2, 
  AlertTriangle,
  Image,
  Tag
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

/**
 * Component for uploading/creating gallery items
 * @param {Object} props Component props
 * @param {Function} props.onSubmit Function to call when form is submitted
 * @param {Object} props.initialData Initial data for editing
 * @param {Array} props.availableMaterials List of available materials
 * @param {Array} props.availableMethods List of available methods
 */
const GalleryUploader = ({ 
  onSubmit, 
  initialData = null,
  availableMaterials = [],
  availableMethods = []
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    productionDetails: initialData?.productionDetails || '',
    materials: initialData?.materials || [],
    methods: initialData?.methods || [],
    tags: initialData?.tags || [],
    images: initialData?.images || []
  });
  
  const [errors, setErrors] = useState({});
  const [newTag, setNewTag] = useState('');
  const [newMaterial, setNewMaterial] = useState('');
  const [newMethod, setNewMethod] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // In a real app, we would upload files to a server
    // For the MVP, we'll create object URLs for preview
    const newFiles = files.map(file => ({
      id: Math.random().toString(36).substring(2),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      file: file // Store the actual file for future upload
    }));
    
    setUploadedFiles([...uploadedFiles, ...newFiles]);
    
    // Update formData with new image URLs
    setFormData({
      ...formData,
      images: [...formData.images, ...newFiles.map(f => f.url)]
    });
  };
  
  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    
    const newFiles = [...uploadedFiles];
    
    // If this was an uploaded file, remove it from uploadedFiles
    if (index < uploadedFiles.length) {
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(uploadedFiles[index].url);
      newFiles.splice(index, 1);
      setUploadedFiles(newFiles);
    }
    
    setFormData({
      ...formData,
      images: newImages
    });
  };
  
  const addTag = () => {
    if (!newTag.trim()) return;
    
    if (!formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
    }
    
    setNewTag('');
  };
  
  const removeTag = (index) => {
    const newTags = [...formData.tags];
    newTags.splice(index, 1);
    
    setFormData({
      ...formData,
      tags: newTags
    });
  };
  
  const addMaterial = () => {
    if (!newMaterial.trim()) return;
    
    if (!formData.materials.includes(newMaterial.trim())) {
      setFormData({
        ...formData,
        materials: [...formData.materials, newMaterial.trim()]
      });
    }
    
    setNewMaterial('');
  };
  
  const removeMaterial = (index) => {
    const newMaterials = [...formData.materials];
    newMaterials.splice(index, 1);
    
    setFormData({
      ...formData,
      materials: newMaterials
    });
  };
  
  const addMethod = () => {
    if (!newMethod.trim()) return;
    
    if (!formData.methods.includes(newMethod.trim())) {
      setFormData({
        ...formData,
        methods: [...formData.methods, newMethod.trim()]
      });
    }
    
    setNewMethod('');
  };
  
  const removeMethod = (index) => {
    const newMethods = [...formData.methods];
    newMethods.splice(index, 1);
    
    setFormData({
      ...formData,
      methods: newMethods
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }
    
    if (formData.materials.length === 0) {
      newErrors.materials = 'At least one material is required';
    }
    
    if (formData.methods.length === 0) {
      newErrors.methods = 'At least one method is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // In a real app, we would upload the files here
    // For now, we'll just pass the form data to the parent component
    onSubmit(formData);
  };
  
  const selectExistingMaterial = (material) => {
    if (!formData.materials.includes(material)) {
      setFormData({
        ...formData,
        materials: [...formData.materials, material]
      });
    }
  };
  
  const selectExistingMethod = (method) => {
    if (!formData.methods.includes(method)) {
      setFormData({
        ...formData,
        methods: [...formData.methods, method]
      });
    }
  };
  
  return (
    <div className="gallery-uploader">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Basic Information</h3>
              
              <div className="mb-4">
                <Label htmlFor="title" className="mb-1 block">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Corporate Brochure Series"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>
              
              <div className="mb-4">
                <Label htmlFor="description" className="mb-1 block">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your gallery item in detail..."
                  rows={4}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="productionDetails" className="mb-1 block">
                  Production Details
                </Label>
                <Textarea
                  id="productionDetails"
                  name="productionDetails"
                  value={formData.productionDetails}
                  onChange={handleInputChange}
                  placeholder="Describe the production process, techniques, or specifications..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Images */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Images</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {formData.images.map((image, index) => (
                  <div 
                    key={index} 
                    className="relative h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
                  >
                    <img 
                      src={image} 
                      alt={`Gallery image ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      onClick={() => removeImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                <label className="h-40 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 text-center">
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              
              {errors.images && (
                <div className="bg-red-50 p-3 rounded-lg flex items-center text-red-700 mb-4">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <p className="text-sm">{errors.images}</p>
                </div>
              )}
              
              <p className="text-sm text-gray-500">
                <Image className="h-4 w-4 inline-block mr-1" />
                Upload at least one image of your gallery item. First image will be used as the main image.
              </p>
            </CardContent>
          </Card>
          
          {/* Materials and Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Materials */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Materials Used</h3>
                
                <div className="mb-4">
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newMaterial}
                      onChange={(e) => setNewMaterial(e.target.value)}
                      placeholder="Add a new material..."
                      className="flex-grow"
                    />
                    <Button 
                      type="button" 
                      onClick={addMaterial}
                      disabled={!newMaterial.trim()}
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  {availableMaterials.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-2">Or select from common materials:</p>
                      <div className="flex flex-wrap gap-2">
                        {availableMaterials
                          .filter(material => !formData.materials.includes(material))
                          .map((material, index) => (
                            <Button
                              key={index}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => selectExistingMaterial(material)}
                            >
                              {material}
                            </Button>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  {formData.materials.length > 0 ? (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium mb-2">Selected Materials:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.materials.map((material, index) => (
                          <div 
                            key={index}
                            className="bg-white px-3 py-1 rounded-full border border-gray-200 flex items-center"
                          >
                            <span className="text-sm">{material}</span>
                            <button
                              type="button"
                              className="ml-1 text-gray-400 hover:text-red-500"
                              onClick={() => removeMaterial(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 p-3 rounded-lg flex items-center">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                      <p className="text-sm text-yellow-700">Add at least one material</p>
                    </div>
                  )}
                  
                  {errors.materials && (
                    <p className="text-red-500 text-sm mt-1">{errors.materials}</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Methods */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Production Methods</h3>
                
                <div className="mb-4">
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newMethod}
                      onChange={(e) => setNewMethod(e.target.value)}
                      placeholder="Add a new method..."
                      className="flex-grow"
                    />
                    <Button 
                      type="button" 
                      onClick={addMethod}
                      disabled={!newMethod.trim()}
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  {availableMethods.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-2">Or select from common methods:</p>
                      <div className="flex flex-wrap gap-2">
                        {availableMethods
                          .filter(method => !formData.methods.includes(method))
                          .map((method, index) => (
                            <Button
                              key={index}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => selectExistingMethod(method)}
                            >
                              {method}
                            </Button>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  {formData.methods.length > 0 ? (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium mb-2">Selected Methods:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.methods.map((method, index) => (
                          <div 
                            key={index}
                            className="bg-white px-3 py-1 rounded-full border border-gray-200 flex items-center"
                          >
                            <span className="text-sm">{method}</span>
                            <button
                              type="button"
                              className="ml-1 text-gray-400 hover:text-red-500"
                              onClick={() => removeMethod(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 p-3 rounded-lg flex items-center">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                      <p className="text-sm text-yellow-700">Add at least one method</p>
                    </div>
                  )}
                  
                  {errors.methods && (
                    <p className="text-red-500 text-sm mt-1">{errors.methods}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Tags */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Tags</h3>
              
              <div className="mb-4">
                <div className="flex gap-2 mb-4">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    className="flex-grow"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={addTag}
                    disabled={!newTag.trim()}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                
                {formData.tags.length > 0 ? (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <div 
                          key={index}
                          className="bg-white px-3 py-1 rounded-full border border-gray-200 flex items-center"
                        >
                          <Tag className="h-3 w-3 mr-1 text-gray-500" />
                          <span className="text-sm">{tag}</span>
                          <button
                            type="button"
                            className="ml-1 text-gray-400 hover:text-red-500"
                            onClick={() => removeTag(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Add tags to help users discover your gallery item.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Submit */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              size="lg" 
              className="px-8"
            >
              {initialData ? 'Update Gallery Item' : 'Create Gallery Item'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default GalleryUploader;