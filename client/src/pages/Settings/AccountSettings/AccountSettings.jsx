import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { Form, Preloader } from 'components';
import { getUserData, updateUserData, deleteUser, logoutRequest } from 'api';
import { setAlert, removeError } from 'store/actions';
import { logout } from 'utils';

import './AccountSettings.scss';

const passwordFormTemplate = {
  fields: [
    {
      placeholder: 'Current Password',
      name: 'password',
      id: 'current-password',
      type: 'password',
      autocomplete: 'new-password',
      value: '',
      required: true,
    },
    {
      placeholder: 'New password',
      name: 'newPassword',
      id: 'new-password',
      type: 'password',
      autocomplete: 'new-password',
      value: '',
      validation: 'password',
      repeatFor: 'passwordRepeat',
      required: true,
    },
    {
      placeholder: 'Repeat new password',
      name: 'newPasswordRepeat',
      id: 'new-password-repeat',
      type: 'password',
      autocomplete: 'new-password',
      value: '',
      validation: 'password-repeat',
      repeatFor: 'newPassword',
      required: true,
    },
  ],
  button: {
    id: 'password-change',
    text: 'Change password',
    type: 'submit',
    className: '',
  },
};

export default function AccountSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [formTemplate, setFormTemplate] = useState(null);
  const currentUserId = localStorage.getItem('x-token');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(async () => {
    setTimeout(() => {
      setIsLoading(false);
      setFormTemplate(passwordFormTemplate);
    }, 500);
  }, []);

  async function handlePasswordChange(event, data) {
    event.preventDefault();
    const response = await updateUserData(data);

    try {
      updateUserData(event, data);
    } catch (error) {
      dispatch(error);
      console.log(error);
    }
  }

  const handleClickOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const deletePage = async () => {
    try {
      const response = await deleteUser();
      dispatch(
        setAlert({
          message: 'Your page was deleted successfully',
          type: 'success',
        })
      );
      setIsOpen(false);
      logout(navigate);
    } catch ({ response }) {
      dispatch(
        setAlert({
          message: `${response.status}: ${response.data.message}`,
          type: 'error',
        })
      );
    }
  };

  return (
    <div className="settings__block account">
      {formTemplate ? (
        <>
          <div className="account__block account__block--password border--bottom--grey">
            <h3 className="account__block-title">Change password</h3>
            <Form
              formTemplate={formTemplate}
              className="settings__form settings__form--profile"
              prefixClass={'settings__form'}
              onFormSubmit={handlePasswordChange}
            />
          </div>
          <div className="account__block account__block--delete">
            <h3 className="account__block-title">Delete page</h3>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleClickOpen}>
              Delete page
            </Button>
            <Dialog
              open={isOpen}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description">
              <DialogTitle id="alert-dialog-title">{'Delete your page?'}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete your page? <br />
                  By doing this, you will not be able to recover your data.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button variant="outlined" color="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="outlined" color="error" onClick={deletePage} autoFocus>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </>
      ) : (
        <Preloader isLoading />
      )}
    </div>
  );
}
