require('babel-register');
require('babel-polyfill');




module.exports = {
    mocha: {
        enableTimeouts: false,
        before_timeout: 1200000 // Here is 2min but can be whatever timeout is suitable for you.
    },

  networks: {
    development: {
      host: "127.0.0.1",
          port: 8501,
      network_id: "*" // Match any network id
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
