import { Avatar, Box, Button, Container, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Field, Form, Formik, FormikProps } from 'formik';
import Router from 'next/router';
import React from 'react';

import Copyright from '../components/Copyright';
import Layout from '../components/Layout';
import { useRegisterMutation } from '../generated/graphql';

export default () => {
  interface FormValues {
    email: string;
    password: string;
  }

  const [register] = useRegisterMutation();

  const onSubmit = async (
    { email, password }: FormValues,
    { setSubmitting, resetForm }: any
  ) => {
    setSubmitting(true);

    await register({ variables: { email, password } });

    setSubmitting(false);
    resetForm();
    Router.push('/login');
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
                Sign up
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
                  Sign up
                </Button>
              </Form>
            </div>
          )}
        </Formik>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </Layout>
  );
};
