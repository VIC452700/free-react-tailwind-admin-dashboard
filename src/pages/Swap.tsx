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
import InputBox from '../components/InputBox.js';
import Token from '../components/Token.js';

initTE({ Tab });

function Swap() {
  // const [tokenA, setTokenA] = useState<Token>({} as Token);
  // const [tokenB, setTokenB] = useState<Token>({} as Token);
  const [tokenA, setTokenA] = useState('0');
  const [tokenB, setTokenB] = useState('0');

  // const [balanceA, setBalanceA] = useState("0");
  // const [balanceB, setBalanceB] = useState("0");

  const [inputA, setInputA] = useState("0");
  const [inputB, setInputB] = useState("0");

  const [isVisibleTokenA, setIsVisibleTokenA] = useState(false);
  const [isVisibleTokenB, setIsVisibleTokenB] = useState(false);
  const [isSwap, setIsSwap] = useState(true);
  
  const wethAddress = '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14';
  const spcAddress = '0xe2B0E50603Cd62569A94125628D796ad21339299';
  const xxxAddress = '0xe11B03C04e87430F8EAd92b245625c88c176C044';
  const vaultAddress = '0x4B3f9d86535FDe6f38f5C623D2b4dF5cE8989e41';

  const handleCurrentValue0Change = (e: any) => {
    setIsVisibleTokenA(!isVisibleTokenA);
    setTokenA(e.target.value);
  };

  const handleCurrentValue1Change = (e: any) => {
    setIsVisibleTokenB(!isVisibleTokenB);
    setTokenB(e.target.value);
  };

  const handleIsSwap = (isSwapClicked: boolean) => {
    setIsSwap(isSwapClicked);
  }
  
  const handleInputSwapChange = (e: any) => {
    setInputA(e.target.value);
    setInputB(AutoExtractTokenAmount(e.target.value));
  };

  const handleOutputSwapChange = (e: any) => {
    setInputB(e.target.value);
    setInputA(AutoExtractTokenAmount(e.target.value));
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
    if (tokenA == tokenB) { alert("These are same tokens!"); return; }

    if (tokenA == '0' && tokenB == '1'){ // SPC-WETH
      swapExactToken0ForToken1_(spcAddress, wethAddress, inputA, '01');
    }
    if (tokenA == '1' && tokenB == '0'){ // WETH-SPC
      swapExactToken0ForToken1_(wethAddress, spcAddress, inputA, '10');
    }
    if (tokenA == '0' && tokenB == '2'){ // SPC-XXX
      swapExactToken0ForToken1_(spcAddress, xxxAddress, inputA, '02');
    }
    if (tokenA == '2' && tokenB == '0'){ // XXX-SPC
      swapExactToken0ForToken1_(xxxAddress, spcAddress, inputA, '20');
    }
    if (tokenA == '1' && tokenB == '2'){ // WETH-XXX
      swapExactToken0ForToken1_(wethAddress, xxxAddress, inputA, '12');
    }
    if (tokenA == '2' && tokenB == '1'){ // XXX-WETH
      swapExactToken0ForToken1_(xxxAddress, wethAddress, inputA, '21');
    }
  };

  async function swapExactToken0ForToken1_(token0Address: string, token1Address: string, inputA: string, flag:string) {
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

      const shareEther = ethers.parseUnits(inputA, 'ether');
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
     <div className="w-1/2 m-auto mt-32 shadow-xl rounded-3xl h-[580px] border-t-[1px] border-gray-100 dark:border-slate-800 dark:bg-slate-800">
        <div className="flex border-b-[1px] border-gray-200 dark:border-gray-900 shadow-md p-3">
          <p className="text-xl pl-5 font-bold text-left dark:text-gray-200 py-2">
            <button onClick={() => handleIsSwap(true)} 
            className={`border rounded-lg py-1 px-5 border-[#3c50df]
            ${isSwap && 'bg-[#3c50df] text-white'}
            `}>Swap</button>
          </p>
          <p className="text-xl pl-5 font-bold text-left dark:text-gray-200 py-2">
            <button onClick={() => handleIsSwap(false)} 
            className={`border rounded-lg py-1 px-4 border-[#3c50df] 
            ${!isSwap && 'bg-[#3c50df] text-white'}
            `}>xSwap</button>
          </p>
        </div>
        {isSwap?
          (<div>
              <div className="p-4">
                <InputBox
                  id="intoken"
                  name="inToken"
                  Token={'SPC'}
                  handleCurrentValueChange={handleCurrentValue0Change}
                  balance={'10000'}
                  onChange={handleInputSwapChange}
                  isEmpty={false}
                  value={inputA}
                />
                <InputBox
                  id="outtoken"
                  name="outToken"
                  Token={'WETH'}
                  handleCurrentValueChange={handleCurrentValue1Change}
                  balance={'5000'}
                  onChange={handleOutputSwapChange}
                  isEmpty={false}
                  value={inputB}
                />
              </div>
              <div className="p-6">Estimated Gas: <span id="gas_estimate"></span></div>
              <div className="flex justify-center">
                <button
                  type="button"
                  className="place-content-center mx-5 w-full py-2 px-10 text-lg font-bold text-white bg-primary rounded-md bg-opacity-85 hover:bg-opacity-90 disabled:bg-indigo-400"
                  disabled={inputA === "0" || inputB === "0"}
                  onClick={handleSwapClick}
                >
                  {inputA === "0" || inputB === "0"
                    ? "Enter an amount"
                    : "SWAP"}
                </button>
              </div>
          </div>) :
          (<div>
              <div className="p-4">
                <InputBox
                  id="intoken"
                  name="inToken"
                  Token={'XXX'}
                  handleCurrentValueChange={handleCurrentValue0Change}
                  balance={'100'}
                  onChange={handleInputSwapChange}
                  isEmpty={false}
                  value={inputA}
                />
                <InputBox
                  id="outtoken"
                  name="outToken"
                  Token={'WETH'}
                  handleCurrentValueChange={handleCurrentValue1Change}
                  balance={'200'}
                  onChange={handleOutputSwapChange}
                  isEmpty={false}
                  value={inputB}
                />
              </div>
              <div className="p-6">Estimated Gas: <span id="gas_estimate"></span></div>
              <div className="flex justify-center">
                <button
                  type="button"
                  className="place-content-center mx-5 w-full py-2 px-10 text-lg font-bold text-white bg-primary rounded-md bg-opacity-85 hover:bg-opacity-90 disabled:bg-indigo-400"
                  disabled={inputA === "0" || inputB === "0"}
                  onClick={handleSwapClick}
                >
                  {inputA === "0" || inputB === "0"
                    ? "Enter an amount"
                    : "SWAP"}
                </button>
              </div>
          </div>)
        }
    </div>
  );
}

export default Swap;