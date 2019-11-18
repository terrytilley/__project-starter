import { NextPage } from 'next';
import React from 'react';

import { useUsersQuery } from '../../generated/graphql';
import MainLayout from '../../layouts/Main';

const HomePage: NextPage = () => {
  const { data } = useUsersQuery({ fetchPolicy: 'network-only' });

  return (
    <MainLayout>
      <h1>Home Page</h1>
      <ul>{data && data.users.map(({ id, email }) => <li key={id}>{email}</li>)}</ul>
    </MainLayout>
  );
};

export default HomePage;
