// importar
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
import { onAuthStateChanged } from 'firebase/auth';
import home from './components/home.js';
import error from './components/error404.js';
// eslint-disable-next-line import/no-unresolved
import login from './components/login.js';
import register from './components/register.js';

import './lib/loginConfig.js';
import { auth } from './lib/firebaseConfig.js';
// Nombre: foodMatch

const routes = [
  { path: '/', component: home },
  { path: '/error', component: error },
  { path: '/login', component: login },
  { path: '/register', component: register },
];

const defaultRoute = '/';
const root = document.getElementById('root');

function navigateTo(hash) {
  const route = routes.find((routeFound) => routeFound.path === hash);

  if (route && route.component) {
    window.history.pushState({}, route.path, window.location.origin + route.path);

    if (root.firstChild) {
      root.removeChild(root.firstChild);
    }
    root.appendChild(route.component(navigateTo));
  } else {
    navigateTo('/error');
  }
}

window.onpopstate = () => {
  navigateTo(window.location.pathname);
};

navigateTo(window.location.pathname || defaultRoute);

function initializar() {
  onAuthStateChanged(auth, (user) => {
    const currentRoute = window.location.pathname;
    if (user) {
      navigateTo('/muro');
    } else if (currentRoute === defaultRoute || currentRoute === '/registro') {
      navigateTo(currentRoute);
    } else {
      navigateTo('/error');
    }
  });
}

initializar();
