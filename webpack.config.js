// cypress.config.js
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // node event'lerini burada kurabilirsiniz
      on("before:browser:launch", (browser = {}) => {
        console.log("Browser launching: ", browser);
      });
      return config;
    },
    baseUrl: "http://localhost:3000",
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
  },
});
