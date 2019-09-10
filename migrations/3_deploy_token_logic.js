var SvandisToken = artifacts.require("./SvandisToken.sol");

module.exports = function(deployer, network, accounts) {
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  let owner = accounts[0];
  console.log('owner of token contracts: ' + owner)
  deployer.deploy(SvandisToken, ZERO_ADDRESS, ZERO_ADDRESS, "", 0, "", {from:owner});
};
