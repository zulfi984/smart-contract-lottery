const { ethers } = require("hardhat")

const networkConfig = {
    default: {
        name: "hardhat",
        keepersUpdateInterval: "30",
    },
    4: {
        name: "rinkeby",
        vrfCoordinatorV2: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
        raffleEntranceFee: ethers.utils.parseEther("0.01"),
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // 30 gwei
        subscriptionId: "0",
        callbackGasLimit: "500000", // 500,000 gas
        keepersUpdateInterval: "30",
    },
    31337: {
        name: "hardhat",
        //we dont need vrfCoordinatorV2 because, it will through mock
        raffleEntranceFee: ethers.utils.parseEther("0.01"),
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // 30 gwei
        subscriptionId: "0",
        callbackGasLimit: "500000", // 500,000 gas
        keepersUpdateInterval: "30",
    },
}

const developmentChains = ["hardhat,localhost"]
module.exports = {
    networkConfig,
    developmentChains,
}
