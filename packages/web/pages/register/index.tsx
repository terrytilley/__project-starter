import { Avatar, Button, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Field, Form, Formik, FormikProps } from 'formik';
import { NextPage } from 'next';
import Router from 'next/router';
import React, { useState } from 'react';

import { useRegisterMutation } from '../../generated/graphql';
import AuthLayout from '../../layouts/Auth';
import { authRedirect } from '../../lib/auth';
import { PageContext } from '../../types';

import Alert from '../../components/Alert';

const RegisterPage: NextPage = () => {
  interface FormValues {
    email: string;
    password: string;
  }

  const [register] = useRegisterMutation();
  const [state, setState] = useState({ open: false, message: '' });

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const onSubmit = async (
    { email, password }: FormValues,
    { setSubmitting, resetForm }: any
  ) => {
    setSubmitting(true);

    try {
      await register({ variables: { email, password } });
      resetForm();
      Router.push('/login');
    } catch (err) {
      const { message } = err.graphQLErrors[0];

      resetForm();
      setState({ ...state, message, open: true });
    }

    setSubmitting(false);
  };

  const useStyles = makeStyles(theme => ({
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
      <Formik initialValues={{ email: '', password: '' }} onSubmit={onSubmit}>
        {({ isSubmitting }: FormikProps<FormValues>) => (
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Register
            </Typography>
            <Form className={classes.form} noValidate={true}>
              <Field
                type="email"
                name="email"
                label="Email"
                margin="normal"
                variant="outlined"
                fullWidth={true}
                required={true}
                autoFocus={true}
                as={TextField}
              />
              <Field
                type="password"
                name="password"
                label="Password"
                margin="normal"
                variant="outlined"
                fullWidth={true}
                required={true}
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
                Register
              </Button>
            </Form>
            <Alert
              open={state.open}
              variant="error"
              message={state.message}
              onClose={handleClose}
            />
          </div>
        )}
      </Formik>
    </AuthLayout>
  );
};

RegisterPage.getInitialProps = async (ctx: PageContext) => authRedirect(ctx, true);

export default RegisterPage;
