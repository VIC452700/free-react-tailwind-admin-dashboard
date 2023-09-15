import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import CardFour from '../components/CardFour.tsx';
import CardFive from '../components/CardFive.tsx';
import CardOne from '../components/CardOne.tsx';
import CardThree from '../components/CardThree.tsx';
import CardTwo from '../components/CardTwo.tsx';
import ChartThree4 from '../components/ChartThree4.tsx';
import DepositWithdraw from './DepositWithdraw.tsx';

import TokenVault from '../abi/TokenVault.json';

declare let window: any;

const Vault = () => {
  const [depositedAmount, setDepositedAmount] = useState('');

  const vaultAddress = '0xe810399b60f1Fb94EfdF9826Cb9e378E44b85206'; 

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

    let id = await window.ethereum.chainId;
    if (id === ethMainnetId) return;
    
    const tokenVault = new ethers.Contract(vaultAddress, TokenVault, signer);

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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-5 2xl:gap-7.5">
        <CardOne depositedAmount = {depositedAmount}/>
        <CardTwo />
        <CardThree />
        <CardFour />
        <CardFive />
      </div>
      
      <div className='border-t mt-4'>
        <h1 className='mt-4 font-bold'>Overview</h1>
        <div className="flex mt-4 grid-cols-3 gap-4 md:grid-cols-1 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
          <ChartThree4 />
          <DepositWithdraw />
        </div>
      </div>
    </>
  );
};

export default Vault;
