// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");

    return config;
  },
  env: {
    FAUNA_DB_URI: process.env.FAUNA_DB_URI,
  },
};
