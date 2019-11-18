import { NextPage } from 'next';
import React from 'react';

import { useProtectedQuery } from '../../generated/graphql';
import MainLayout from '../../layouts/Main';
import { authRedirect } from '../../lib/auth';
import { PageContext } from '../../types';

const ProtectedPage: NextPage = () => {
  const { data, loading } = useProtectedQuery();

  if (loading) return <MainLayout />;

  if (!data) {
    return (
      <MainLayout>
        <h1>No data</h1>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1>Protected Page</h1>
      <p>{data.protected}</p>
    </MainLayout>
  );
};

ProtectedPage.getInitialProps = async (ctx: PageContext) => authRedirect(ctx);

export default ProtectedPage;
