import React, { useState } from "react";
import { Link } from "react-router-dom";

const DocumentUpload = ({ label, onChange, documentFile, required, fileName }) => {
  const selectedDocument = documentFile;
  console.log(fileName)
  return (
    <>
      <div className="dashboard_image_feild mb-4">
        <label>{label}{required && <span style={{color:'red'}}>*</span>}</label>
      </div>
      <div className="image-upload">
        <label htmlFor="upload-input" className="upload-label">
          <img src="/img/uploadimg.png" alt="Static" className="static-image" />
          <br></br>
          {selectedDocument ? "Change Document" : "Upload Document"}
        </label>
        <input
          type="file"
          id="upload-input"
          accept="image/*, application/pdf" 
          onChange={onChange}
          style={{ display: "none" }}
        />
        {selectedDocument && (
          <div className="image-upload">
            <Link to={documentFile} target="_blank" className="document">Uploaded File</Link>
          </div>
        )}
      </div>
    </>
  );
};

export default DocumentUpload;
