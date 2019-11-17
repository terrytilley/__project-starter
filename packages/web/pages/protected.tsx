import React from 'react';

import { useProtectedQuery } from '../generated/graphql';
import Layout from '../layouts/Main';

export default () => {
  const { data, loading, error } = useProtectedQuery();

  if (loading) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (error) {
    console.log(error);

    return (
      <Layout>
        <h1>Errors</h1>
        <ul>
          {error.graphQLErrors.map(({ message }, index) => {
            return <li key={index}>{message}</li>;
          })}
        </ul>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <div>no data</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>Protected Page</h1>
      <p>{data.protected}</p>
    </Layout>
  );
};
