import React from 'react';

import { useProtectedQuery } from '../../generated/graphql';
import MainLayout from '../../layouts/Main';

export default function ProtectedPage() {
  const { data, loading, error } = useProtectedQuery();

  if (loading) return <MainLayout />;

  if (error) {
    return (
      <MainLayout>
        <h1>Errors</h1>
        <ul>
          {error.graphQLErrors.map(({ message }, index) => {
            return <li key={index}>{message}</li>;
          })}
        </ul>
      </MainLayout>
    );
  }

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
}
