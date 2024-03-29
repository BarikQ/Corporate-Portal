import React, { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Form, Preloader } from 'components';
import { signUpRequest, signInRequest } from 'api/auth';
import { connect, setListener, getSocket, setAlert } from 'store/actions';
import { SocketContext } from 'context/socket';
import { STACK_OPTIONS } from 'constants';

import './Welcome.scss';
import { ROLES_OPTIONS } from 'constants';

const signInFormTemplate = {
  fields: [
    {
      placeholder: 'Email',
      name: 'email',
      id: 'login-email',
      type: 'email',
      value: '',
      required: true,
    },
    {
      placeholder: 'Password',
      name: 'password',
      id: 'login-password',
      type: 'password',
      value: '',
      required: true,
    },
  ],
  button: {
    id: 'login-submit',
    text: 'Log In',
    type: 'submit',
    className: 'welcome__form-button',
  },
};

const signUpTemplate = {
  fields: [
    {
      placeholder: 'First Name',
      name: 'firstName',
      id: 'firstName',
      type: 'text',
      autocomplete: 'off',
      value: '',
      validation: 'name',
      required: true,
    },
    {
      placeholder: 'Surname',
      name: 'surname',
      id: 'surname',
      type: 'text',
      autocomplete: 'off',
      value: '',
      validation: 'name',
      required: true,
    },
    {
      placeholder: 'Birth Date',
      name: 'birthDate',
      id: 'birthDate',
      type: 'date',
      value: moment().format('L'),
    },
    {
      placeholder: 'City',
      name: 'city',
      id: 'city',
      type: 'text',
      value: '',
    },
    {
      placeholder: 'Email',
      name: 'email',
      id: 'signup-email',
      type: 'email',
      autocomplete: 'new-password',
      value: '',
      validation: 'email',
      required: true,
    },
    {
      placeholder: 'Password',
      name: 'password',
      id: 'signup-password',
      type: 'password',
      autocomplete: 'new-password',
      value: '',
      validation: 'password',
      repeatFor: 'passwordRepeat',
      required: true,
    },
    {
      placeholder: 'Repeat password',
      name: 'passwordRepeat',
      id: 'signup-password-repeat',
      type: 'password',
      autocomplete: 'new-password',
      value: '',
      validation: 'password-repeat',
      repeatFor: 'password',
      required: true,
    },
  ],
  button: {
    id: 'signup-submit',
    text: 'Sign up',
    type: 'submit',
    className: 'welcome__form-button',
  },
};

const adminSignUpTemplate = {
  fields: [
    {
      placeholder: 'First Name',
      name: 'firstName',
      id: `firstName`,
      type: 'text',
      value: '',
      required: true,
      validation: 'name',
    },
    {
      placeholder: 'Surname',
      name: 'surname',
      id: `surname`,
      type: 'text',
      value: '',
      required: true,
      validation: 'name',
    },
    {
      placeholder: 'Email',
      name: 'email',
      id: 'signup-email',
      type: 'email',
      autocomplete: 'new-password',
      value: '',
      validation: 'email',
      required: true,
    },
    {
      placeholder: 'Password',
      name: 'password',
      id: 'signup-password',
      type: 'password',
      autocomplete: 'new-password',
      value: '',
      validation: 'password',
      repeatFor: 'passwordRepeat',
      required: true,
    },
    {
      placeholder: 'Repeat password',
      name: 'passwordRepeat',
      id: 'signup-password-repeat',
      type: 'password',
      autocomplete: 'new-password',
      value: '',
      validation: 'password-repeat',
      repeatFor: 'password',
      required: true,
    },
    {
      placeholder: 'City',
      name: 'city',
      id: `city`,
      type: 'text',
      value: '',
    },
    {
      placeholder: 'Birth Date',
      name: 'birthDate',
      id: `birthDate`,
      type: 'date',
      value: moment().format('L'),
    },
    {
      placeholder: 'Technologies',
      multiPlaceholder: 'Technology',
      name: 'technologies',
      id: `technologies`,
      type: 'multi',
      value: [],
      options: STACK_OPTIONS,
    },
    {
      name: 'profileImage',
      id: `profileImage`,
      type: 'cropper',
      value: '',
    },
    {
      placeholder: 'Role',
      name: 'role',
      id: 'role',
      type: 'select',
      value: 'user',
      options: ROLES_OPTIONS,
    },
  ],
  button: {
    id: `login-submit'`,
    text: 'Create user',
    type: 'submit',
    className: 'settings__form-button',
  },
};

Welcome.propTypes = {
  isAdminPage: PropTypes.bool,
  onSuccess: PropTypes.func,
};

function Welcome({ isAdminPage, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [signInDisplay, setSignInDisplay] = useState(true);
  const [signUpErrors, setSignUpErrors] = useState(null);
  const [signInErrors, setSignInErrors] = useState(null);
  const [signUpFormTemplate, setSignUpFormTemplate] = useState(
    isAdminPage ? adminSignUpTemplate : signUpTemplate
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useContext(SocketContext);

  async function signInSubmit(event, formData) {
    event.preventDefault();

    try {
      const response = await signInRequest(event, formData);

      setSignInErrors(null);

      if (response && response.status === 200) {
        const xToken = response.headers['x-token'];
        localStorage.setItem('x-token', xToken);

        if (response.data.signature) {
          localStorage.setItem('cloud-signature', JSON.stringify(response.data.signature));
        }

        socket.auth = { userId: xToken };
        socket.connect();
        // dispatch(connect(xToken));
        navigate(`/${xToken}`);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        const errors = [data.message];

        console.log(status, errors);
        setSignInErrors(errors);
      } else {
        console.error(error);
      }
    }
  }

  async function signUpSubmit(event, formData) {
    event.preventDefault();

    try {
      setIsLoading((prev) => true);
      const response = await signUpRequest(event, formData, isAdminPage);
      console.log(response);

      setSignUpErrors(null);
      setIsLoading((prev) => false);

      if (!isAdminPage) {
        localStorage.setItem('x-token', response.headers['x-token']);

        navigate('/settings/profile');
      } else {
        dispatch(
          setAlert({
            message: 'User was created successfully',
            type: 'success',
          })
        );
        onSuccess(event, response.data);
      }
    } catch (error) {
      setIsLoading((prev) => false);
      const { response } = error;

      dispatch(
        setAlert({
          message: response ? `${response.status}: ${response.data.message}` : error.message,
          type: 'error',
        })
      );

      if (error.response) {
        const { status, data } = error.response;
        const errors = JSON.parse(data.message);

        setSignUpErrors(errors);
      }
    }
  }

  return (
    <div className="welcome">
      {isAdminPage && isLoading && (
        <Preloader isLoading prefix="welcome" text="Request being processed" />
      )}
      <h1 className="welcome__title">
        {isAdminPage ? 'Add user to iTechArt' : 'Welcome to iTechArt!'}
      </h1>
      <span>iTechArt corporate network</span>
      <div className="welcome__wrapper">
        <div className="welcome__sign">
          <>
            {!isAdminPage && signInDisplay ? (
              <>
                <Form
                  className="welcome__form"
                  prefixClass="welcome__form"
                  formTemplate={signInFormTemplate}
                  onFormSubmit={signInSubmit}
                  key={'signInForm'}
                  formErrors={signInErrors}
                />
                <a
                  className="welcome__switch-link"
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    setSignInDisplay(false);
                  }}>
                  {"Don't have an account? Sign up."}
                </a>
              </>
            ) : (
              <>
                <Form
                  className="welcome__form"
                  prefixClass="welcome__form"
                  formTemplate={signUpFormTemplate}
                  onFormSubmit={signUpSubmit}
                  formFieldsErrors={signUpErrors}
                  key={'signUpForm'}
                />
                {!isAdminPage && (
                  <a
                    className="welcome__switch-link"
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setSignInDisplay(true);
                    }}>
                    Already have an account? Sign in.
                  </a>
                )}
              </>
            )}
          </>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
