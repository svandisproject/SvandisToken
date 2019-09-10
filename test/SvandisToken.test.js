const { SvandisToken_Tests } = require('./SvandisToken.js');
const { SvandisToken, BalanceSheet, AllowanceSheet } = require('./helpers/common');
const { CommonVariables, ZERO_ADDRESS, expectThrow } = require('./helpers/common');

contract('SvandisToken', _accounts => {
    const commonVars = new CommonVariables(_accounts);
    const owner = commonVars.owner
    const tokenHolder = commonVars.user
    const otherAccount = commonVars.user2
    
    beforeEach(async function () {
        // Set up TokenStorage
        this.allowances = await AllowanceSheet.new( {from:owner })
        this.balances = await BalanceSheet.new({ from:owner })

        // Set up Token
        this.SvandisToken = await SvandisToken.new(this.balances.address, this.allowances.address, {from:owner})

        // If Token does not own storage contracts, then the storage contracts must
        // transfer ownership to the token contract and then the token must claim
        // ownership to complete two stage ownership transfer
        await this.allowances.transferOwnership(this.SvandisToken.address)
        await this.balances.transferOwnership(this.SvandisToken.address)
        await this.SvandisToken.claimBalanceOwnership()
        await this.SvandisToken.claimAllowanceOwnership()
    })


    describe("SvandisToken Token behavior tests", function () {
        SvandisToken_Tests(owner, tokenHolder, otherAccount);
    });
})
