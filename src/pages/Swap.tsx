import React from 'react';
import { useState } from 'react';
import { getWalletClient } from '@wagmi/core'
import { BrowserProvider, Eip1193Provider, JsonRpcSigner, ethers } from 'ethers';
import { Tab, initTE } from 'tw-elements';

import WETH from '../abi/WETH.json';
import XXXToken from '../abi/XXXToken.json';
import SpaceCredit from '../abi/SpaceCredit.json';
import TokenVault from '../abi/TokenVault.json';
import SwapGroup from '../components/SwapGroup';
import { getEthersProvider } from '../utils/getEthersProvider.js';

initTE({ Tab });

function Swap() {
  const [currentValue0, setCurrentValue0] = useState('0');
  const [currentValue1, setCurrentValue1] = useState('0');
  const [inputSwapAmount, setInputSwapAmount] = useState('');
  const [outputSwapAmount, setOutputSwapAmount] = useState('');

  const wethAddress = '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14';
  const spcAddress = '0xe2B0E50603Cd62569A94125628D796ad21339299';
  const xxxAddress = '0xe11B03C04e87430F8EAd92b245625c88c176C044';
  const vaultAddress = '0x4B3f9d86535FDe6f38f5C623D2b4dF5cE8989e41';

  const handleCurrentValue0Change = (e: any) => {
    setCurrentValue0(e.target.value);
  };

  const handleCurrentValue1Change = (e: any) => {
    setCurrentValue1(e.target.value);
  };
  
  const handleInputSwapChange = (e: any) => {
    setInputSwapAmount(e.target.value);
    setOutputSwapAmount(AutoExtractTokenAmount(e.target.value));
  };

  const handleOutputSwapChange = (e: any) => {
    setOutputSwapAmount(e.target.value);
    setInputSwapAmount(AutoExtractTokenAmount(e.target.value));
  };

  function AutoExtractTokenAmount(baseTokenAmount: string) {
    const inAmount = Number(baseTokenAmount);
    const outAmount = (100000 * inAmount * 0.997) / (100000 + inAmount * 0.997);
    return outAmount.toString();
  }

  const handleSwapClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (currentValue0 == currentValue1) { alert("These are same tokens!"); return; }

    if (currentValue0 == '0' && currentValue1 == '1'){ // SPC-WETH
      swapExactToken0ForToken1_(spcAddress, wethAddress, inputSwapAmount, '01');
    }
    if (currentValue0 == '1' && currentValue1 == '0'){ // WETH-SPC
      swapExactToken0ForToken1_(wethAddress, spcAddress, inputSwapAmount, '10');
    }
    if (currentValue0 == '0' && currentValue1 == '2'){ // SPC-XXX
      swapExactToken0ForToken1_(spcAddress, xxxAddress, inputSwapAmount, '02');
    }
    if (currentValue0 == '2' && currentValue1 == '0'){ // XXX-SPC
      swapExactToken0ForToken1_(xxxAddress, spcAddress, inputSwapAmount, '20');
    }
    if (currentValue0 == '1' && currentValue1 == '2'){ // WETH-XXX
      swapExactToken0ForToken1_(wethAddress, xxxAddress, inputSwapAmount, '12');
    }
    if (currentValue0 == '2' && currentValue1 == '1'){ // XXX-WETH
      swapExactToken0ForToken1_(xxxAddress, wethAddress, inputSwapAmount, '21');
    }
  };

  async function swapExactToken0ForToken1_(token0Address: string, token1Address: string, inputSwapAmount: string, flag:string) {
    try {
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
      // let id = await window.ethereum.chainId;
      // if (id === ethMainnetId) return;

      const provider = new BrowserProvider(transport, network)
      const signer = new JsonRpcSigner(provider, accountAddress as string);
      
      const tokenVault = new ethers.Contract(vaultAddress, TokenVault, signer);
      const spcToken = new ethers.Contract(spcAddress, SpaceCredit, signer);
      const wethToken = new ethers.Contract(wethAddress, WETH, signer);
      const xxxToken = new ethers.Contract(xxxAddress, XXXToken, signer);

      const shareEther = ethers.parseUnits(inputSwapAmount, 'ether');
      if (flag.startsWith('0')) {
        await spcToken.approve(vaultAddress, shareEther);
        await spcToken.transfer(vaultAddress, shareEther);
      }
      if (flag.startsWith('1')) {
        await wethToken.approve(vaultAddress, shareEther);
        await wethToken.transfer(vaultAddress, shareEther);
      }
      if (flag.startsWith('2')) {
        await xxxToken.approve(vaultAddress, shareEther);
        await xxxToken.transfer(vaultAddress, shareEther);
      }
      
      // Uniswap -> Vault -> User (asset amountOut)
      let amountOut = await tokenVault.swapExactToken0ForToken1(token0Address, token1Address, shareEther, 1, await signer.getAddress());
      console.log("Swap amount output ------------", amountOut);
    } catch (error: any) {
      console.log(error);
    }
  }

  return (
    <div className="m-auto mt-20 basis-1/4 h-[70vh] min-w-[290px] w-[30vw] flex list-none flex-row border-2 border-blue-400 rounded-[60px] pl-0">
      <div className="m-auto justify-center items-center">
        <div
          className="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
          id="tabs-home01"
          role="tabpanel"
          aria-labelledby="tabs-home-tab01"
          data-te-tab-active
        >
          <SwapGroup
            handleCurrentValue0Change={handleCurrentValue0Change}
            handleCurrentValue1Change={handleCurrentValue1Change}
            handleInputSwapChange={handleInputSwapChange}
            handleOutputSwapChange={handleOutputSwapChange}
            handleSwapClick={handleSwapClick}
            inputSwapAmount={inputSwapAmount}
            outputSwapAmount={outputSwapAmount}
          />
        </div>
      </div>
    </div>
  );
}

export default Swap;