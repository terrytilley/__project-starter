import React from "react";
import Link from "next/link";

import { setAccessToken } from "../lib/accessToken";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";

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
            <button
              onClick={async () => {
                await logout();
                setAccessToken("");
                await client!.resetStore();
              }}
            >
              Logout
            </button>
          </li>
        )}
      </ul>
      {loggedInMessage}
    </nav>
  );
};
