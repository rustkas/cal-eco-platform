var express = require("express");
var router = express.Router();
const { ethers } = require("ethers");
const ethUtil = require("ethereumjs-util");
const ethereum_address = require("ethereum-address");
const { createError } = require('../utils/response');

const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed1.binance.org:443');

var abi =[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"string","name":"hash","type":"string"},{"internalType":"string","name":"metadata","type":"string"}],"name":"awardItem","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}]

exports.mint = async (request, response, next) => {
  let fromAddress = request.body.from_address;
  let privateKey = request.body.from_private_key;
  let hash = request.body.hash;
  let contractAddress = request.body.contract_address;
  let to_address = request.body.to_address;
  let tokenMetaData = request.body.tokenMetaData;

  try {
    const bbal = await provider.getBalance(fromAddress);

    if (bbal == "0") {
      response.status(400).json("You do not have insufficient balance");
    }

    const contract = new ethers.Contract(contractAddress, abi, provider);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contractWithSigner = contract.connect(wallet);

    try{
      var newTokenID = await contract.awardItem(to_address, hash, tokenMetaData);
      console.log('newTokenID', newTokenID);
    } catch(funErr){
      return response.status(400).json({
        msg: `Bad Request - Hash already exists`
      });
    }

    const tx = await contractWithSigner.awardItem(to_address, hash, tokenMetaData, {
      gasLimit: 500000
    });

    console.log("Transaction hash:", tx.hash);
    
    return response.status(200).json({
      msg: "Transaction is in mining state. For more info please watch transaction hash on BSC explorer",
      hash: tx.hash,
      newTokenID: parseInt(newTokenID)
    });

  } catch (e) {
    next(createError('Invalid transaction signing', 400));
  }
}

exports.approve = async (request, response, next) => {
  let fromAddress = request.body.from_address;
  let privateKey = request.body.from_private_key;
  let tokenId = request.body.tokenId;
  let contractAddress = request.body.contract_address;
  let to_address = request.body.to_address;

  try {
    const bbal = await provider.getBalance(fromAddress);

    if (bbal == "0") {
      response.status(400).json("You do not have insufficient balance");
    }

    const contract = new ethers.Contract(contractAddress, abi, provider);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contractWithSigner = contract.connect(wallet);

    const tx = await contractWithSigner.approve(to_address, tokenId, {
      gasLimit: 500000
    });

    console.log("Transaction hash:", tx.hash);
    
    return response.status(200).json({
      msg: "Transaction is in mining state. For more info please watch transaction hash on BSC explorer",
      hash: tx.hash,
    });

  } catch (e) {
    next(createError('Invalid transaction signing', 400));
  }
}

exports.getApprove = async (request, response, next) => {
  let tokenId = request.body.tokenId;
  let contractAddress = request.body.contract_address;

  try {
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const resData = await contract.getApproved(tokenId);
    
    console.log(resData);
    return response.status(200).json({
      res: resData 
    });
  } catch (e) {
    next(createError('Invalid transaction signing', 400));
  }
}

exports.ownerOf = async (request, response, next) => {
  let tokenId = request.body.tokenId;
  let contractAddress = request.body.contract_address;

  try {
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const resData = await contract.ownerOf(tokenId);
    
    console.log(resData);
    return response.status(200).json({
      res: resData 
    });
  } catch (e) {
    next(createError('Invalid transaction signing', 400));
  }
}

exports.transfer = async (request, response, next) => {
  let fromAddress = request.body.from_address;
  let privateKey = request.body.from_private_key;
  let tokenId = request.body.tokenId;
  let contractAddress = request.body.contract_address;
  let to_address = request.body.to_address;

  try {
    const bbal = await provider.getBalance(fromAddress);

    if (bbal == "0") {
      response.status(400).json("You do not have insufficient balance");
    }

    const contract = new ethers.Contract(contractAddress, abi, provider);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contractWithSigner = contract.connect(wallet);

    const tx = await contractWithSigner.transferFrom(fromAddress, to_address, tokenId, {
      gasLimit: 300000
    });

    console.log("Transaction hash:", tx.hash);
    
    return response.status(200).json({
      msg: "Transaction is in mining state. For more info please watch transaction hash on BSC explorer",
      hash: tx.hash,
    });

  } catch (e) {
    next(createError('Invalid transaction signing', 400));
  }
}

exports.createWallet = async (request, response, next) => {
  try {
    const wallet = ethers.Wallet.createRandom();
    console.log(wallet);

    return response.status(200).json({
      wallet: {
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic
      }
    });
  } catch (e) {
    next(createError('Something went wrong', 500));
  }
}

exports.getBalance = async (request, response, next) => {
  let address = request.body.address;
  try {
    const balance = await provider.getBalance(address);
    console.log(balance);

    return response.status(200).json({
      balance: ethers.utils.formatEther(balance),
      currency: 'BNB' 
    });
  } catch (e) {
    next(createError('Something went wrong', 500));
  }
}
