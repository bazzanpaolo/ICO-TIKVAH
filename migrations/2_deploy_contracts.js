const TIKVAHToken = artifacts.require("TIKVAHToken");

module.exports = function(deployer) {
  deployer.deploy(TIKVAHToken);
};
