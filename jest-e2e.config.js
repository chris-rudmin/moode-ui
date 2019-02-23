process.env.START_APP_SERVER = "true";

module.exports = {
  preset: "jest-puppeteer",
  globals: {
    url: "http://localhost:8080/",
  },
  testMatch: ['**/__e2e_tests__/**/*e2e.js'], 
  setupTestFrameworkScriptFile: "./src/__e2e_tests__/setup.js"
};
