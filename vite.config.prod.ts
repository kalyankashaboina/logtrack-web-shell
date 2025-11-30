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
          users_app: 'https://your-domain.com/users/remoteEntry.js',
          audit_app: 'https://your-domain.com/audit/remoteEntry.js'
        },
        shared: federationShared
      })
    ],

    define: {
      __DEV__: false,
      __PROD__: true
    },

    build: {
      minify: 'esbuild',
      sourcemap: false,
      target: 'es2018',
      cssCodeSplit: true
    }
  })
)
