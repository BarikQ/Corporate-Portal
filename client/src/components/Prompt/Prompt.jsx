import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

import styles from './Prompt.module.scss';

Prompt.propTypes = {
  data: PropTypes.any,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  dialogTitle: PropTypes.string,
  Handler: PropTypes.any,
  DialogPromptText: PropTypes.any,
  DialogPromptComponent: PropTypes.any,
  DialogPromptComponentParams: PropTypes.object,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  isConfirmButton: PropTypes.bool,
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Prompt({
  data,
  onOpen,
  onClose,
  onConfirm,
  dialogTitle,
  Handler,
  DialogPromptText,
  DialogPromptComponent,
  DialogPromptComponentParams,
  cancelText,
  confirmText,
  isConfirmButton = true,
}) {
  const [open, setOpen] = useState(false);
  const [sdata, setSdata] = useState(data);

  const handleClickOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
    if (onOpen) onOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose(false);
  };

  const handleConfirm = (e, newData = sdata) => {
    e.stopPropagation();
    handleClose();
    if (onConfirm) onConfirm(newData);
  };

  return (
    <>
      <Handler onClick={handleClickOpen} />
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          {DialogPromptText ? (
            <DialogContentText id="alert-dialog-slide-description">
              <DialogPromptText />
            </DialogContentText>
          ) : null}
          {DialogPromptComponent && (
            <DialogPromptComponent {...DialogPromptComponentParams} onSuccess={handleConfirm} />
          )}
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleClose}>
            {cancelText || 'No'}
          </Button>
          {isConfirmButton && (
            <Button color="secondary" onClick={handleConfirm}>
              {confirmText || 'Yes'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
