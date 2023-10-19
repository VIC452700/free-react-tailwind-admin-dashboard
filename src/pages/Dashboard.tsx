import React from 'react';
import { useState } from 'react';
import { getWalletClient } from '@wagmi/core'
import { BrowserProvider, Eip1193Provider, JsonRpcSigner, ethers } from 'ethers';

import Earn from './Earn.js';
import TokenVault from '../abi/TokenVault.json';
import CardOne from '../components/CardOne.js';
import CardTwo from '../components/CardTwo.js';
import CardThree from '../components/CardThree.js';
import CardFour from '../components/CardFour.js';
import ChartThree1 from '../components/ChartThree1.js';
import ChartThree2 from '../components/ChartThree2.js';
import ChartThree3 from '../components/ChartThree3.js';
import { getEthersProvider } from '../utils/getEthersProvider.js';

const Dashboard = () => {
  const [depositedAmount, setDepositedAmount] = useState(''); 

  const handleConnectClick = async () => {
    await connectWallet();
  };

  handleConnectClick();

  async function connectWallet() {
    const _provider = getEthersProvider();
    const chainId: number = Number((await _provider.getNetwork()).chainId);
    
    const walletClient = await getWalletClient({ chainId });
    const network = {
      chainId: walletClient?.chain.id,
      name: walletClient?.chain.name,
      ensAddress: walletClient?.chain.contracts?.ensRegistry?.address,
    }
    const transport = walletClient?.transport as Eip1193Provider; // Ensure transport is of type Eip1193Provider
    const accountAddress = walletClient?.account.address;
    // console.log("-------------> chainID", chainId);
    // console.log("-------------> account", accountAddress);

    const provider = new BrowserProvider(transport, network)
    const signer = new JsonRpcSigner(provider, accountAddress as string);
    const vaultAddress = '0x4B3f9d86535FDe6f38f5C623D2b4dF5cE8989e41';
    const tokenVault = new ethers.Contract(vaultAddress, TokenVault, signer);

    let amountOfLP = await tokenVault.balanceOf(accountAddress);
    const depositedAmount = ethers.formatEther(amountOfLP);
    const formattedAmount = parseFloat(depositedAmount).toFixed(3);
    setDepositedAmount(formattedAmount);
    // console.log("------------------> LP token amount", amountOfLP);
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
