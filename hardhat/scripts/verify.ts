import { network } from "hardhat";
const { ethers } = await network.connect("sepolia");
import BoomerangJson from "../artifacts/contracts/Boomerang.sol/Boomerang.json";

import dotenv from "dotenv";
dotenv.config();

const contractAddress = "0xA7d455cf3CeCF4211589f1Da1Fd486812e9f426D";
const provider = new ethers.JsonRpcProvider(
  `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
);

const boomerang = new ethers.Contract(
  contractAddress,
  BoomerangJson.abi,
  provider
);

async function getOwner() {
  const ownerAddress = await boomerang.owner();
  console.log("Contract owner is:", ownerAddress);
}

getOwner();
