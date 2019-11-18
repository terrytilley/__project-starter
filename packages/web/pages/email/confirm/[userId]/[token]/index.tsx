import { Box, Paper, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { useConfirmEmailMutation } from '../../../../../generated/graphql';
import AuthLayout from '../../../../../layouts/Auth';
import { authRedirect } from '../../../../../lib/auth';
import { PageContext } from '../../../../../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3, 2),
    },
  })
);

const ConfirmEmailPage: NextPage = () => {
  const router = useRouter();
  const { userId, token } = router.query;
  const [confirmEmail] = useConfirmEmailMutation();
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await confirmEmail({
        variables: {
          userId: userId as string,
          token: token as string,
        },
      });

      if (response && response.data) {
        setConfirmed(response.data.confirmEmail);
      }
    })();
  }, []);

  const classes = useStyles();

  return (
    <AuthLayout>
      <Box mt={12} bgcolor="background.paper">
        <Paper className={classes.root}>
          {confirmed ? (
            <Typography variant="h5" color="textPrimary" align="center">
              Email confirmed
            </Typography>
          ) : (
            <Typography variant="h5" color="textPrimary" align="center">
              Email not confirmed
            </Typography>
          )}
        </Paper>
      </Box>
    </AuthLayout>
  );
};

ConfirmEmailPage.getInitialProps = async (ctx: PageContext) => authRedirect(ctx, true);

export default ConfirmEmailPage;
