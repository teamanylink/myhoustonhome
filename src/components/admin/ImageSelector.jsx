import React, { useState } from 'react';
import ImageGallery from './ImageGallery';

const ImageSelector = ({ value, onChange, label = "Image" }) => {
  const [showGallery, setShowGallery] = useState(false);

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      
      <div className="flex gap-3">
        <input
          type="url"
          className="form-input flex-1"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter image URL or use gallery"
        />
        <button
          type="button"
          onClick={() => setShowGallery(true)}
          className="btn btn-secondary"
        >
          📸 Gallery
        </button>
      </div>

      {/* Image Preview */}
      {value && (
        <div className="mt-3">
          <img
            src={value}
            alt="Preview"
            className="w-32 h-24 object-cover rounded-lg border border-separator"
            onError={(e) => {
              e.target.src = '/images/communities/default.jpg';
            }}
          />
        </div>
      )}

      <ImageGallery
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        onSelectImage={(url) => onChange(url)}
        allowUpload={true}
      />
    </div>
  );
};

export default ImageSelector; 