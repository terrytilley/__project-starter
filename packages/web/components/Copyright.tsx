import { Typography } from '@material-ui/core';
import React from 'react';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <a href="https://example.com/">Project Starter</a> {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default Copyright;
