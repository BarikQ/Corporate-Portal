import React from 'react';
import PropTypes from 'prop-types';

import './LabeledItem.scss';

LabeledItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  className: PropTypes.string,
};

LabeledItem.defaultProps = {
  className: '',
};

function handleValueType(value) {
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  return value;
}

export default function LabeledItem({ label, value, className, ...props }) {
  return (
    <div className={`labeled-item ${className}`} {...props}>
      <div className="labeled-item__label">{label}:</div>
      <div className="labeled-item__value">{handleValueType(value)}</div>
    </div>
  );
}
