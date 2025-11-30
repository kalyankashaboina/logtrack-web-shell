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
            users_app: 'http://localhost:5001/assets/remoteEntry.js',
          audit_app: 'http://localhost:5002/assets/remoteEntry.js'
        },
        shared: federationShared
      })
    ],

    server: {
      port: 3000,
      open: true,
      strictPort: true,
      host: 'localhost'
    },

    define: {
      __DEV__: true,
      __PROD__: false
    }
  })
)
