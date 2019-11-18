import { Avatar, Box, Button, Snackbar, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Field, Form, Formik, FormikProps } from 'formik';
import Router, { useRouter } from 'next/router';
import React from 'react';

import Copyright from '../../../../../components/Copyright';
import SnackbarContentWrapper from '../../../../../components/SnackbarContentWrapper';
import { useResetPasswordMutation } from '../../../../../generated/graphql';
import AuthLayout from '../../../../../layouts/Auth';

export default function PasswordResetPage() {
  const router = useRouter();

  interface FormValues {
    newPassword: string;
  }

  const [state, setState] = React.useState({
    open: false,
    message: '',
  });

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const [resetPassword] = useResetPasswordMutation();

  const onSubmit = async (
    { newPassword }: FormValues,
    { setSubmitting, resetForm }: any
  ) => {
    setSubmitting(true);

    const { userId, token } = router.query;
    const response = await resetPassword({
      variables: {
        newPassword,
        userId: userId as string,
        token: token as string,
      },
    });

    if (response && response.data && response.data.resetPassword) {
      Router.push('/login');
    } else {
      setState({ ...state, message: 'Failed to reset password', open: true });
    }

    setSubmitting(false);
    resetForm();
  };

  const useStyles = makeStyles(theme => ({
    '@global': {
      body: {
        backgroundColor: theme.palette.common.white,
      },
    },
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

  const classes = useStyles();

  return (
    <AuthLayout>
      <Formik initialValues={{ newPassword: '' }} onSubmit={onSubmit}>
        {({ isSubmitting }: FormikProps<FormValues>) => (
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Reset Password
            </Typography>
            <Form className={classes.form} noValidate={true}>
              <Field
                type="password"
                name="newPassword"
                label="New password"
                margin="normal"
                variant="outlined"
                fullWidth={true}
                required={true}
                autoFocus={true}
                as={TextField}
              />
              <Button
                type="submit"
                color="primary"
                variant="contained"
                fullWidth={true}
                disabled={isSubmitting}
                className={classes.submit}
              >
                Reset
              </Button>
            </Form>
            <Snackbar
              open={state.open}
              onClose={handleClose}
              autoHideDuration={3000}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <SnackbarContentWrapper
                variant="error"
                message={state.message}
                onClose={handleClose}
              />
            </Snackbar>
          </div>
        )}
      </Formik>
      <Box mt={8}>
        <Copyright />
      </Box>
    </AuthLayout>
  );
}