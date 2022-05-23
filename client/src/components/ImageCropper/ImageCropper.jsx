import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Cropper from 'react-cropper';

import { DNDFileUploader } from 'components';

import 'cropperjs/dist/cropper.css';

import NotFoundImage from 'assets/images/not-found.jpg';

import './ImageCropper.scss';

ImageCropper.propTypes = {
  className: PropTypes.string,
  defaultSrc: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

ImageCropper.defaultProps = {
  className: '',
  value: '',
  defaultSrc: NotFoundImage,
};

const fileTypes = ['JPG', 'PNG', 'JPEG', 'GIF'];

export default function ImageCropper({ value, defaultSrc, onChange, className, ...props }) {
  const [image, setImage] = useState(value || defaultSrc);
  const [cropData, setCropData] = useState(null);
  const [cropper, setCropper] = useState();

  function cropOnCropperChange(event) {
    if (typeof event.target.cropper !== 'undefined') {
      setCropData(event.target.cropper.getCroppedCanvas().toDataURL());
      onChange(event.target.cropper.getCroppedCanvas().toDataURL());
    }
  }

  function getCropData() {
    if (typeof cropper !== 'undefined') {
      setCropData(cropper.getCroppedCanvas().toDataURL());
      onChange(cropper.getCroppedCanvas().toDataURL());
    }
  }

  function resetImage(event) {
    setImage(defaultSrc);
  }

  function onCropperChange(file) {
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  }

  return (
    <div className="image-cropper">
      <DNDFileUploader
        className="image-cropper__uploader"
        onChange={onCropperChange}
        fileTypes={fileTypes}
      />

      <Cropper
        style={{ height: 400, width: '100%' }}
        zoomTo={0.5}
        initialAspectRatio={1}
        src={image}
        preview="#imgPreview"
        viewMode={1}
        minCropBoxHeight={10}
        minCropBoxWidth={10}
        background={false}
        responsive={true}
        autoCropArea={1}
        checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
        cropend={cropOnCropperChange}
        zoom={cropOnCropperChange}
        onInitialized={(instance) => {
          setCropper(instance);
        }}
        guides={true}
      />

      <div className="image-cropper__controls">
        <div className="image-cropper__buttons">
          <button
            className="button--default image-cropper__button"
            type="button"
            onClick={getCropData}>
            Use this image
          </button>

          <button
            className="button--default image-cropper__button"
            type="button"
            onClick={resetImage}>
            Set default image
          </button>
        </div>

        <div className="image-cropper__previews">
          <div className="image-cropper__box cropped-image">
            <h3 className="cropped-image__title">Preview</h3>
            <div className="cropped-image__previews">
              <div id="imgPreview" />
              <div className="cropped-image__preview">
                <img src={cropData} />
              </div>
              <div className="cropped-image__preview cropped-image__preview--medium">
                <img src={cropData} />
              </div>
              <div className="cropped-image__preview cropped-image__preview--small">
                <img src={cropData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
