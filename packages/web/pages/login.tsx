import Router from 'next/router';
import React, { useState } from 'react';

import Layout from '../components/Layout';
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';
import { setAccessToken } from '../lib/accessToken';

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useLoginMutation();

  const onSubmit = async (e: any) => {
    e.preventDefault();
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

    Router.push('/');
  };

  const onEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  return (
    <Layout>
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={onEmailChange}
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={onPasswordChange}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </Layout>
  );
};
