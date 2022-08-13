import React, { useEffect, useReducer, useState } from 'react';
import { Button, TextField, Stack, Chip, Autocomplete, Slider } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import PropTypes from 'prop-types';

import { ImageCropper, Multiselect } from 'components';

import { validate, capitalizeFirstLetter } from 'utils';

import './Form.scss';

Form.propTypes = {
  className: PropTypes.string,
  prefixClass: PropTypes.string,
  formTemplate: PropTypes.object.isRequired,
  onFormSubmit: PropTypes.func,
  onFormChange: PropTypes.func,
  formFieldsErrors: PropTypes.object,
  formErrors: PropTypes.array,
};

Form.defaultProps = {
  className: '',
  prefixClass: '',
  onFormSubmit: null,
  onFormChange: null,
  formFieldsErrors: null,
  formErrors: null,
};

export default function Form({
  className,
  prefixClass,
  formTemplate,
  onFormSubmit,
  onFormChange,
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

  const [formData, setFormData] = useReducer((currentValues, newValues) => {
    return { ...currentValues, ...newValues };
  }, initialValues);

  const [isValid, setIsValid] = useState(false);
  const [respondErrors, setRespondErrors] = useState(null);

  useEffect(() => {
    setRespondErrors(formErrors);
  }, [formErrors, formFieldsErrors]);

  useEffect(() => {
    onFormChange ? onFormChange(formData) : null;
  }, [formData]);

  useEffect(() => {
    onFormChange ? onFormChange(formData) : null;
    setFormData(initialValues);
  }, [formTemplate]);

  function updateState(name, value) {
    const currentObj = formData[name];
    const newObject = {
      value,
      errors: [],
    };

    if (currentObj.validation) {
      newObject.validation = currentObj.validation;

      if (validate(name, value, formData)) newObject.errors = validate(name, value, formData);
    }

    if (currentObj.repeatFor) newObject.repeatFor = currentObj.repeatFor;

    setFormData({ [name]: newObject });
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
            className={`form__input form__input--cropper ${
              prefixClass
                ? `${prefixClass}--input ${prefixClass}--cropper ${prefixClass}--${field.name}`
                : ''
            }`}
            onChange={(value) => updateState(field.name, value)}
            value={formData[Object.keys(formData)[index]].value}
            defaultSrc={field.defaultSrc}
          />
        );
      case 'range':
        return (
          <div className={`form__range-container ${prefixClass}__range-container`}>
            <TextField
              type="number"
              InputProps={{ inputProps: { min: field.min, max: field.max } }}
              value={formData[Object.keys(formData)[index]].value[0] || field.value[0] || field.min}
              onChange={(event) =>
                updateState(field.name, [
                  Number(event.target.value),
                  formData[Object.keys(formData)[index]].value[1] || field.value[1] || field.max,
                ])
              }
              variant="outlined"
              color="secondary"
              label={`Min ${field.placeholder?.toLowerCase()}`}
              className={`form__input form__input--range-value ${
                prefixClass
                  ? `${prefixClass}--range-value ${prefixClass}--range-min ${prefixClass}--${field.name}-value`
                  : ''
              }`}
            />
            <Slider
              getAriaLabel={() => 'Age range'}
              value={
                formData[Object.keys(formData)[index]].value ||
                field.value || [field.min, field.max]
              }
              onChange={(event, values) => updateState(field.name, values)}
              valueLabelDisplay="auto"
              min={field.min}
              max={field.max}
              className={`form__input form__input--range ${
                prefixClass
                  ? `${prefixClass}--input ${prefixClass}--range ${prefixClass}--${field.name}`
                  : ''
              }`}
            />
            <TextField
              type="number"
              InputProps={{ inputProps: { min: field.min, max: field.max } }}
              value={formData[Object.keys(formData)[index]].value[1] || field.value[1] || field.max}
              onChange={(event) =>
                updateState(field.name, [
                  formData[Object.keys(formData)[index]].value[0] || field.value[0] || field.min,
                  Number(event.target.value),
                ])
              }
              variant="outlined"
              color="secondary"
              label={`Max ${field.placeholder?.toLowerCase()}`}
              className={`form__input form__input--range-value ${
                prefixClass
                  ? `${prefixClass}--range-value ${prefixClass}--range-max ${prefixClass}--${field.name}-value`
                  : ''
              }`}
            />
          </div>
        );
      case 'multi':
        return (
          <Multiselect
            value={formData[Object.keys(formData)[index]].value}
            field={field}
            onChange={(event, values) => updateState(field.name, values)}
            className={`form__input form__input--multi ${
              prefixClass
                ? `${prefixClass}--input ${prefixClass}--multi ${prefixClass}--${field.name}`
                : ''
            }`}
          />
        );
      case 'textarea':
        return (
          <TextField
            multiline
            error={Boolean(formData[Object.keys(formData)[index]].errors.length)}
            id={field.id}
            name={field.name}
            key={`${field.id}-input`}
            required={field.required}
            placeholder={field.placeholder}
            autoComplete={field.autocomplete || 'new-password'}
            onChange={(event) => updateState(event.target.name, event.target.value)}
            value={formData[Object.keys(formData)[index]].value}
            className={`form__input form__input--textarea ${
              prefixClass
                ? `${prefixClass}--input ${prefixClass}--textarea ${prefixClass}--${field.name}`
                : ''
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
            autoComplete={field.autocomplete || 'new-password'}
            onChange={(event) => handleFileUpload(event)}
            className={`form__input form__input--file ${
              prefixClass
                ? `${prefixClass}--input ${prefixClass}--file ${prefixClass}--${field.name}`
                : ''
            }`}
          />
        );
      case 'password':
        return (
          <TextField
            error={Boolean(formData[Object.keys(formData)[index]].errors.length)}
            helperText={formData[Object.keys(formData)[index]].errors}
            id={field.id}
            type={field.type}
            name={field.name}
            variant="outlined"
            color="secondary"
            label={field.placeholder}
            key={`${field.id}-input`}
            required={field.required}
            autoComplete={field.autocomplete || 'new-password'}
            onChange={(event) => updateState(event.target.name, event.target.value)}
            value={formData[Object.keys(formData)[index]].value}
            className={`form__input form__input--password ${
              prefixClass
                ? `${prefixClass}--input ${prefixClass}--password ${prefixClass}--${field.name}`
                : ''
            }`}
          />
        );
      case 'text':
        return (
          <TextField
            error={Boolean(formData[Object.keys(formData)[index]].errors.length)}
            helperText={formData[Object.keys(formData)[index]].errors}
            id={field.id}
            type={field.type}
            name={field.name}
            variant="outlined"
            color="secondary"
            label={field.placeholder}
            key={`${field.id}-input`}
            required={field.required}
            autoComplete={field.autocomplete || 'new-password'}
            onChange={(event) => updateState(event.target.name, event.target.value)}
            value={formData[Object.keys(formData)[index]].value}
            className={`form__input form__input--text ${
              prefixClass
                ? `${prefixClass}--input ${prefixClass}--text ${prefixClass}--${field.name}`
                : ''
            }`}
          />
        );
      case 'email':
        return (
          <TextField
            error={Boolean(formData[Object.keys(formData)[index]].errors.length)}
            helperText={formData[Object.keys(formData)[index]].errors}
            id={field.id}
            type={field.type}
            name={field.name}
            variant="outlined"
            color="secondary"
            label={field.placeholder}
            key={`${field.id}-input`}
            required={field.required}
            autoComplete={field.autocomplete || 'new-password'}
            onChange={(event) => updateState(event.target.name, event.target.value)}
            value={formData[Object.keys(formData)[index]].value}
            className={`form__input form__input--email ${
              prefixClass
                ? `${prefixClass}--input ${prefixClass}--email ${prefixClass}--${field.name}`
                : ''
            }`}
          />
        );
      case 'number':
        return (
          <TextField
            error={Boolean(formData[Object.keys(formData)[index]].errors.length)}
            helperText={formData[Object.keys(formData)[index]].errors}
            id={field.id}
            type={field.type}
            name={field.name}
            variant="outlined"
            color="secondary"
            label={field.placeholder}
            key={`${field.id}-input`}
            required={field.required}
            autoComplete={field.autocomplete || 'new-password'}
            onChange={(event) => updateState(event.target.name, Number(event.target.value))}
            value={formData[Object.keys(formData)[index]].value}
            className={`form__input form__input--number ${
              prefixClass
                ? `${prefixClass}--input ${prefixClass}--number ${prefixClass}--${field.name}`
                : ''
            }`}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          />
        );
      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              className={`form__input form__input--date ${
                prefixClass
                  ? `${prefixClass}--input ${prefixClass}--date ${prefixClass}--${field.name}`
                  : ''
              }`}
              label={field.placeholder}
              value={formData[Object.keys(formData)[index]].value}
              maxDate={new Date()}
              onChange={(value) =>
                updateState(
                  field.name,
                  value.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })
                )
              }
              inputFormat="MM/dd/yyyy"
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        );
      default:
        return (
          <TextField
            error={Boolean(formData[Object.keys(formData)[index]].errors.length)}
            helperText={formData[Object.keys(formData)[index]].errors}
            id={field.id}
            type={field.type}
            name={field.name}
            variant="outlined"
            color="secondary"
            label={field.placeholder}
            key={`${field.id}-input`}
            required={field.required}
            autoComplete={field.autocomplete || 'new-password'}
            onChange={(event) => updateState(event.target.name, event.target.value)}
            value={formData[Object.keys(formData)[index]].value}
            className={`form__input form__input--text ${
              prefixClass ? `${prefixClass}-input ${prefixClass}--${field.name}` : ''
            }`}
          />
        );
    }
  }

  function handlePreSubmit(event, formData) {
    event.persist();
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
        <div
          className={`form__item ${
            prefixClass ? `${prefixClass}-item ${prefixClass}-item--${field.name}` : ''
          }`}
          key={field.id}>
          <label
            className={`form__label ${
              prefixClass ? `${prefixClass}-label  ${prefixClass}-label--${field.name}` : ''
            }`}
            htmlFor={field.name}>
            {renderSwitch(field, index)}
          </label>
        </div>
      ))}

      {respondErrors ? <div className="form__errors"> {respondErrors}</div> : null}

      {formTemplate.button ? (
        <Button
          variant="contained"
          color="primary"
          className={`form__submit button--default ${
            formTemplate.button.className ? formTemplate.button.className : ''
          } ${prefixClass ? `${prefixClass}-button` : ''}`}
          type="submit">
          {formTemplate.button.text || 'Submit'}
        </Button>
      ) : null}
    </form>
  );
}
