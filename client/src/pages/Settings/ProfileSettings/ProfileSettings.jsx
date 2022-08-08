import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import { Form, Preloader } from 'components';
import { getUserData, updateUserData } from 'api';
import { setAlert, removeError } from 'store/actions';
import { stackOptions } from 'constants';

import './ProfileSettings.scss';

export default function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [formTemplate, setFormTemplate] = useState(null);
  const currentUserId = localStorage.getItem('x-token');
  const dispatch = useDispatch();

  useEffect(async () => {
    const {
      profileData: { firstName, surname, birthDate, city, profileImage, technologies },
    } = await getUserData(currentUserId);

    setFormTemplate({
      fields: [
        {
          name: 'profileImage',
          id: 'profileImage',
          type: 'cropper',
          value: profileImage || '',
        },
        {
          placeholder: 'First Name',
          name: 'firstName',
          id: 'firstName',
          type: 'text',
          value: firstName || '',
          required: true,
          validation: 'name',
        },
        {
          placeholder: 'Surname',
          name: 'surname',
          id: 'surname',
          type: 'text',
          value: surname || '',
          required: true,
          validation: 'name',
        },
        {
          placeholder: 'City',
          name: 'city',
          id: 'city',
          type: 'text',
          value: city || '',
        },
        {
          placeholder: 'Birth Date',
          name: 'birthDate',
          id: 'birthDate',
          type: 'date',
          value: birthDate || moment().format('L'),
        },
        {
          placeholder: 'Technologies',
          multiPlaceholder: 'Technology',
          name: 'technologies',
          id: 'technologies',
          type: 'multi',
          value: technologies || [],
          options: stackOptions,
        },
      ],
      button: {
        id: 'login-submit',
        text: 'Save',
        type: 'submit',
        className: 'settings__form-button',
      },
    });
    setIsLoading(false);
  }, []);

  async function handleFormSubmit(event, data) {
    event.preventDefault();

    try {
      updateUserData(event, data);
    } catch (error) {
      dispatch(error);
      console.log(error);
    }
  }

  return (
    <div className="settings__block">
      {formTemplate ? (
        <Form
          className="settings__form settings__form--profile"
          prefixClass={'settings__form'}
          formTemplate={formTemplate}
          onFormSubmit={handleFormSubmit}
        />
      ) : (
        <Preloader isLoading />
      )}
    </div>
  );
}
