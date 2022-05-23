import React, { useEffect, useReducer, useState } from 'react';
import { Button, TextField, Stack, Chip, Autocomplete } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import PropTypes from 'prop-types';

import { ImageCropper } from 'components';

import { validate } from 'utils';

import './Form.scss';

Form.propTypes = {
  className: PropTypes.string,
  prefixClass: PropTypes.string,
  formTemplate: PropTypes.object.isRequired,
  onFormSubmit: PropTypes.func,
  formFieldsErrors: PropTypes.object,
  formErrors: PropTypes.array,
};

Form.defaultProps = {
  className: '',
  prefixClass: '',
  onFormSubmit: null,
  formFieldsErrors: null,
  formErrors: null,
};

export default function Form({
  className,
  prefixClass,
  formTemplate,
  onFormSubmit,
  formFieldsErrors,
  formErrors,
  ...props
}) {
  const initialValues = formTemplate.fields.reduce((obj, item) => {
    const { name } = item;
    const newObj = {
      value: item.value ? item.value : '',
      errors: [],
    };

    if (item.validation) {
      newObj.validation = item.validation;
    }

    if (item.repeatFor) newObj.repeatFor = item.repeatFor;

    return {
      ...obj,
      [name]: newObj,
    };
  }, {});

  const [formData, setFormData] = useReducer(
    (currentValues, newValues) => ({ ...currentValues, ...newValues }),
    initialValues
  );

  const [isValid, setIsValid] = useState(false);
  const [respondErrors, setRespondErrors] = useState(null);

  useEffect(() => {
    setRespondErrors(formErrors);
  }, [formErrors, formFieldsErrors]);

  function updateState(name, value) {
    const currentObj = formData[name];
    const newObject = {
      value: typeof value === 'string' ? value.trim() : value,
      errors: [],
    };

    if (currentObj.validation) {
      newObject.validation = currentObj.validation;

      if (validate(name, value, formData)) newObject.errors = validate(name, value, formData);
    }

    if (currentObj.repeatFor) newObject.repeatFor = currentObj.repeatFor;

    setFormData({ [name]: newObject });
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    updateState(name, value);
  }

  function handleFileUpload(event) {
    const { name } = event.target;
    const value = event.target.files[0];

    updateState(name, value);
  }

  function renderSwitch(field, index) {
    switch (field.type) {
      case 'cropper':
        return (
          <ImageCropper
            className={prefixClass ? prefixClass + '-cropper' : ''}
            onChange={(value) => updateState(field.name, value)}
          />
        );
      case 'multi':
        return (
          <Autocomplete
            multiple
            freeSolo
            id={field.id}
            key={`${field.id}-input`}
            options={field.options.map((option) => option)}
            required={field.required}
            name={field.name}
            className={`multiselect ${prefixClass ? prefixClass + '-input' : ''} ${
              prefixClass ? prefixClass + '__multiselect' : ''
            }`}
            onChange={(event, values) => updateState(field.name, values)}
            getOptionLabel={(option) => option}
            filterSelectedOptions
            renderTags={(value, getTagProps) => {
              return value.map((option, index) => (
                <Chip label={option} key={option} {...getTagProps({ index })} />
              ));
            }}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  label={field.placeholder}
                  placeholder={field.multiPlaceholder}
                />
              );
            }}
          />
        );
      case 'textarea':
        return (
          <TextField
            multiline
            error={formData[Object.keys(formData)[index]].errors.length > 0}
            id={field.id}
            name={field.name}
            key={`${field.id}-input`}
            required={field.required}
            placeholder={field.placeholder}
            autoComplete={field.autocomplete || 'off'}
            onChange={(event) => handleInputChange(event)}
            value={formData[Object.keys(formData)[index]].value}
            className={`form__input form__input--textarea ${
              prefixClass ? prefixClass + '__input' : ''
            }`}
          />
        );
      case 'file':
        return (
          <input
            type="file"
            id={field.id}
            name={field.name}
            key={`${field.id}-input`}
            required={field.required}
            placeholder={field.placeholder}
            autoComplete={field.autocomplete || 'off'}
            onChange={(event) => handleFileUpload(event)}
            className={`form__input form__input--file ${prefixClass ? prefixClass + '_input' : ''}`}
          />
        );
      case 'text' || 'email':
        return (
          <TextField
            error={formData[Object.keys(formData)[index]].errors.length > 0}
            helperText={formData[Object.keys(formData)[index]].errors}
            id={field.id}
            type={field.type}
            name={field.name}
            variant="outlined"
            color="secondary"
            label={field.placeholder}
            key={`${field.id}-input`}
            required={field.required}
            autoComplete={field.autocomplete || 'off'}
            onChange={(event) => handleInputChange(event)}
            value={formData[Object.keys(formData)[index]].value}
            className={`form__input form__input--text   ${
              prefixClass ? prefixClass + '-input' : ''
            }`}
          />
        );
      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              className={className}
              label={field.placeholder}
              value={formData[Object.keys(formData)[index]].value}
              maxDate={new Date()}
              onChange={(value) => updateState(field.name, value)}
              inputFormat="MM/dd/yyyy"
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        );
      default:
        return (
          <TextField
            error={formData[Object.keys(formData)[index]].errors.length > 0}
            id={field.id}
            type={field.type}
            name={field.name}
            variant="outlined"
            color="secondary"
            label={field.placeholder}
            key={`${field.id}-input`}
            required={field.required}
            autoComplete={field.autocomplete || 'off'}
            onChange={(event) => handleInputChange(event)}
            value={formData[Object.keys(formData)[index]].value}
            className={`form__input  ${prefixClass ? prefixClass + '-input' : ''}`}
          />
        );
    }
  }

  function handlePreSubmit(event, formData) {
    event.preventDefault();

    const newObj = {};
    let isFormValid = true;

    Object.assign(newObj, formData);

    Object.keys(formData).forEach((key) => {
      if (formData[key].validation) {
        newObj[key].errors = validate(key, formData[key].value, formData);
      }

      if (isFormValid) {
        isFormValid = newObj[key].errors.length === 0;
      }
    });

    setFormData(newObj);

    onFormSubmit(event, formData);
  }

  return (
    <form className={`form ${className}`} onSubmit={(event) => handlePreSubmit(event, formData)}>
      {formTemplate.fields.map((field, index) => (
        <div className={`form__item ${prefixClass ? prefixClass + '-item' : ''}`} key={field.id}>
          <label
            className={`form__label ${prefixClass ? prefixClass + '-label' : ''}`}
            htmlFor={field.name}>
            {renderSwitch(field, index)}
          </label>

          {formData[Object.keys(formData)[index]].errors.length > 0 ? (
            <div key={`${field.id}-errors`} className="form__input-errors">
              {formData[Object.keys(formData)[index]].errors?.map((error) => {
                return (
                  <span className="form__input-error" key={`${field.id}-${formData[index]}-error`}>
                    {error}
                  </span>
                );
              })}
            </div>
          ) : null}
        </div>
      ))}

      {respondErrors ? <div className="form__errors"> {respondErrors}</div> : null}

      <Button
        variant="contained"
        color="primary"
        className={`form__submit button--default ${
          formTemplate.button.className ? formTemplate.button.className : ''
        } ${prefixClass ? prefixClass + '-button' : ''}`}
        type="submit">
        {formTemplate.button.text || 'Submit'}
      </Button>
    </form>
  );
}
