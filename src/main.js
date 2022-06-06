import landingPage from './pages/landingPage/landing.js';
import pageLogin from './pages/pageLogin/login.js';
import pageRegister from './pages/pageRegister/register.js';
import pageFeed from './pages/pageFeed/feed.js';

const main = document.querySelector('#root');

const init = async () => {
  main.innerHTML = '';
  const url = window.location.hash;
  console.log(url);
  let page;
  switch (url) {
    case '#login':
      page = pageLogin();
      break;
    case '#register':
      page = pageRegister();
      break;
    case '#feed':
      page = await pageFeed();
      break;
    default:
      page = landingPage();
  }
  console.log(page);
  main.appendChild(page);
};

window.addEventListener('load', init);
window.addEventListener('hashchange', init);
