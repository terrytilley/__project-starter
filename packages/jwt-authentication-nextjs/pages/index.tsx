import React from 'react';

import Layout from '../components/Layout';
import { useUsersQuery } from '../generated/graphql';

export default () => {
  const { data } = useUsersQuery({ fetchPolicy: 'network-only' });

  if (!data) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <h1>Home Page</h1>
        <ul>
          {data.users.map(({ id, email }) => (
            <li key={id}>{email}</li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};
