import { AppBar, Button, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import Link from 'next/link';
import Router from 'next/router';
import * as React from 'react';

import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { setAccessToken } from '../lib/accessToken';
import { mainMenuLoggedInList, mainMenuLoggedOutList } from '../lib/menu';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      cursor: 'pointer',
    },
  })
);

const Navbar: React.FC = () => {
  const { data, loading } = useMeQuery();
  const [logout, { client }] = useLogoutMutation();

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogout = async () => {
    await logout();
    setAccessToken('');
    Router.push('/login');
    await client!.resetStore();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>
        <Link href="/">
          <Typography variant="h6" className={classes.title}>
            Project Starter
          </Typography>
        </Link>
        {!loading && data && data.me ? (
          <div>
            {mainMenuLoggedInList.map(({ text, link }) => (
              <Link href={link} key={text}>
                <Button color="inherit">{text}</Button>
              </Link>
            ))}
            <Button color="inherit" onClick={onLogout}>
              Logout
            </Button>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted={true}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
            </Menu>
          </div>
        ) : (
          <div>
            {mainMenuLoggedOutList.map(({ text, link }) => (
              <Link href={link} key={text}>
                <Button color="inherit">{text}</Button>
              </Link>
            ))}
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
