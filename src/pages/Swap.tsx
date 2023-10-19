import React from 'react';
import { useState } from 'react';
import { getWalletClient } from '@wagmi/core'
import { BrowserProvider, Eip1193Provider, JsonRpcSigner, ethers } from 'ethers';
import { Tab, initTE } from 'tw-elements';

import WETH from '../abi/WETH.json';
import XXXToken from '../abi/XXXToken.json';
import SpaceCredit from '../abi/SpaceCredit.json';
import TokenVault from '../abi/TokenVault.json';
import { getEthersProvider } from '../utils/getEthersProvider.js';
import InputBox from '../components/InputBox.js';
import ToastWarning from '../components/toast/ToastWarning.js';
import ToastSuccess from '../components/toast/ToastSuccess.js';
import ToastDanger from '../components/toast/ToastDanger.js';
// import Token from '../components/Token.js';

initTE({ Tab });

function Swap() {
  // const [tokenA, setTokenA] = useState<Token>({} as Token);
  // const [tokenB, setTokenB] = useState<Token>({} as Token);
  const [tokenA, setTokenA] = useState('0');
  const [tokenB, setTokenB] = useState('0');
  const [balanceA, setBalanceA] = useState("0");
  const [balanceB, setBalanceB] = useState("0");
  const [inputA, setInputA] = useState("0");
  const [inputB, setInputB] = useState("0");

  const [isVisibleTokenA, setIsVisibleTokenA] = useState(false);
  const [isVisibleTokenB, setIsVisibleTokenB] = useState(false);
  const [isSwap, setIsSwap] = useState(true);

  const [isToastWarningVisible, setIsToastWarningVisible] = useState(false);
  const [isToastDangerVisible, setIsToastDangerVisible] = useState(false);
  const [isToastSuccessVisible, setIsToastSuccessVisible] = useState(false);
  
  const options = ['SPC', 'WETH', 'XXX'];

  const wethAddress = '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14';
  const spcAddress = '0xe2B0E50603Cd62569A94125628D796ad21339299';
  const xxxAddress = '0xe11B03C04e87430F8EAd92b245625c88c176C044';
  const vaultAddress = '0x4B3f9d86535FDe6f38f5C623D2b4dF5cE8989e41';

  let accountAddress, provider, signer: JsonRpcSigner;
  let spcToken: ethers.Contract, wethToken: ethers.Contract, xxxToken: ethers.Contract, tokenVault: ethers.Contract;

  const connectWallet = async () => {
    const _provider = getEthersProvider();
    const chainId: number = Number((await _provider.getNetwork()).chainId);
    
    const walletClient = await getWalletClient({ chainId });
    const network = {
      chainId: walletClient?.chain.id,
      name: walletClient?.chain.name,
      ensAddress: walletClient?.chain.contracts?.ensRegistry?.address,
    }
    const transport = walletClient?.transport as Eip1193Provider; // Ensure transport is of type Eip1193Provider
    accountAddress = walletClient?.account.address;
    // let id = await window.ethereum.chainId;
    // if (id === ethMainnetId) return;

    provider = new BrowserProvider(transport, network)
    signer = new JsonRpcSigner(provider, accountAddress as string);
    
    tokenVault = new ethers.Contract(vaultAddress, TokenVault, signer);
    spcToken = new ethers.Contract(spcAddress, SpaceCredit, signer);
    wethToken = new ethers.Contract(wethAddress, WETH, signer);
    xxxToken = new ethers.Contract(xxxAddress, XXXToken, signer);

    const spcAmount = await spcToken.balanceOf(accountAddress);
    const wethAmount = await wethToken.balanceOf(accountAddress);
    const xxxAmount = await xxxToken.balanceOf(accountAddress);

    const spcEth = ethers.formatEther(spcAmount);
    const wethEth = ethers.formatEther(wethAmount);
    const xxxEth = ethers.formatEther(xxxAmount);

    switch (tokenA) {
      case '0':
        setBalanceA((parseFloat(spcEth).toFixed(3)).toString());
        break;
      case '1':
        setBalanceA((parseFloat(wethEth).toFixed(3)).toString());
        break;
      case '2':
        setBalanceA((parseFloat(xxxEth).toFixed(3)).toString());
        break;
    }

    switch (tokenB) {
      case '0':
        setBalanceB((parseFloat(spcEth).toFixed(3)).toString());
        break;
      case '1':
        setBalanceB((parseFloat(wethEth).toFixed(3)).toString());
        break;
      case '2':
        setBalanceB((parseFloat(xxxEth).toFixed(3)).toString());
        break;
    }
  }

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
    if (tokenA == tokenB) { 
      setIsToastWarningVisible(true);
      setTimeout(() => {
        setIsToastWarningVisible(false);
      }, 5000);
      return;
    }

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
      await tokenVault.swapExactToken0ForToken1(token0Address, token1Address, shareEther, 1, await signer.getAddress());

    } catch (error: any) {
      console.log(error);
    }
  }

  connectWallet();

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
                  name="inToken"
                  balance={balanceA}
                  value={inputA}
                  options={options}
                  handleCurrentValueChange={handleCurrentValue0Change}
                  onChange={handleInputSwapChange}
                />
                <InputBox
                  name="outToken"
                  balance={balanceB}
                  value={inputB}
                  options={options}
                  handleCurrentValueChange={handleCurrentValue1Change}
                  onChange={handleOutputSwapChange}
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
                  name="inputToken"
                  options={options}
                  handleCurrentValueChange={handleCurrentValue0Change}
                  balance={balanceA}
                  onChange={handleInputSwapChange}
                  value={inputA}
                />
                <InputBox
                  name="outputToken"
                  options={options}
                  handleCurrentValueChange={handleCurrentValue1Change}
                  balance={balanceB}
                  onChange={handleOutputSwapChange}
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
        {isToastWarningVisible && <ToastWarning text={'These are same tokens!'} setIsToastWarningVisible={setIsToastWarningVisible}/>}
        {isToastSuccessVisible && <ToastSuccess text={'Success'} setIsToastSuccessVisible={setIsToastSuccessVisible}/>}
        {isToastDangerVisible && <ToastDanger text={'This is not exact token!'} setIsToastDangerVisible={setIsToastDangerVisible}/>}
    </div>
  );
}

export default Swap;