import { IconButton, Snackbar, SnackbarContent } from '@material-ui/core';
import { amber, green } from '@material-ui/core/colors';
import { makeStyles, Theme } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import clsx from 'clsx';
import React from 'react';

// import SnackbarContentWrapper from './SnackbarContentWrapper';

interface SnackbarContentWrapperProps {
  className?: string;
  message?: string;
  variant: keyof typeof variantIcon;
  onClose?(): void;
}

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const useStyles = makeStyles((theme: Theme) => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

function SnackbarContentWrapper(props: SnackbarContentWrapperProps) {
  const classes = useStyles();
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={clsx(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

export interface AlertProps {
  open: boolean;
  variant: string;
  message: string;
  autoHideDuration?: number;
  handleClose(): void;
}

export default function Alert(props: AlertProps) {
  const autoHideDuration = 3000;

  return (
    <Snackbar
      open={props.open}
      onClose={props.handleClose}
      autoHideDuration={props.autoHideDuration || autoHideDuration}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <SnackbarContentWrapper
        variant="success"
        message={props.message}
        onClose={props.handleClose}
      />
    </Snackbar>
  );
}
