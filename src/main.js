// importar
import home  from './components/home.js';
import error from './components/error404.js';

const routes = [
  { path: '/', component: home },
  { path: '/error', component: error },
];

const defaultRoute = '/';
const root = document.getElementById('root')

function navigateTo(hash){
  const route = routes.find((routeFound) => routeFound.path === hash);

  if(route && route.component){
    window.history.pushState(
      {},
      route.path,
      window.location.origin + route.path,
    );

    if(root.firstChild){
      root.removeChild(root.firstChild);
    }
    root.appendChild(route.component(navigateTo))
  }else{
    navigateTo('/error');
  }
  
}

window.onpopstate = () => {
  navigateTo(window.location.pathname);
};

navigateTo(window.location.pathname || defaultRoute);