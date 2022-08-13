import React from 'react';
import { Button, TextField, Stack, Chip, Autocomplete } from '@mui/material';
import PropTypes from 'prop-types';

Multiselect.propTypes = {
  className: PropTypes.string,
  prefixClass: PropTypes.string,
  value: PropTypes.array.isRequired || PropTypes.string.isRequired,
  id: PropTypes.string,
  name: PropTypes.string,
  field: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

Multiselect.defaultProps = {
  className: '',
  prefixClass: '',
  id: '',
  name: '',
};

export default function Multiselect({
  className,
  prefixClass,
  value,
  id,
  name,
  field,
  onChange,
  ...props
}) {
  return (
    <Autocomplete
      {...props}
      multiple
      freeSolo
      value={value}
      id={field.id}
      key={`${field.id}-input`}
      options={field.options.map((option) => option)}
      required={field.required}
      name={field.name}
      className={`multiselect ${className}`}
      onChange={(event, values) => onChange(field.name, values)}
      getOptionLabel={(option) => option}
      filterSelectedOptions
      color="third"
      renderTags={(value, getTagProps) => {
        return value.map((option, index) => (
          <Chip label={option} key={option} {...getTagProps({ index })} />
        ));
      }}
      renderInput={(params) => {
        return (
          <TextField {...params} label={field.placeholder} placeholder={field.multiPlaceholder} />
        );
      }}
    />
  );
}
