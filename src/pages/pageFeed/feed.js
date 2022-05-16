import {
  getAuth,
  signOut,
} from 'https://www.gstatic.com/firebasejs/9.7.0/firebase-auth.js';

export default () => {
  const container = document.createElement('div');
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    container.innerHTML = `<div>
        ${user.email}
      </div>
      <form>
        <button class = "btn btn-primary">logout</button>
      </form>
      <footer id= "footer-bar">
        <form>
          <button id="btn-create-post" class = "btn btn-secondary"> + </button>
        </form>
      </footer>
      <div id="openModal" class="modalDialog">
        <form>
          <h2>Modal Box</h2>
          <p>This is a sample modal box that can be created using the powers of CSS3.</p>
          <p>You could do a lot of things here like have a pop-up ad that shows when your website loads, or create a login/register form for users.</p>
          <button id="btn-cancel" class="btn btn-primary">Cancel</button>
          <button id="btn-post" class="btn btn-secondary">Post</button>
        </form>
      </div>
      `;
    container.addEventListener('submit', (event) => {
      event.preventDefault();
      switch (event.submitter.id) {
        case 'btn-create-post':
        case 'btn-cancel':
          document.querySelector('#openModal').classList.toggle('active');
          break;

        default:
          signOut(auth)
            .then(() => {
              window.location.hash = '#login';
            })
            .catch((error) => {
              console.log(error);
            });
      }
    });
  } else {
    window.location.hash = '#login';
  }
  return container;
};
