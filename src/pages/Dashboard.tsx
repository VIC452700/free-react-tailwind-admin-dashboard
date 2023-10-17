import React from 'react';
import { useState } from 'react';
import { ethers } from 'ethers';
import { getEthersProvider } from '../utils/getEthersProvider.js';
import { getEthersSigner } from '../utils/getEthersSigner.js';

import CardOne from '../components/CardOne.js';
import CardTwo from '../components/CardTwo.js';
import CardThree from '../components/CardThree.js';
import CardFour from '../components/CardFour.js';
import ChartThree1 from '../components/ChartThree1.js';
import ChartThree2 from '../components/ChartThree2.js';
import ChartThree3 from '../components/ChartThree3.js';
import TokenVault from '../abi/TokenVault.json';
import Earn from './Earn.js';

declare let window: any;

const Dashboard = (props: any) => {
  const [depositedAmount, setDepositedAmount] = useState('');

  // const vaultAddress = '0xe810399b60f1Fb94EfdF9826Cb9e378E44b85206'; // origin no withdraw
  const vaultAddress = '0x4B3f9d86535FDe6f38f5C623D2b4dF5cE8989e41'; 
  // const ethSepoliaId = '0xaa36a7'; // Sepolia 11155111
  // const ethMainnetId = '0x1'; // Ethereum 1
  // if (id === ethSepoliaId) {
  //  handleConnectClick();
  // } 
  // else {
  //   alert("Please connect sepolia testnet.");
  //   return;
  // }

   const handleConnectClick = async () => {
    await connectMetaMask();
  };

  handleConnectClick();

  async function connectMetaMask() {
    // const provider = new ethers.AlchemyProvider('https://eth-sepolia.g.alchemy.com/v2/Z66PxY86kCkFslToB82DiSM531OnIyHS');
    // const provider = getEthersProvider();
    // console.log("-------------> chainID", (await provider.getNetwork()).chainId);
    // const signer = getEthersSigner();
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();  
      
    const accountAddress = await signer.getAddress();
    const tokenVault = new ethers.Contract(vaultAddress, TokenVault, signer);

    let amountOfLP = await tokenVault.balanceOf(accountAddress);
    const depositedAmount = ethers.formatEther(amountOfLP);
    const formattedAmount = parseFloat(depositedAmount).toFixed(3);
    setDepositedAmount(formattedAmount);
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

export default Dashboard;
