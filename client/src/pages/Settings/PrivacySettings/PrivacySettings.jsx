import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';

import { Form, Preloader } from 'components';
import { getUserData, updateUserData } from 'api';
import { setAlert, removeError } from 'store/actions';

import './PrivacySettings.scss';

export default function PrivacySettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [formTemplate, setFormTemplate] = useState(null);
  const currentUserId = localStorage.getItem('x-token');
  const dispatch = useDispatch();

  useEffect(async () => {
    setTimeout(() => {
      setIsLoading(false);
      setFormTemplate(true);
    }, 500);
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
    <div className="settings__block privacy">
      {formTemplate ? <>Privacy Settings</> : <Preloader isLoading />}
    </div>
  );
}
