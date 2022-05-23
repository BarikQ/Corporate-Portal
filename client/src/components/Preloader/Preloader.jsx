import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import PropagateLoader from 'react-spinners/PropagateLoader';

import './Preloader.scss';

Preloader.propTypes = {
  prefix: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  text: PropTypes.string,
};

Preloader.defaultProps = {
  prefix: '',
  text: 'Fetching data',
};

export default function Preloader({ prefix, isLoading, text, ...props }) {
  const color = '#ffffff';
  const size = 16;
  const override = css`
    top: -${size / 2}px;
  `;

  return (
    <div className={`preloader ${prefix ? `${prefix}__preloader` : ''}`}>
      {text ? (
        <span className={`preloader__text ${prefix ? `${prefix}__preloader__text` : ''}`}>
          {text}
        </span>
      ) : null}
      <PropagateLoader color={color} loading={isLoading} size={size} css={override} />
    </div>
  );
}
