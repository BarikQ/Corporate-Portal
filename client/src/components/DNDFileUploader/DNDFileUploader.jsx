import React, { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import PropTypes from 'prop-types';

import './DNDFileUploader.scss';

DNDFileUploader.propTypes = {
  className: PropTypes.string,
  fileTypes: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};

DNDFileUploader.defaultProps = {
  className: '',
  fileTypes: [],
};

export default function DNDFileUploader({ fileTypes, onChange, className, ...props }) {
  const [file, setFile] = useState(null);

  return (
    <FileUploader
      classes={`dnd-file-uploader ${className}`}
      handleChange={(file) => {
        setFile(file);
        onChange(file);
      }}
      name="file"
      types={fileTypes}
    />
  );
}
