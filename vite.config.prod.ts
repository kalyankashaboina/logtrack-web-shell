import { mergeConfig, defineConfig } from 'vite'
import base from './vite.config.base'
import federation from '@originjs/vite-plugin-federation'
import { federationShared } from './vite.config.base'

export default mergeConfig(
  base,
  defineConfig({
    plugins: [
      federation({
        name: 'host',
        remotes: {
          users_app: 'https://logtrack-users-microfrontend.vercel.app/assets/remoteEntry.js',
          audit_app: 'https://logtrack-audit-microfrontend.vercel.app/assets/remoteEntry.js'
        },
        shared: federationShared
      })
    ],

    define: {
      __DEV__: false,
      __PROD__: true,

    
      'import.meta.env.VITE_USERS_REMOTE':
        JSON.stringify('https://logtrack-users-microfrontend.vercel.app/assets/remoteEntry.js'),

      'import.meta.env.VITE_AUDIT_REMOTE':
        JSON.stringify('https://logtrack-audit-microfrontend.vercel.app/assets/remoteEntry.js')
    },

    build: {
      target: 'esnext',
      minify: 'esbuild',
      sourcemap: false,
      cssCodeSplit: true
    }
  })
)
