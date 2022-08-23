import React, { useState, useReducer } from 'react';
import PropTypes from 'prop-types';
import { Button, TextField, Stack, Chip, Autocomplete } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { ReactComponent as AttachmentIcon } from 'assets/images/attachment.svg';
import { ReactComponent as SendIcon } from 'assets/images/send.svg';
import { toBase64 } from 'utils';

import './EditableForm.scss';
import { useRef } from 'react';
import { Preloader } from 'components';

EditableForm.propTypes = {
  className: PropTypes.string,
  classPrefix: PropTypes.string,
  onInput: PropTypes.func,
  submitHandler: PropTypes.func,
  withAttachment: PropTypes.bool,
  type: PropTypes.string,
  initialState: PropTypes.object,
  id: PropTypes.string,
  onSuccess: PropTypes.func,
};

EditableForm.defaultProps = {
  className: '',
  classPrefix: '',
  onInput: null,
  submitHandler: null,
  withAttachment: false,
  type: 'send',
};

function EditableForm({
  submitHandler,
  type,
  onInput,
  className,
  classPrefix,
  withAttachment,
  initialState = { text: '', attachments: [] },
  id,
  onSuccess,
}) {
  const [formData, setFormData] = useReducer(
    (currentValues, newValues) => ({ ...currentValues, ...newValues }),
    {
      ...initialState,
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef();

  function onAttachmentChange({ target: { files } }) {
    const filesArray = Array.prototype.slice.call(files);
    const newFiles = filesArray.filter((file) => {
      let isEqual = false;

      formData['attachments'].forEach((formFile) => {
        if (
          file.name === formFile.name &&
          file.lastModified === formFile.lastModified &&
          file.size === formFile.size &&
          file.type === formFile.type
        )
          isEqual = true;
      });

      return !isEqual && file;
    });

    setFormData({ ['attachments']: [...formData['attachments'], ...newFiles] });
  }

  function removeAttachment(index, event, file, name) {
    const files = formData['attachments'];
    files.splice(index, 1);
    setFormData({ ['attachments']: files });
  }

  function attachmentPreview(index, file, name, type) {
    if (type.includes('image')) {
      return (
        <div className="attachments__item attachment" key={name}>
          <img src={file.url || URL.createObjectURL(file)} />
          <DeleteIcon
            onClick={(event) => removeAttachment(index, event, file, name)}
            className="attachment__delete"
          />
        </div>
      );
    }

    if (type.includes('video')) {
      return (
        <div className="attachments__item attachment" key={name}>
          <video controls src={file.url || URL.createObjectURL(file)} />
          <DeleteIcon
            onClick={(event) => removeAttachment(index, event, file, name)}
            className="attachment__delete"
          />
        </div>
      );
    }

    if (type.includes('audio')) {
      return (
        <div className="attachments__item attachment" key={name}>
          <audio controls src={file.url || URL.createObjectURL(file)} />
          <DeleteIcon
            color="primary"
            onClick={(event) => removeAttachment(index, event, file, name)}
            className="attachment__delete"
          />
        </div>
      );
    }

    return (
      <div className="attachments__item attachment" key={name}>
        <span>{name}</span>
        <DeleteIcon
          onClick={(event) => removeAttachment(index, event, file, name)}
          className="attachment__delete"
        />
      </div>
    );
  }

  async function preSubmit(event) {
    try {
      event.preventDefault();

      if (!formData.text.length && !formData.attachments.length) return;

      setIsLoading(() => true);
      const sendedData = {
        text: formData['text'],
        attachments: await Promise.all(
          formData['attachments'].map(async (attachment, index) => {
            const converted = attachment.url || (await toBase64(attachment));
            const type = attachment.type.includes('audio')
              ? 'audio'
              : attachment.type.includes('video')
              ? 'video'
              : attachment.type.includes('image')
              ? 'image'
              : 'file';
            return { value: converted, name: attachment.name, type, url: attachment.url };
          })
        ),
      };

      const response = await submitHandler(event, sendedData);
      onSuccess(event, response);

      if (inputRef.current) {
        inputRef.current.value = null;
        inputRef.current.files = null;
      }
      setFormData(initialState);
      setIsLoading(() => false);
    } catch (error) {
      console.error(error);
      setIsLoading(() => false);
    }
  }

  return (
    <>
      {isLoading ? (
        <Preloader isLoading />
      ) : (
        <form
          onSubmit={(event) => preSubmit(event)}
          className={`editable-form editable-form--${type} ${className} ${
            classPrefix ? `${classPrefix}__form'}` : ''
          }`}
          id={`form${id ? `-${id}` : ''}`}>
          <TextField
            onInput={(event) => setFormData({ ['text']: event.target.value })}
            value={formData.text}
            multiline
            maxRows={8}
            className={`editable-form__text  ${
              classPrefix ? `${classPrefix}__text` : ''
            } custom-scrollbar`}
          />
          {withAttachment ? (
            <label
              className={`editable-form__attachment-label ${
                classPrefix ? `${classPrefix}__attachment-label` : ''
              }`}
              htmlFor={`editorAttachment${id ? `-${id}` : ''}`}>
              <AttachmentIcon className={`${classPrefix ? `${classPrefix}__icon` : ''}`} />

              <input
                className={`editable-form__attachment-input ${
                  classPrefix ? `${classPrefix}__attachment-input` : ''
                }`}
                type="file"
                ref={inputRef}
                id={`editorAttachment${id ? `-${id}` : ''}`}
                multiple="multiple"
                onChange={onAttachmentChange}
              />
            </label>
          ) : null}

          <label
            className="editable-form__button--message"
            htmlFor={`formSubmit${id ? `-${id}` : ''}`}>
            <SendIcon
              className={`editable-form__send-icon ${classPrefix ? `${classPrefix}__button` : ''}`}
            />

            <input className="" type="submit" id={`formSubmit${id ? `-${id}` : ''}`} />
          </label>

          {formData.attachments ? (
            <div className="attachments">
              {formData['attachments'].map((attachment, index) => {
                return attachmentPreview(index, attachment, attachment.name, attachment.type);
              })}
            </div>
          ) : null}
        </form>
      )}
    </>
  );
}

export default EditableForm;
