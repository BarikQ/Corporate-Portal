import React, { useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';

import { validate } from 'utils';

import './Form.scss';

Form.propTypes = {
  className: PropTypes.string,
  formTemplate: PropTypes.object.isRequired,
  handleFormSubmit: PropTypes.func,
  formFieldsErrors: PropTypes.object,
  formErrors: PropTypes.array,
};

Form.defaultProps = {
  className: '',
  handleFormSubmit: null,
  formFieldsErrors: null,
  formErrors: [],
};

export default function Form({
  className,
  formTemplate,
  handleFormSubmit,
  formFieldsErrors,
  formErrors,
  ...props
}) {
  const initialValues = formTemplate.fields.reduce((obj, item) => {
    const { name } = item;
    const newObj = {
      value: '',
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
  const [respondErrors, setRespondErrors] = useState(formErrors);

  useEffect(() => {
    setRespondErrors(formErrors);
  }, [formErrors, formFieldsErrors]);

  function handleInputChange(event) {
    const { name, value } = event.target;
    const currentObj = formData[name];
    const newObj = {
      value: value.trim(),
      errors: [],
    };

    if (currentObj.validation) {
      newObj.validation = currentObj.validation;

      if (validate(name, value, formData)) newObj.errors = validate(name, value, formData);
    }

    if (currentObj.repeatFor) newObj.repeatFor = currentObj.repeatFor;

    if (newObj.errors.length > 0) setIsValid(false);
    else setIsValid(true);

    setFormData({ [name]: newObj });
  }

  function handleFileUpload(event) {
    const { name } = event.target;
    const value = event.target.files[0];
    const currentObj = formData[name];
    const newObj = {
      value,
      errors: [],
    };

    if (currentObj.repeatFor) newObj.repeatFor = currentObj.repeatFor;

    if (currentObj.validation) {
      newObj.validation = currentObj.validation;

      if (validate(name, value, formData)) newObj.errors = validate(name, value, formData);
    }

    setFormData({ [name]: newObj });
  }

  function renderSwitch(field, index) {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            onChange={(event) => handleInputChange(event)}
            className={`form__input form__input--textarea ${
              className ? className + '__input' : ''
            } ${formData[Object.keys(formData)[index]].errors.length > 0 ? 'input--error' : ''}`}
            placeholder={field.placeholder}
            name={field.name}
            id={field.id}
            value={formData[Object.keys(formData)[index]].value}
            autoComplete={field.autocomplete || 'off'}
            key={`${field.id}-input`}
            required={field.required}
          />
        );
      case 'file':
        return (
          <input
            onChange={(event) => handleFileUpload(event)}
            className={`form__input form__input--file ${className ? className + '_input' : ''}`}
            type="file"
            placeholder={field.placeholder}
            name={field.name}
            id={field.id}
            autoComplete={field.autocomplete || 'off'}
            key={`${field.id}-input`}
            required={field.required}
          />
        );
      case 'multi':
        return null;
      case 'text' || 'email':
        return (
          <input
            onChange={(event) => handleInputChange(event)}
            className={`form__input form__input--text input__text--default ${
              className ? className + '-input' : ''
            } ${formData[Object.keys(formData)[index]].errors.length > 0 ? 'input--error' : ''}`}
            type={field.type}
            placeholder={field.placeholder}
            name={field.name}
            id={field.id}
            value={formData[Object.keys(formData)[index]].value}
            autoComplete={field.autocomplete || 'off'}
            key={`${field.id}-input`}
            required={field.required}
          />
        );
      default:
        return (
          <input
            onChange={(event) => handleInputChange(event)}
            className={`form__input input__text--default ${className ? className + '-input' : ''} ${
              formData[Object.keys(formData)[index]].errors.length > 0 ? 'input--error' : ''
            }`}
            type={field.type}
            placeholder={field.placeholder}
            name={field.name}
            id={field.id}
            value={formData[Object.keys(formData)[index]].value}
            autoComplete={field.autocomplete || 'off'}
            key={`${field.id}-input`}
            required={field.required}
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

    if (!isFormValid) return;

    handleFormSubmit(event, formData);
  }

  return (
    <form className={`form ${className}`} onSubmit={(event) => handlePreSubmit(event, formData)}>
      {formTemplate.fields.map((field, index) => (
        <div className={`form__item ${className ? className + '-item' : ''}`} key={field.id}>
          <label
            className={`form__label ${className ? className + '-label' : ''}`}
            htmlFor={field.name}>
            {renderSwitch(field, index)}
          </label>

          <div
            key={`${field.id}-errors`}
            className={`form__input-errors 
                ${formData[Object.keys(formData)[index]].errors ? 'form__errors--show' : ''}`}>
            {formData[Object.keys(formData)[index]].errors?.map((error) => {
              return (
                <span className="form__input-error" key={`${field.id}-${formData[index]}-error`}>
                  {error}
                </span>
              );
            })}
          </div>
        </div>
      ))}

      {respondErrors ? <div className="form__errors"> {respondErrors}</div> : null}

      <button
        disabled={!isValid}
        className={`form__submit button--default ${
          formTemplate.button.className ? formTemplate.button.className : ''
        }`}
        type="submit">
        {formTemplate.button.text || 'Submit'}
      </button>
    </form>
  );
}
