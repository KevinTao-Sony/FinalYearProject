require('babel-register');
require('babel-polyfill');




module.exports = {
    mocha: {
        enableTimeouts: false,
        before_timeout: 1200000 // Here is 2min but can be whatever timeout is suitable for you.
    },

  networks: {
    POA: {
      host: "127.0.0.1",
          port: 8545,
          network_id: "*", // Match any network id
          gas:67219750,
          gasPrice: 1,
          from: '0x13A7C7508335D85BF86c85e57fB9d4D1CCe1DeB5'
      },
    ganache: {
      host: "127.0.0.1",
        port: 7545,
      network_id: "*" // Match any network id
      },

     test: {
          host: "127.0.0.1",
          port: 8545,
          network_id: "*"
      }
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
