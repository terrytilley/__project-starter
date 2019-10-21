import React, { useState } from "react";
import Router from "next/router";

import Layout from "../components/Layout";
import { useRegisterMutation } from "../generated/graphql";

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register] = useRegisterMutation();

  return (
    <Layout>
      <form
        onSubmit={async e => {
          e.preventDefault();
          await register({
            variables: { email, password }
          });
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
        <button type="submit">Register</button>
      </form>
    </Layout>
  );
};
