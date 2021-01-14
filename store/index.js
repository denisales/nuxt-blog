import Cookie from 'js-cookie';

export const state = () => ({
  loadedPosts: [],
  token: null
})

export const mutations = {
  setPosts(state, posts) {
    state.loadedPosts = posts
  },
  addPost(state, post) {
    state.loadedPosts.push(post);
  },
  editPost(state, editedPost) {
    const postIndex = state.loadedPosts.findIndex(post => post.id === editedPost.id);
    state.loadedPosts[postIndex] = editedPost;
  },
  setToken(state, token) {
    state.token = token
  },
  clearToken(state) {
    state.token = null;
  }
}

export const actions = {
  async nuxtServerInit(vuexContext, context) {
    try {
      const { data } = await this.$axios.get(`/posts.json`)
      const postsArray = [];
      for (const key in data) {
        postsArray.push({ ...data[key], id: key })
      }
      vuexContext.commit('setPosts', postsArray);
    } catch (error) {
      context.error(error);
    }
  },
  setPosts({ commit }, posts) {
    commit('setPosts', posts)
  },
  async addPost({ commit, state }, post) {
    const createdPost = { ...post, updatedDate: new Date() }
    try {
      const { data } = await this.$axios.post(`/posts.json?auth=${state.token}`, createdPost);
      commit('addPost', { ...post, id: data.name })
    } catch (error) {
      console.log(error);
    }
  },
  async editPost({ commit, state }, editedPost) {
    try {
      await this.$axios.put(`/posts/${editedPost.id}.json?auth=${state.token}`, editedPost);
      commit('editPost', editedPost)
    } catch (error) {
      console.log(error);
    }
  },

  async authenticateUser({commit, dispatch}, authData) {
    let authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.fbAPIKey}`;
      if (!authData.isLogin) {
        authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.fbAPIKey}`;
      }
      try {
        const { data } = await this.$axios.post(authUrl, {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true,
        });
        commit('setToken', data.idToken)
        localStorage.setItem('token', data.idToken);
        localStorage.setItem('tokenExpiration', new Date().getTime() + +data.expiresIn * 1000);
        Cookie.set('jwt', data.idToken);
        Cookie.set('expirationDate', new Date().getTime() +  +data.expiresIn * 1000);
        await this.$axios.post('http://localhost:3000/api/track-data', {
          data: 'Autheticated'
        });
      } catch (error) {
        console.log(error);
      }
  },
  initAuth({commit, dispatch}, req) {
    let token;
    let expirationDate;
    if(req) {
      if(!req.headers.cookie) {
        return;
      }

      const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('jwt='))
      if(!jwtCookie) {
        return;
      }

      token = jwtCookie.split('=')[1];

      expirationDate = req.headers.cookie.split(';').find(c => c.trim().startsWith('expirationDate=')).split("=")[1];
      if(!expirationDate) {
        return;
      }
    } else if(process.client) {
      token = localStorage.getItem('token');
      expirationDate = localStorage.getItem('tokenExpiration');
    } else {
      token = null;
      expirationDate = null;
    }

    if(new Date().getTime() > +expirationDate || !token) {
      dispatch('logout');
      return;
    }

    commit('setToken', token);
  },
  logout({commit}) {
    commit('clearToken')
    Cookie.remove('jwt');
    Cookie.remove('expirationDate');
    if(process.client) {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
    }

  }
}

export const getters = {
  loadedPosts(state) {
    return state.loadedPosts
  },
  isAuthenticated(state) {
    return state.token != null
  }
}
