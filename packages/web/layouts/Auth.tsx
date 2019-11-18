import { Box, Container } from '@material-ui/core';
import Head from 'next/head';
import * as React from 'react';

import Copyright from '../components/Copyright';
import Navbar from '../components/Navbar';

interface Props {
  title?: string;
}

const Layout: React.FunctionComponent<Props> = ({
  title = 'This is the default title',
  children,
}) => {
  return (
    <React.Fragment>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar />
      <Container component="main" maxWidth="xs">
        {children}
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default Layout;
