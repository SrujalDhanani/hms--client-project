import React, { useState } from "react";

const ImageUpload = ({ label, onChange, imageFile, required }) => {
  const selectedImage = imageFile;

  return (
    <>
      <div className="dashboard_image_feild mb-4">
        <label>{label}{required && <span style={{color:'red'}}>*</span>}</label>
      </div>
      <div className="image-upload">
        <label htmlFor="upload-input" className="upload-label">
          <img src="/img/uploadimg.png" alt="Static" className="static-image" />
          <br></br>
          {selectedImage ? "Change Image" : "Upload Image"}
        </label>
        <input
          type="file"
          id="upload-input"
          accept="image/*"
          onChange={onChange}
          style={{ display: "none" }}
        />
        {selectedImage && (
          <div className="image-preview">
            <img
              src={`${selectedImage}`}
              alt="Preview"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ImageUpload;
