import { Avatar, Button, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Field, Form, Formik, FormikProps } from 'formik';
import { NextPage } from 'next';
import React from 'react';

import Alert from '../../../components/Alert';
import { useForgotPasswordMutation } from '../../../generated/graphql';
import AuthLayout from '../../../layouts/Auth';
import { authRedirect } from '../../../lib/auth';
import { PageContext } from '../../../types';

const ForgotPasswordPage: NextPage = () => {
  interface FormValues {
    email: string;
  }

  const [state, setState] = React.useState({
    open: false,
    message: '',
  });

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const [forgotPassword] = useForgotPasswordMutation();

  const onSubmit = async ({ email }: FormValues, { setSubmitting, resetForm }: any) => {
    setSubmitting(true);

    const response = await forgotPassword({
      variables: { email },
    });

    if (response && response.data) {
      const { message } = response.data;
      setState({ ...state, message, open: true });
    }

    setSubmitting(false);
    resetForm();
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
              Find Your Account
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
              <Button
                type="submit"
                color="primary"
                variant="contained"
                fullWidth={true}
                disabled={isSubmitting}
                className={classes.submit}
              >
                Search
              </Button>
            </Form>
            <Alert
              open={state.open}
              variant="success"
              message={state.message}
              handleClose={handleClose}
            />
          </div>
        )}
      </Formik>
    </AuthLayout>
  );
};

ForgotPasswordPage.getInitialProps = async (ctx: PageContext) => authRedirect(ctx, true);

export default ForgotPasswordPage;
