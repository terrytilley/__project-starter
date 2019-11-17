import React from 'react';

import { useUsersQuery } from '../../generated/graphql';
import Layout from '../../layouts/Main';

export default () => {
  const { data } = useUsersQuery({ fetchPolicy: 'network-only' });

  if (!data) return <Layout />;

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
