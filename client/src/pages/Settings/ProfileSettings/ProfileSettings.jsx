import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import { Form, Preloader } from 'components';
import { getUserData, updateUserData } from 'api';
import { setAlert, removeError } from 'store/actions';
import { STACK_OPTIONS } from 'constants';

import './ProfileSettings.scss';

ProfileSettings.propTypes = {
  isAdminPage: PropTypes.bool,
  adminData: PropTypes.object,
  onSuccess: PropTypes.func,
};

export default function ProfileSettings({ isAdminPage, adminData, onSuccess }) {
  const [isLoading, setIsLoading] = useState(true);
  const [formTemplate, setFormTemplate] = useState(null);
  const currentUserId = localStorage.getItem('x-token');
  const dispatch = useDispatch();

  useEffect(async () => {
    let profileData = null,
      firstName = null,
      surname = null,
      birthDate = null,
      city = null,
      profileImage = null,
      technologies = null;

    if (adminData) {
      ({ firstName, surname, birthDate, city, profileImage, technologies } = adminData);
    } else {
      ({ profileData } = await getUserData(currentUserId));
      ({ firstName, surname, birthDate, city, profileImage, technologies } = profileData);
    }

    setFormTemplate({
      fields: [
        {
          name: 'profileImage',
          id: `profileImage${adminData?.id && `-${adminData.id}`}`,
          type: 'cropper',
          value: profileImage || '',
        },
        {
          placeholder: 'First Name',
          name: 'firstName',
          id: `firstName${adminData?.id && `-${adminData.id}`}`,
          type: 'text',
          value: firstName || '',
          required: true,
          validation: 'name',
        },
        {
          placeholder: 'Surname',
          name: 'surname',
          id: `surname${adminData?.id && `-${adminData.id}`}`,
          type: 'text',
          value: surname || '',
          required: true,
          validation: 'name',
        },
        {
          placeholder: 'City',
          name: 'city',
          id: `city${adminData?.id && `-${adminData.id}`}`,
          type: 'text',
          value: city || '',
        },
        {
          placeholder: 'Birth Date',
          name: 'birthDate',
          id: `birthDate${adminData?.id && `-${adminData.id}`}`,
          type: 'date',
          value: birthDate || moment().format('L'),
        },
        {
          placeholder: 'Technologies',
          multiPlaceholder: 'Technology',
          name: 'technologies',
          id: `technologies${adminData?.id && `-${adminData.id}`}`,
          type: 'multi',
          value: isAdminPage
            ? technologies.length > 1
              ? technologies.split(', ')
              : []
            : technologies || [],
          options: STACK_OPTIONS,
        },
      ],
      button: {
        id: `login-submit'${adminData?.id && `-${adminData.id}`}`,
        text: 'Save',
        type: 'submit',
        className: 'settings__form-button',
      },
    });
    setIsLoading(false);
  }, [adminData]);

  async function handleFormSubmit(event, data) {
    event.preventDefault();

    try {
      await updateUserData(data, adminData?.id, isAdminPage);
      dispatch(
        setAlert({
          message: 'User profile was changed successfully',
          type: 'success',
        })
      );
      console.log(data);
      if (adminData) {
        const reformedData = JSON.parse(JSON.stringify(data));

        Object.keys(reformedData).forEach(
          (key) =>
            (reformedData[key] = Array.isArray(reformedData[key].value)
              ? reformedData[key].value.join(', ')
              : reformedData[key].value)
        );

        console.log(reformedData);
        onSuccess(event, { ...reformedData, id: adminData.id });
      }
    } catch (error) {
      const { response } = error;
      dispatch(
        setAlert({
          message: response ? `${response.status}: ${response.data.message}` : error.message,
          type: 'error',
        })
      );
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
