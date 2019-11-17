interface MainMenuList {
  text: string;
  link: string;
}

export const mainMenuLoggedInList: MainMenuList[] = [
  {
    text: 'Protected',
    link: '/protected',
  },
];

export const mainMenuLoggedOutList: MainMenuList[] = [
  {
    text: 'Login',
    link: '/login',
  },
  {
    text: 'Register',
    link: '/register',
  },
];
