const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

!network.config.chainId == 31337
    ? describe.skip
    : describe("Raffle Unit test", function () {
          let player, vrfCoordinatorV2Mock, raffle, raffleContract, raffleEntranceFee, interval
          beforeEach(async () => {
              accounts = await ethers.getSigners()
              player = accounts[1] //   accounts[1] is deployer
              await deployments.fixture(["mocks", "raffle"])
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
              raffleContract = await ethers.getContract("Raffle")
              raffle = await raffleContract.connect(player)
              raffleEntranceFee = await raffle.getEntranceFee()
              interval = await raffle.getInterval()
          })

          describe("constructor", function () {
              it("intitiallizes the raffle correctly", async () => {
                  // Ideally, we'd separate these out so that only 1 assert per "it" block
                  // And ideally, we'd make this check everything
                  const raffleState = (await raffle.getRaffleState()).toString()
                  // Comparisons for Raffle initialization:
                  console.log(interval.toString())
                  assert.equal(raffleState, "0")

                  assert.equal(
                      interval.toString(),
                      networkConfig[network.config.chainId]["keepersUpdateInterval"]
                  )
              })
          })
          describe("enterRaffle", function () {
              it("reverts when you don't pay enough", async () => {
                  await expect(raffle.enterRaffle()).to.be.revertedWith(
                      "Raffle__SendMoreToEnterRaffle"
                  )
              })
              it("records player when they enter", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  const contractPlayer = await raffle.getPlayer(0)
                  assert.equal(player.address, contractPlayer)
              })
              it("emits event on enter", async () => {
                  await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.be.emit(
                      raffle, // token
                      "RaffleEnter" // Emit Function name
                  )
              })
              it("doesn't allow entrance when raffle is calculating", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  // for a documentation of the methods below, go here: https://hardhat.org/hardhat-network/reference
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  // we pretend to be a keeper for a second
                  await raffle.performUpkeep([]) // changes the state to calculating for our comparison below
                  await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.be.revertedWith(
                      // is reverted as raffle is calculating
                      "Raffle__RaffleNotOpen"
                  )
              })
          })
      })
