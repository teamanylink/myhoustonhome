import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageGallery = ({ isOpen, onClose, onSelectImage, allowUpload = true }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isOpen) {
      loadImages();
    }
  }, [isOpen]);

  const loadImages = async () => {
    try {
      setLoading(true);
      
      // Get uploaded images from Vercel Blob (if API exists)
      let uploadedImages = [];
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch('/api/images', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          uploadedImages = data.images || [];
        }
      } catch (error) {
        console.log('No uploaded images found or API not configured');
      }
      
      // Static images that are always available
      const staticImages = [
        // Community Images
        { url: '/images/communities/riverstone.jpg', filename: 'riverstone.jpg', isStatic: true, category: 'community' },
        { url: '/images/communities/brookewater.jpg', filename: 'brookewater.jpg', isStatic: true, category: 'community' },
        { url: '/images/communities/austin-point.jpg', filename: 'austin-point.jpg', isStatic: true, category: 'community' },
        { url: '/images/communities/emberly.jpg', filename: 'emberly.jpg', isStatic: true, category: 'community' },
        { url: '/images/communities/indigo.jpg', filename: 'indigo.jpg', isStatic: true, category: 'community' },
        { url: '/images/communities/stonecreek-estates.jpg', filename: 'stonecreek-estates.jpg', isStatic: true, category: 'community' },
        { url: '/images/communities/default.jpg', filename: 'default.jpg', isStatic: true, category: 'community' },
        
        // Hero/Background Images
        { url: '/images/hero-community-bg.jpg', filename: 'hero-community-bg.jpg', isStatic: true, category: 'background' },
        { url: '/images/houston-hero-bg.jpg', filename: 'houston-hero-bg.jpg', isStatic: true, category: 'background' }
      ];
      
      // Filter images if needed
      let allImages = [...staticImages, ...uploadedImages];
      if (filter !== 'all') {
        allImages = allImages.filter(img => img.category === filter);
      }
      
      setImages(allImages);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(uploadFile);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const files = Array.from(event.dataTransfer.files);
    files.forEach(uploadFile);
  };

  const uploadFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    try {
      setUploading(true);
      
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const token = localStorage.getItem('adminToken');
          const response = await fetch('/api/upload', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              filename: `${Date.now()}-${file.name}`,
              file: reader.result
            })
          });

          const data = await response.json();
          
          if (data.success) {
            loadImages(); // Reload images
          } else {
            alert(data.error || 'Upload failed');
          }
        } catch (error) {
          console.error('Upload error:', error);
          alert('Upload failed');
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploading(false);
    }
  };

  const deleteImage = async (image) => {
    if (image.isStatic) {
      alert('Cannot delete static images');
      return;
    }

    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url: image.url })
      });

      if (response.ok) {
        loadImages(); // Reload images
      } else {
        alert('Failed to delete image');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete image');
    }
  };

  const selectImage = (image) => {
    onSelectImage(image.url);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-separator">
            <div className="flex justify-between items-center">
              <h2 className="text-title-2 font-semibold text-primary">Image Gallery</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-lg"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-6 py-3 border-b border-separator">
            <div className="flex space-x-4">
              <button 
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-md ${filter === 'all' ? 'bg-primary text-white' : 'bg-secondary text-secondary'}`}
              >
                All Images
              </button>
              <button 
                onClick={() => setFilter('community')}
                className={`px-3 py-1 rounded-md ${filter === 'community' ? 'bg-primary text-white' : 'bg-secondary text-secondary'}`}
              >
                Communities
              </button>
              <button 
                onClick={() => setFilter('background')}
                className={`px-3 py-1 rounded-md ${filter === 'background' ? 'bg-primary text-white' : 'bg-secondary text-secondary'}`}
              >
                Backgrounds
              </button>
            </div>
          </div>

          {/* Upload Area */}
          {allowUpload && (
            <div className="p-6 border-b border-separator">
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragOver ? 'border-primary bg-primary bg-opacity-10' : 'border-separator'
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <div className="text-4xl mb-4">📸</div>
                <p className="text-body text-secondary mb-4">
                  Drop images here or click to select
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="btn btn-primary cursor-pointer"
                >
                  {uploading ? 'Uploading...' : 'Select Images'}
                </label>
              </div>
            </div>
          )}

          {/* Image Grid */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="text-large-title mb-4">Loading images...</div>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <motion.div
                    key={`${image.url}-${index}`}
                    className="relative group cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    onClick={() => selectImage(image)}
                  >
                    <img
                      src={image.url}
                      alt={image.filename}
                      className="w-full h-24 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/images/communities/default.jpg';
                      }}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg transition-opacity flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            selectImage(image);
                          }}
                          className="bg-primary text-white p-2 rounded-lg text-sm"
                        >
                          Select
                        </button>
                        {!image.isStatic && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteImage(image);
                            }}
                            className="bg-red-500 text-white p-2 rounded-lg text-sm"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Static badge */}
                    {image.isStatic && (
                      <div className="absolute top-1 right-1 bg-secondary text-tertiary text-xs px-2 py-1 rounded">
                        Static
                      </div>
                    )}
                    
                    {/* Filename */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                      {image.filename}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {images.length === 0 && !loading && (
              <div className="text-center py-8">
                <div className="text-2xl mb-4">📸</div>
                <p className="text-secondary">No images available</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageGallery; 