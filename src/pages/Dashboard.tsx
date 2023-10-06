import React from 'react';
import { useState } from 'react';
import { ethers } from 'ethers';

import CardOne from '../components/CardOne.js';
import CardTwo from '../components/CardTwo.js';
import CardThree from '../components/CardThree.js';
import CardFour from '../components/CardFour.js';
import ChartThree1 from '../components/ChartThree1.js';
import ChartThree2 from '../components/ChartThree2.js';
import ChartThree3 from '../components/ChartThree3.js';
import Earn from './Earn.js';
import TokenVault from '../abi/TokenVault.json';

declare let window: any;

const ECommerce = (props: any) => {
  const [depositedAmount, setDepositedAmount] = useState('');
  const [vaultName, setVaultName] = useState('');
  const [vaultSymbol, setVaultSymbol] = useState('');
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [token0, setToken0] = useState('');
  const [token1, setToken1] = useState('');
  const [tokenXXX, setTokenXXX] = useState('');
  const [lpToken, setLPToken] = useState('');
  const [inputs, setInputs] = useState({
    Asset: '',
    Share: '',
  });

  // ------------------------------------------ Step 2 --------------------------------------
  const [spcAmount, setSpcAmount] = useState('');
  const [wethAmount, setWethAmount] = useState('');
  const [shareAmount, setShareAmount] = useState('');
  const [inputSwapAmount, setInputSwapAmount] = useState('');
  const [outputSwapAmount, setOutputSwapAmount] = useState('');
  const [currentValue, setCurrentValue] = useState('0');
  const [treasuryInfo, setTreasuryInfo] = useState(
    {
      treasuryAddress: '',
      spcAmount: '',
      wethAmount: ''
    }
  );

  // ------------------------------------------ Step 1 --------------------------------------
  const wethAddress = '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14';
  const spcAddress = '0xe2B0E50603Cd62569A94125628D796ad21339299';
  const xxxAddress = '0xe11B03C04e87430F8EAd92b245625c88c176C044';
  // const vaultAddress = '0xe810399b60f1Fb94EfdF9826Cb9e378E44b85206'; // origin no withdraw
  const vaultAddress = '0x4B3f9d86535FDe6f38f5C623D2b4dF5cE8989e41'; 

  const handleConnectClick = async () => {
    await connectMetaMask();
  };

  let id = window.ethereum.chainId;
  const ethSepoliaId = '0xaa36a7'; // Sepolia 11155111
  const ethMainnetId = '0x1'; // Ethereum 1
  if (id === ethSepoliaId) {
    handleConnectClick();
  } else {
    alert("Please connect sepolia testnet.");
    return;
  }

  async function connectMetaMask() {
    //const provider = new ethers.AlchemyProvider('https://eth-sepolia.g.alchemy.com/v2/Z66PxY86kCkFslToB82DiSM531OnIyHS');
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();    

    const accountAddress = await signer.getAddress();
    setAccount(accountAddress);

    let id = await window.ethereum.chainId;
    if (id === ethMainnetId) return;
    
    const tokenVault = new ethers.Contract(vaultAddress, TokenVault, signer);

    // Get balance of ETH
    const balanceWei = await provider.getBalance(accountAddress);
    const balanceEth = ethers.formatEther(balanceWei);
    setBalance(balanceEth);

    let amountOfLP = await tokenVault.balanceOf(accountAddress);
    
    const depositedAmount = ethers.formatEther(amountOfLP);
    const formattedAmount = parseFloat(depositedAmount).toFixed(3);
    // alert(formattedAmount);
    
    setDepositedAmount(formattedAmount);

    // let userInfo = await tokenVault.getUserInfo(accountAddress);
    // console.log("\tuser address ", userInfo._address);
    // console.log("\tuser _depositAmountOfToken0 ", userInfo._depositAmountOfToken0);
    // console.log("\tuser _depositAmountOfToken1 ", userInfo._depositAmountOfToken1);
    // console.log("\tuser _lastDepositedTime ", userInfo._lastDepositedTime);
    // console.log("\tuser _lastClaimedTime ", userInfo._lastClaimedTime);
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardOne depositedAmount = {depositedAmount}/>
        <CardTwo />
        <CardThree />
        <CardFour />
      </div>
      <div className='border-t mt-4'>
      <h1 className='mt-4 font-bold'>Overview</h1>
      <div className="grid mt-4 grid-cols-3 gap-4 md:grid-cols-1 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
        <ChartThree1 />
        <ChartThree2 />
        <ChartThree3 />
      </div>
      </div>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-12">
          <Earn />
        </div>
      </div>
    </>
  );
};

export default ECommerce;
