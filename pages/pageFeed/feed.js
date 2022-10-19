import {
  getAuth,
  signOut,
} from 'https://www.gstatic.com/firebasejs/9.7.0/firebase-auth.js';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  getDocs,
  orderBy,
  doc,
  getDoc,
  updateDoc,
} from 'https://www.gstatic.com/firebasejs/9.7.0/firebase-firestore.js';
import app from '../../lib/firebase.js';

const db = getFirestore(app);
const auth = getAuth();
const main = document.querySelector('#root');

const toggleModal = () => {
  document.querySelector('#openModal').classList.toggle('active');
};
const createCardFront = (id, post) => {
  const liked = post.like.includes(auth.currentUser.uid);
  const likeStateClass = liked ? 'fa-solid' : 'fa-regular';
  return `
  <section class="card">
    <div class="post-user">
      <header>
        ${post.userName}<br/>
        @${post.userName}
      </header>
      <main>
        <p> ${post.text} </p>
      </main>
      <footer>
        <div>
          <span> ${post.like.length} </span>
          <form>
            <button id="btn-like" data-post-id="${id}"> 
             <i class="${likeStateClass} fa-heart"></i> 
            </button>
          </form>
        </div>
      </footer>
    </div>
    
  </section>
`;
};
const like = async (button) => {
  console.log(button.dataset.postId);
  const docRef = doc(db, 'Posts', button.dataset.postId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    const user = auth.currentUser;
    const arrayLike = data.like;
    const index = arrayLike.indexOf(user.uid);
    if (index > -1) {
      arrayLike.splice(index, 1);
    } else {
      arrayLike.push(user.uid);
    }
    await updateDoc(docRef, {
      like: arrayLike,
    });
    refreshPage(user);
  } else {
    alert('Unexpected Error ');
  }
};
const buildFeed = (htmlPost) => {
  const container = document.createElement('div');
  const user = auth.currentUser;
  container.innerHTML = `
      <header class="header-feed">
        <div>
          ${user.email}
        </div>
        <img src="./images/meditacao (1).png"/>
        <form>
          <button id="btn-logout" class="btn btn-primary">logout</button>
        </form>
      </header>
      <section class="post-feed">
        ${htmlPost}
      </section>
      <footer id="footer-bar">
        <form>
          <button id="btn-create-post" class="btn btn-secondary"> + </button>
        </form>
      </footer>
      <div id="openModal" class="modalDialog">
        <form>
          <section id="post" class="post">
            <div class="post-container">
              <h2>New Post</h2>
              <textarea class="post-textarea" id="post-textarea" rows="5" cols="5" maxlength="180" placeholder="What do you want to share today?"></textarea>
            </div>
      
          </section>
          <div class="container-btns">
            <button id="btn-post" class="btn btn-secondary">Post</button>
            <button id="btn-cancel" class="btn btn-primary">Cancel</button>
          </div>
        </form>
      </div>
      `;
  container.addEventListener('submit', (event) => {
    event.preventDefault();
    switch (event.submitter.id) {
      case 'btn-create-post':
      case 'btn-cancel':
        toggleModal();
        break;
      case 'btn-post':
        makePost(document.querySelector('#post-textarea').value, user);
        break;
      case 'btn-like':
        like(event.submitter);
        break;
      case 'btn-logout':
        signOut(auth)
          .then(() => {
            window.location.hash = '#login';
          })
          .catch((error) => {
            console.log(error);
          });
        break;
      default:
    }
  });
  return container;
};
const refreshPage = async (user) => {
  const htmlPost = await loadAllPosts(user);
  const container = buildFeed(htmlPost);
  main.innerHTML = '';
  main.appendChild(container);
};
const loadAllPosts = async (user) => {
  const q = query(collection(db, 'Posts'), orderBy('date', 'desc'));
  const querySnapshot = await getDocs(q);
  //const posts = [];
  let htmlPost = '';
  querySnapshot.forEach((doc) => {
    console.log(doc);
    //posts.push(post);
    htmlPost += createCardFront(doc.id, doc.data());
  });
  return htmlPost;
};
const makePost = async (postUser, user) => {
  if (postUser === '') {
    alert('Please enter your post');
    return;
  }
  const newPost = {
    userName: user.displayName,
    text: postUser,
    like: [],
    date: new Date().getTime(),
    userId: user.uid,
  };
  await addDoc(collection(db, 'Posts'), newPost);
  toggleModal();
  refreshPage(user);
};

export default async () => {
  const user = auth.currentUser;

  if (user) {
    const htmlPost = await loadAllPosts(user);
    return buildFeed(htmlPost);
  }
  window.location.hash = '#login';
};
