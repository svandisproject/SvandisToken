const { ZERO_ADDRESS, timetravel } = require("./helpers/common");
const DelayedUpgradeabilityProxyMock = artifacts.require("DelayedUpgradeabilityProxyMock");
const DummyContractSvandisBaseToken = artifacts.require("DummyContractSvandisBaseToken");
const DummyContractSvandisToken = artifacts.require("DummyContractSvandisToken");

contract('DelayedUpgradeabilityProxy', _accounts => {
    const owner = _accounts[0];
    const ONE_HOUR = 60 * 60; // Number of seconds in one hour
    const ONE_DAY = 24 * ONE_HOUR; // Number of seconds in one day
    const ONE_WEEK = 7 * ONE_DAY; // Number of seconds in one week
    const TWO_WEEKS = 2 * ONE_WEEK; // Number of seconds in two weeks
    const FOUR_WEEKS = 4 * ONE_WEEK; // Number of seconds in four weeks

    beforeEach(async function () {
        this.dummyContractSvandisBaseToken = await DummyContractSvandisBaseToken.new({ from: owner });
        this.dummyContractSvandisToken = await DummyContractSvandisToken.new({ from: owner });
        this.proxy = await DelayedUpgradeabilityProxyMock.new(this.dummyContractSvandisBaseToken.address, { from: owner });
    })
    describe('upgradeTo', function () {
        it('sets pending implementation', async function () {
            await this.proxy.upgradeTo(this.dummyContractSvandisToken.address, { from: owner });
            assert.equal(await this.proxy.pendingImplementation(), this.dummyContractSvandisToken.address);
            assert(await this.proxy.pendingImplementationIsSet());
        });
        it('sets pending implementation application date', async function () {
            const { logs } = await this.proxy.upgradeTo(this.dummyContractSvandisToken.address, { from: owner });
            var functionCallTime = web3.eth.getBlock(logs[0].blockNumber).timestamp;
            var deployTime = functionCallTime + FOUR_WEEKS;
            assert.equal(await this.proxy.pendingImplementationApplicationDate(), deployTime);
        });
        it('emits pending implementation changed event', async function () {
            const { logs } = await this.proxy.upgradeTo(this.dummyContractSvandisToken.address, { from: owner });
            assert.equal(logs.length, 1);
            assert.equal(logs[0].event, "PendingImplementationChanged");
            assert.equal(logs[0].args.oldPendingImplementation, ZERO_ADDRESS);
            assert.equal(logs[0].args.newPendingImplementation, this.dummyContractSvandisToken.address);
        });
        
    });
    describe('_willFallback', function () {
        describe('if there is a pending implementation', function () {
            beforeEach(async function () {
                await this.proxy.upgradeTo(this.dummyContractSvandisToken.address, { from: owner });
            });
            describe('does not switch to pending implementation before the application date', function () {
                
                it('one hour', async function() {
                    timetravel(ONE_HOUR);
                    assert.equal(await DummyContractSvandisBaseToken.at(this.proxy.address).hello(), "Konichiwa!");
                })
                it('one day', async function() {
                    timetravel(ONE_DAY);
                    assert.equal(await DummyContractSvandisBaseToken.at(this.proxy.address).hello(), "Konichiwa!");
                })
                it('one week', async function() {
                    timetravel(ONE_WEEK);
                    assert.equal(await DummyContractSvandisBaseToken.at(this.proxy.address).hello(), "Konichiwa!");
                })
                it('two weeks', async function() {
                    timetravel(TWO_WEEKS);
                    assert.equal(await DummyContractSvandisBaseToken.at(this.proxy.address).hello(), "Konichiwa!");
                })
            });
            it('switches to pending implementation after the application date', async function () {
                timetravel(FOUR_WEEKS + ONE_HOUR);
                assert.equal(await DummyContractSvandisBaseToken.at(this.proxy.address).hello(), "Hello!");
            });
        });
        describe('if there is not a pending implementation', function () {
            it('does not switch to pending implementation if there is no pending implementation', async function () {
                assert.equal(await DummyContractSvandisBaseToken.at(this.proxy.address).hello(), "Konichiwa!");
            });
        });
    });
})