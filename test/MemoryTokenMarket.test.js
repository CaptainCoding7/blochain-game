const { assert } = require('chai')

const MemoryToken = artifacts.require('./MemoryToken.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Memory Token', (accounts) => {
  let token

  before(async () => {
    token = await MemoryToken.deployed()
  })


  describe('token market tests', async () => {
    let result

    it('Transfer tokens', async () => {
        //Mint token on account 1
        await token.mint(accounts[0], 'https://www.token-uri.com/nft')

        // transfer 0->1
        await token.transferFrom(accounts[0],accounts[1],1)
        // check balances
        result = await token.balanceOf(accounts[1])
        assert.equal(result.toString(), '1', 'balanceOf is correct')
        result = await token.balanceOf(accounts[0])
        assert.equal(result.toString(), '0', 'balanceOf is correct')

        // check owner
        result = await token.ownerOf('1')
        assert.equal(result, accounts[1], 'ownerOf is correct')

        // test transfer 0->2
        try{
          await token.transferFrom(accounts[0],accounts[2],1)
          result = await token.balanceOf(accounts[2])
          assert.equal(result, '0', 'ownerOf is correct')
        }
        catch(e){
          console.log("\n\tTransfer aborted:  " + accounts[0]+ " doesn't own this token !")
        }

        // affichage ETH
        let ethBalance = web3.utils.fromWei((await web3.eth.getBalance(accounts[0])).toString(), 'ether');
        console.log("\n\tETH Balance of "+ accounts[0] + " : " + ethBalance )

    })
})

})