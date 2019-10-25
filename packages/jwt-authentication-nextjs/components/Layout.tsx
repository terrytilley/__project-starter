// tslint:disable-next-line: no-submodule-imports
import Head from 'next/head';
import * as React from 'react';

import { Navbar } from './Navbar';
interface Props {
  title?: string;
}

const Layout: React.FunctionComponent<Props> = ({
  title = 'This is the default title',
  children
}) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Navbar />
    {children}
  </div>
);

export default Layout;
