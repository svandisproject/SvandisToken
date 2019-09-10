var TokenProxy = artifacts.require("./TokenProxy.sol");
var SvandisToken = artifacts.require("./SvandisToken.sol");
var BalanceSheet = artifacts.require("./BalanceSheet.sol");
var AllowanceSheet = artifacts.require("./AllowanceSheet.sol");

module.exports = function(deployer, network, accounts) {
  let owner = accounts[0];
  console.log('owner of proxy contract: ' + owner)
  deployer.deploy(TokenProxy, SvandisToken.address, BalanceSheet.address, AllowanceSheet.address, "Svandis", 18, "AKRO", {from:owner});

};
