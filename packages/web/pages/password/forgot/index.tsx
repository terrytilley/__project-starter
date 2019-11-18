import {
  Avatar,
  Box,
  Button,
  Container,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Field, Form, Formik, FormikProps } from 'formik';
import React from 'react';

import Copyright from '../../../components/Copyright';
import SnackbarContentWrapper from '../../../components/SnackbarContentWrapper';
import { useForgotPasswordMutation } from '../../../generated/graphql';
import Layout from '../../../layouts/Main';

export default function ForgotPasswordPage() {
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
    <Layout>
      <Container component="main" maxWidth="xs">
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
              <Snackbar
                open={state.open}
                onClose={handleClose}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                <SnackbarContentWrapper
                  variant="success"
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
      </Container>
    </Layout>
  );
}
