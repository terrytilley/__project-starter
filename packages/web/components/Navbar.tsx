import Link from 'next/link';
import React from 'react';

import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { setAccessToken } from '../lib/accessToken';

export const Navbar: React.FC = () => {
  const { data, loading } = useMeQuery();
  const [logout, { client }] = useLogoutMutation();

  let loggedInMessage: any = null;

  if (loading) {
    loggedInMessage = null;
  } else if (data && data.me) {
    loggedInMessage = <div>You are logged in as {data.me.email}</div>;
  } else {
    loggedInMessage = <div>You are not logged in</div>;
  }

  const onLogout = async () => {
    await logout();
    setAccessToken('');
    await client!.resetStore();
  };

  return (
    <nav>
      <ul>
        <li>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        <li>
          <Link href="/register">
            <a>Register</a>
          </Link>
        </li>
        <li>
          <Link href="/login">
            <a>Login</a>
          </Link>
        </li>
        <li>
          <Link href="/protected">
            <a>Protected</a>
          </Link>
        </li>
        {!loading && data && data.me && (
          <li>
            <button onClick={onLogout}>Logout</button>
          </li>
        )}
      </ul>
      {loggedInMessage}
    </nav>
  );
};
