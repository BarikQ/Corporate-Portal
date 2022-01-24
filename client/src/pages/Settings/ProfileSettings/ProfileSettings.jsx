import React from 'react';

import { Form } from 'components';

import { updateUserData } from 'api';

import './ProfileSettings.scss';

const formTemplate = {
  formType: 'login',
  fields: [
    {
      name: 'profileImage',
      id: 'profileImage',
      type: 'cropper',
      value: '',
      defaultSrc:
        'https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg',
    },
    {
      placeholder: 'First Name',
      name: 'firstName',
      id: 'firstName',
      type: 'text',
      value: '',
      required: true,
    },
    {
      placeholder: 'Second Name',
      name: 'secondName',
      id: 'secondName',
      type: 'text',
      value: '',
      required: true,
    },
    {
      placeholder: 'City',
      name: 'city',
      id: 'city',
      type: 'text',
      value: '',
    },
    {
      placeholder: 'Birth Date',
      name: 'birthDate',
      id: 'birthDate',
      type: 'date',
      value: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
    },
    {
      placeholder: 'Technologies',
      multiPlaceholder: 'Technology',
      name: 'technologies',
      id: 'technologies',
      type: 'multi',
      value: '',
      options: [
        'JS',
        'HTML',
        'CSS',
        'Java',
        'Python',
        'C',
        'C++',
        'C#',
        'PHP',
        'Ruby',
        'RubyOnRails',
        'React',
        'Angular',
        'Typescript',
        'R',
        'Redux',
        'Unity',
      ],
    },
  ],
  button: {
    id: 'login-submit',
    text: 'Save',
    type: 'submit',
    className: 'settings__form-button',
  },
};

export default function ProfileSettings() {
  async function handleFormSubmit(event, data) {
    event.preventDefault();

    try {
      updateUserData(event, data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="settings__block">
      <Form
        className="settings__form settings__form--profile"
        prefixClass={'settings__form'}
        formTemplate={formTemplate}
        onFormSubmit={handleFormSubmit}
      />
    </div>
  );
}
