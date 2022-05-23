import React, { useState, useReducer } from 'react';
import PropTypes from 'prop-types';
import { Button, TextField, Stack, Chip, Autocomplete } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { ReactComponent as AttachmentIcon } from 'assets/images/attachment.svg';
import { ReactComponent as SendIcon } from 'assets/images/send.svg';
import { toBase64 } from 'utils';

import './EditableForm.scss';

EditableForm.propTypes = {
  className: PropTypes.string,
  classPrefix: PropTypes.string,
  onInput: PropTypes.func,
  submitHandler: PropTypes.func,
  withAttachment: PropTypes.bool,
  type: PropTypes.string,
};

EditableForm.defaultProps = {
  className: '',
  classPrefix: '',
  onInput: null,
  submitHandler: null,
  withAttachment: false,
  type: 'send',
};

function EditableForm({ submitHandler, type, onInput, className, classPrefix, withAttachment }) {
  const [formData, setFormData] = useReducer(
    (currentValues, newValues) => ({ ...currentValues, ...newValues }),
    {
      text: '',
      attachments: [],
    }
  );

  function onAttachmentChange(event) {
    const files = event.target.files;
    const filesArray = Array.prototype.slice.call(files);
    setFormData({ ['attachments']: [...formData['attachments'], ...filesArray] });
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
          <img src={URL.createObjectURL(file)} />
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
          <video controls src={URL.createObjectURL(file)} />
          <DeleteIcon
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
    event.preventDefault();

    submitHandler(event, {
      text: formData['text'],
      attachments: await Promise.all(
        formData['attachments'].map(async (attachment, index) => {
          const converted = await toBase64(attachment);
          return { value: converted, name: attachment.name };
        })
      ),
    });

    setFormData({
      text: '',
      attachments: [],
    });
  }

  return (
    <form
      onSubmit={(event) => preSubmit(event)}
      className={`editable-form editable-form--${type} ${className} ${
        classPrefix ? `${classPrefix}__form'}` : ''
      }`}>
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
          htmlFor="editorAttachment">
          <AttachmentIcon className={`${classPrefix ? `${classPrefix}__icon` : ''}`} />

          <input
            className={`editable-form__attachment-input ${
              classPrefix ? `${classPrefix}__attachment-input` : ''
            }`}
            type="file"
            id="editorAttachment"
            multiple="multiple"
            onChange={onAttachmentChange}
          />
        </label>
      ) : null}

      {type === 'post' ? (
        <button
          type="submit"
          className={`editable-form__button ${
            classPrefix ? `${classPrefix}__button` : ''
          } button--default`}>
          Publish
        </button>
      ) : (
        <label className="editable-form__button--message" htmlFor="formSubmit">
          <SendIcon
            className={`editable-form__send-icon ${classPrefix ? `${classPrefix}__button` : ''}`}
          />

          <input className="" type="submit" id="formSubmit" />
        </label>
      )}

      {formData.attachments ? (
        <div className="attachments">
          {formData['attachments'].map((attachment, index) => {
            return attachmentPreview(index, attachment, attachment.name, attachment.type);
          })}
        </div>
      ) : null}
    </form>
  );
}

export default EditableForm;
