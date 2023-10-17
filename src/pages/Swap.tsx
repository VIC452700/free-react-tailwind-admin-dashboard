import React from 'react';
import { useState } from 'react';
import { ethers } from 'ethers';
import { Tab, initTE } from 'tw-elements';
import SwapGroup from '../components/SwapGroup';

initTE({ Tab });

import SpaceCredit from '../abi/SpaceCredit.json';
import XXXToken from '../abi/XXXToken.json';
import TokenVault from '../abi/TokenVault.json';
import WETH from '../abi/WETH.json';

declare let window: any;

function Swap(props: any) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isAssetEmpty, setIsAssetEmpty] = useState<boolean | false>(false);
  const [isShareEmpty, setIsShareEmpty] = useState<boolean | false>(false);
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

  const [currentValue0, setCurrentValue0] = useState('0');
  const [currentValue1, setCurrentValue1] = useState('0');
  const [inputSwapAmount, setInputSwapAmount] = useState('');
  const [outputSwapAmount, setOutputSwapAmount] = useState('');

  const wethAddress = '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14';
  const spcAddress = '0xe2B0E50603Cd62569A94125628D796ad21339299';
  const xxxAddress = '0xe11B03C04e87430F8EAd92b245625c88c176C044';
  // const vaultAddress = '0xe810399b60f1Fb94EfdF9826Cb9e378E44b85206'; //origin no withdraw 
  const vaultAddress = '0x4B3f9d86535FDe6f38f5C623D2b4dF5cE8989e41';

  const handleConnectClick = async () => {
    await connectMetaMask();
  };

  let id = window.ethereum.chainId;
  const ethSepoliaId = '0xaa36a7'; // Sepolia 11155111
  const ethMainnetId = '0x1'; // Ethereum 1
  // if (id === ethSepoliaId) {
    handleConnectClick();
  // } else {
  //   // alert("Please connect sepolia testnet.");
  //   return;
  // }

  async function connectMetaMask() {
    //const provider = new ethers.AlchemyProvider('https://eth-sepolia.g.alchemy.com/v2/Z66PxY86kCkFslToB82DiSM531OnIyHS');
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();    

    const accountAddress = await signer.getAddress();
    setAccount(accountAddress);

    let id = await window.ethereum.chainId;
    if (id === ethMainnetId) return;
    
    const spcToken = new ethers.Contract(spcAddress, SpaceCredit, signer);
    const wethToken = new ethers.Contract(wethAddress, WETH, signer);
    const xxxToken = new ethers.Contract(xxxAddress, XXXToken, signer);
    const tokenVault = new ethers.Contract(vaultAddress, TokenVault, signer);

    let vaultName = await tokenVault.getVaultName();
    let vaultSymbol = await tokenVault.getVaultSymbol();
    setVaultName(vaultName);
    setVaultSymbol(vaultSymbol);

    // Get balance of ETH
    const balanceWei = await provider.getBalance(accountAddress);
    const balanceEth = ethers.formatEther(balanceWei);
    setBalance(balanceEth);

    // Get balance of SPC, WETH token
    let spcAmountWei = await spcToken.balanceOf(accountAddress);
    let spcEth = ethers.formatEther(spcAmountWei);
    let wethAmountWei = await wethToken.balanceOf(accountAddress);
    let wethEth = ethers.formatEther(wethAmountWei);
    let xxxAmountWei = await xxxToken.balanceOf(accountAddress);
    let xxxEth = ethers.formatEther(xxxAmountWei);

    setToken0(spcEth);
    setToken1(wethEth);
    setTokenXXX(xxxEth)

    let lpAmountWei = await tokenVault.balanceOf(accountAddress);
    let lpEth = ethers.formatEther(lpAmountWei);
    setLPToken(lpEth);

    // get several factors
    let totalVauleLocked = await tokenVault.getTVL();
    let token0Locked = await tokenVault.getLockedAmountOfToken0();
    let token1Locked = await tokenVault.getLockedAmountOfToken1();
    let pairAddress = await tokenVault.getPairAddress(spcAddress, wethAddress);
    let pairAddress1 = await tokenVault.getPairAddress(spcAddress, xxxAddress);
    let pairAddress2 = await tokenVault.getPairAddress(xxxAddress, wethAddress);
    // console.log("totolVaule Locked amount ---", totalVauleLocked);
    // console.log("token0 value locked amount ---", token0Locked);
    // console.log("token1 value locked amount ---", token1Locked);
    // console.log("pairAddress SPC-WETH ---- ", pairAddress);
    // console.log("pairAddress SPC-XXX ---- ", pairAddress1);
    // console.log("pairAddress XXX-WETH ---- ", pairAddress2);
  }

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
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
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

  function AutoExtractTokenAmount(baseTokenAmount: string) {
    const inAmount = Number(baseTokenAmount);

    const outAmount = (100000 * inAmount * 0.997) / (100000 + inAmount * 0.997);
    return outAmount.toString();
  }


  return (
    <>
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
    </>
  );
}

export default Swap;