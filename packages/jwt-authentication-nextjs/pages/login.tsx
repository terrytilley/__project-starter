import React, { useState } from "react";
import Router from "next/router";

import Layout from "../components/Layout";
import { setAccessToken } from "../lib/accessToken";
import { useLoginMutation, MeQuery, MeDocument } from "../generated/graphql";

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login] = useLoginMutation();

  return (
    <Layout>
      <form
        onSubmit={async e => {
          e.preventDefault();
          const response = await login({
            variables: { email, password },
            update: (store, { data }) => {
              if (!data) {
                return null;
              }
              store.writeQuery<MeQuery>({
                query: MeDocument,
                data: { me: data.login.user }
              });
            }
          });

          if (response && response.data) {
            setAccessToken(response.data.login.accessToken);
          }

          Router.push("/");
        }}
      >
        <div>
          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={e => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={e => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </Layout>
  );
};
