module.exports = {
  preset: "jest-puppeteer",
  globals: {
    url: "http://localhost:8080/",
  },
  testMatch: ['**/__e2e_tests__/**/*e2e.js'], 
  setupFilesAfterEnv: ["./src/__e2e_tests__/setup.js"]
};
