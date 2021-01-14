import bodyParser from 'body-parser';
import axios from 'axios';

export default {
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  mode: 'universal',
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: 'WD Blog',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'My cool Web development Blog' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap' }
    ]
  },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/styles/main.css'
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    '@/plugins/date-filter.js'
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/pwa',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: ['@nuxtjs/axios'],

  axios: {
    baseURL: process.env.BASE_URL || 'https://nuxt-blog-5ee3e-default-rtdb.firebaseio.com',
    credetials: false,
  },
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
  },

  loading: {
    color: '#48bb78',
    height: '5px',
    duration: 5000
  },
  loadingIndicator: {
    name: 'circle'
  },

  env: {
    baseUrl: process.env.BASE_URL,
    fbAPIKey: process.env.FP_API_KEY
  },

  transition: {
    name: 'fade',
    mode: 'out-in'
  },

  serverMiddleware: [
    bodyParser.json(),
    '@/api'
  ],
  generate: {
    routes: function() {
      return axios.get('https://nuxt-blog-5ee3e-default-rtdb.firebaseio.com/posts.json')
      .then(res => {
        const routes = [];
        for (const key in res.data) {
          routes.push({route: '/posts/' + key, payload: {postData: res.data[key]}})
        }
        return routes
      })
    }
  }
}
