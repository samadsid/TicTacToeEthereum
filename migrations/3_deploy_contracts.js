const TicTacToeFactory = artifacts.require("TicTacToeFactory");

module.exports = function (deployer) {
  deployer.deploy(TicTacToeFactory);
};
