import { Avatar, Box, Button, Container, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Formik } from 'formik';
import Router from 'next/router';
import React from 'react';

import Layout from '../components/Layout';
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';
import { setAccessToken } from '../lib/accessToken';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <a href="https://example.com/">Project Starter</a> {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default () => {
  const [login] = useLoginMutation();

  const onSubmit = async (
    { email, password }: any,
    { setSubmitting, resetForm }: any
  ) => {
    setSubmitting(true);

    const response = await login({
      variables: { email, password },
      update: (store, { data }) => {
        if (!data) {
          return null;
        }
        store.writeQuery<MeQuery>({
          query: MeDocument,
          data: { me: data.login.user },
        });
      },
    });

    if (response && response.data) {
      setAccessToken(response.data.login.accessToken);
    }

    setSubmitting(false);
    resetForm();
    Router.push('/');
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
          {({ values, isSubmitting, handleChange, handleBlur, handleSubmit }) => (
            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <form className={classes.form} noValidate={true} onSubmit={handleSubmit}>
                <TextField
                  type="email"
                  name="email"
                  label="Email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  variant="outlined"
                  fullWidth={true}
                  required={true}
                  autoFocus={true}
                />
                <TextField
                  type="password"
                  name="password"
                  label="Password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  variant="outlined"
                  fullWidth={true}
                  required={true}
                />
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  fullWidth={true}
                  disabled={isSubmitting}
                  className={classes.submit}
                >
                  Sign in
                </Button>
              </form>
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
