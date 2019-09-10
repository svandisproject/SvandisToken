const { SvandisBaseToken_Tests } = require('./SvandisBaseToken.js');
const { SvandisBaseToken, BalanceSheet, AllowanceSheet } = require('./helpers/common');
const { CommonVariables, ZERO_ADDRESS, expectThrow } = require('./helpers/common');

contract('SvandisBaseToken', _accounts => {
    const commonVars = new CommonVariables(_accounts);
    const owner = commonVars.owner
    const tokenHolder = commonVars.user
    const otherAccount = commonVars.user2
    
    beforeEach(async function () {
        // Set up TokenStorage
        this.allowances = await AllowanceSheet.new( {from:owner })
        this.balances = await BalanceSheet.new({ from:owner })

        // Set up Token
        this.SvandisBaseToken = await SvandisBaseToken.new(this.balances.address, this.allowances.address, {from:owner})

        // If Token does not own storage contracts, then the storage contracts must
        // transfer ownership to the token contract and then the token must claim
        // ownership to complete two stage ownership transfer
        await this.allowances.transferOwnership(this.SvandisBaseToken.address)
        await this.balances.transferOwnership(this.SvandisBaseToken.address)
        await this.SvandisBaseToken.claimBalanceOwnership()
        await this.SvandisBaseToken.claimAllowanceOwnership()
    })


    describe("SvandisBaseToken Token behavior tests", function () {
        SvandisBaseToken_Tests(owner, tokenHolder, otherAccount);
    });
})
