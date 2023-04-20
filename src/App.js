import { useState } from 'react';
import './App.css';

function App() {

  let [loggedInUser, setLoggedInUser] = useState(null);
  let [formLogInMode, setFormLogInMode] = useState(true);
  let [posts, setPosts] = useState([]);
  let [text, setText] = useState('Welcome to the Simple Social media API!');
  let [postText, setPostText] = useState('');
  let [userName, setUserName] = useState('')


  const start = () => {

    fetch("http://localhost:3000/")
      .then(response => response.text()).then((result) => {
        setText(result);
      }).catch((e) => {
        setText(`${e}`);
      });
  }

  const refreshPosts = () => {
    fetch("http://localhost:3000/posts", { credentials: "include" })
      .then(response => response.json())
      .then(existingPosts => {
        if (Array.isArray(existingPosts)) {
          setPosts(existingPosts);
        }
      })
      .catch(error => {
        console.error(error);
      })
  }



  const register = async () => {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(
        {
          "name": `${userName}`
        }
      )
    });

    if (response.ok) {
      setLoggedInUser(userName)
    }

    login();
  }

  const logout = async () => {
    const response = await fetch("http://localhost:3000/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    });

    if (response.ok) {
      setLoggedInUser(null);
    }
  }

  const login = async () => {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(
        {
          "name": userName
        }
      )
    });

    if (response.ok) {
      setLoggedInUser(userName);
      refreshPosts();
    }
    else {

    }
  }

  const createPost = async () => {
    const response = await fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(
        {
          "content": postText
        }
      )
    });
    if (response.ok) {
      refreshPosts();
    }
  }
  const deletePost = async (id) => {
    const response = await fetch(`http://localhost:3000/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    });

    if (response.ok) {
      refreshPosts();
    }
  }



  const sumbitPostForm = (event) => {
    event.preventDefault();
    const form = event.target;

    createPost();

    setPostText('');
    form.reset();

  }

  const likePost = async (id) => {
    const response = await fetch(`http://localhost:3000/posts/${id}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    });
    if (response.ok) {
      refreshPosts();
    }
  }

  const sumbitTheForm = (event) => {
    event.preventDefault();
    const form = event.target;

    formLogInMode ? login() : register();

    form.reset();

  }

  const clickChangeFormButton = () => {
    setFormLogInMode(!formLogInMode);
  }



  return (
    <div className="App">
      <header className="App-header">

        <div>
          {
            loggedInUser ?
              <div> <button type="button" onClick={() => { logout() }}>Log out</button>
                <form onSubmit={sumbitPostForm}>
                  <div>
                    <input onChange={(e) => setPostText(e.target.value)} value={postText} type="text" name="postext" />
                    <button type="submit">Post</button>
                    <div>
                      {
                        posts.map((post, index) => {
                          return <div style={{ border: '1px solid  white', borderRadius: '5px', padding: '10px' }}>
                            <row>
                              <label style = {{margin: '10px'}}>
                                {`${post.content} | likes: ${post.likes}`}
                              </label>
                              {post.userName === loggedInUser ? <button type="button" style={{color: 'white', backgroundColor: 'red'}} onClick={() => deletePost(post.id)}>X</button> : <button type="button" style={{color: 'white', backgroundColor: 'green'}} onClick={() => likePost(post.id)}>^</button>}
                            </row>
                          </div>
                        })
                      }
                    </div>
                  </div>
                </form>
              </div> :
              <form onSubmit={sumbitTheForm}>
                <div>
                  <input onChange={(e) => setUserName(e.target.value)} value={userName} type="text" name="register" />
                  {formLogInMode ? <button type="submit">Login</button> : <button type="submit">Register</button>}
                  <button type="button" onClick={() => { clickChangeFormButton() }}>{`${formLogInMode ? 'Register' : 'Login'} instead`}</button>
                </div>
              </form>

          }
          <div>

          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
