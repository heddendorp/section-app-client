import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'ou6wvq',
  e2e: {
    baseUrl: 'http://localhost:4000',
    experimentalSessionAndOrigin: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
