import Router from 'next/router';
import React, { useState } from 'react';

import Layout from '../components/Layout';
import { useRegisterMutation } from '../generated/graphql';

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [register] = useRegisterMutation();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    await register({
      variables: { email, password },
    });
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
        <button type="submit">Register</button>
      </form>
    </Layout>
  );
};
