const { ethers, network } = require("hardhat")
const fs = require("fs")
const FRONT_END_ADDRESSES_FILE =
    "../nextjs-smartcontract-lottery/nextjs-smartcontract-lottery/constants/contractAddresses.json"
const FRONT_END_ABI_FILE =
    "../nextjs-smartcontract-lottery/nextjs-smartcontract-lottery/constants/abi.json"

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        updateContractAddresses()
        updateAbi()
        console.log("Front end written!")
    }
}

async function updateAbi() {
    const raffle = await ethers.getContract("Raffle")
    // to get abi and write into variable
    fs.writeFileSync(FRONT_END_ABI_FILE, raffle.interface.format(ethers.utils.FormatTypes.json))
}
async function updateContractAddresses() {
    const raffle = await ethers.getContract("Raffle")
    const contractAddress = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf-8"))
    const chainId = network.config.chainId.toString()
    if (chainId in contractAddress) {
        if (contractAddress[chainId].includes(raffle.address)) {
            contractAddress[chainId].push(raffle.address)
        }
    } else {
        contractAddress[chainId] = [raffle.address]
    }
    fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(contractAddress))
}

module.exports.tags = ["all", "frontend"]
