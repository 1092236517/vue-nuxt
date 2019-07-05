const pkg = require('./package')
const webpack = require('webpack')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/zhuniu.ico' }
    ]
  },
  

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#ffa6a6',height: '5px' },

  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    'video.js/dist/video-js.css',
    {src:'~/assets/less/common.less',lang:"less"}
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/common.js',
    '@/plugins/element-ui',
    '~/plugins/request.js',
    { src: '~/plugins/nuxt-video-player-plugin.js', ssr: false }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Simple usage
    'cookie-universal-nuxt',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    transpile: [/^element-ui/],
    plugins: [
      new webpack.ProvidePlugin({
        // '$':'jquery'
      }),
    ],
    
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      
    }
  },
  router: {
    // middleware: 'auth'
    extendRoutes (routes, resolve) {
      routes.push({
        name: 're-detail-id.html',
        path: '/detail/:id.html',
        component: resolve(__dirname, 'pages/detail/id.html.vue')
      },{
        name: 're-search-value.html',
        path: '/search/:value.html',
        component: resolve(__dirname, 'pages/search/value.html.vue')
      })
    }
  } 
}
