import React from 'react';
import { useState } from 'react';
import { getWalletClient } from '@wagmi/core'
import { BrowserProvider, Eip1193Provider, JsonRpcSigner, ethers } from 'ethers';
import { Tab, initTE } from 'tw-elements';

import WithDraw from './Withdraw';
import DepositGroup from './Deposit';
import WETH from '../abi/WETH.json';
import SpaceCredit from '../abi/SpaceCredit.json';
import TokenVault from '../abi/TokenVault.json';
import ClaimTimerGroup from '../components/ClaimTimerGroup';
import { getEthersProvider } from '../utils/getEthersProvider.js';

initTE({ Tab });

const DepositWithdraw = (props: any) => {
  const [isTab1Visible, setIsTab1Visible] = useState(true);
  const [isTab2Visible, setIsTab2Visible] = useState(false);
  const [isTab3Visible, setIsTab3Visible] = useState(false);
  
  const [spcAmount, setSpcAmount] = useState('');
  const [wethAmount, setWethAmount] = useState('');
  const [shareAmount, setShareAmount] = useState('');
  const [token0, setToken0] = useState('');
  const [token1, setToken1] = useState('');
  const [lpToken, setLPToken] = useState('');
  const [isShareEmpty] = useState<boolean | false>(false);

  let provider;
  let accountAddress: any;
  let signer: ethers.ContractRunner | JsonRpcSigner | null | undefined;
  let spcToken: ethers.Contract, wethToken: ethers.Contract, tokenVault: ethers.Contract;
  
  const wethAddress = '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14';
  const spcAddress = '0xe2B0E50603Cd62569A94125628D796ad21339299';
  const vaultAddress = '0x4B3f9d86535FDe6f38f5C623D2b4dF5cE8989e41'; // withdraw

  const handleTab1Page = () => {
    setIsTab1Visible(true);
    setIsTab2Visible(false);
    setIsTab3Visible(false);
  };
  const handleTab2Page = () => {
    setIsTab2Visible(true);
    setIsTab1Visible(false);
    setIsTab3Visible(false);
  };
  const handleTab3Page = () => {
    setIsTab3Visible(true);
    setIsTab1Visible(false);
    setIsTab2Visible(false);
  };

  const handleSpcChange = (e: any) => {
    setSpcAmount(e.target.value);
    setWethAmount(previewAssets(e.target.value, true));
  };

  const handleWethChange = (e: any) => {
    setWethAmount(e.target.value);
    setSpcAmount(previewAssets(e.target.value, false))
  };

  const handleShareChange = (e: any) => {
    setShareAmount(e.target.value);
  };

  const handleConnectClick = async () => {
    await connectMetaMask();
  };

  handleConnectClick();
  
  async function connectMetaMask() {
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

    provider = new BrowserProvider(transport, network)
    signer = new JsonRpcSigner(provider, accountAddress as string);
    // let id = await window.ethereum.chainId;
    // if (id === ethMainnetId) return;  
    
    spcToken = new ethers.Contract(spcAddress, SpaceCredit, signer);
    wethToken = new ethers.Contract(wethAddress, WETH, signer);
    tokenVault = new ethers.Contract(vaultAddress, TokenVault, signer);

    // Get balance of SPC, WETH token
    let spcAmountWei = await spcToken.balanceOf(accountAddress);
    let spcEth = ethers.formatEther(spcAmountWei);
    let spcEthFixed = parseFloat(spcEth).toFixed(3);

    let wethAmountWei = await wethToken.balanceOf(accountAddress);
    let wethEth = ethers.formatEther(wethAmountWei);
    let wethEthFixed = parseFloat(wethEth).toFixed(3);

    setToken0(spcEthFixed.toString());
    setToken1(wethEthFixed.toString());

    let lpAmountWei = await tokenVault.balanceOf(accountAddress);
    let lpEth = ethers.formatEther(lpAmountWei);
    let lpEthFixed = parseFloat(lpEth).toFixed(3);
    setLPToken(lpEthFixed);
  }

  function previewAssets(amount: string, isToken0: boolean) {
    const inputAmount = Number(amount);
    if (isToken0) {
      const outAmount = inputAmount / 1852;
      return outAmount.toString();
    } else {
      const outAmount = inputAmount * 1852;
      return outAmount.toString();
    }
  }

  const handleDepositPairClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    depositAssetPair_(spcAmount, wethAmount);
  };

  async function depositAssetPair_(spcAmount: string, wethAmount: string) {
    try {
      const spcEther = ethers.parseUnits(spcAmount, 'ether');
      const wethEther = ethers.parseUnits(wethAmount, 'ether');
      // Deposit Asset
      await spcToken.approve(vaultAddress, spcEther);
      await wethToken.approve(vaultAddress, wethEther);
      await tokenVault.depositAssetPair(spcEther, wethEther);

      // --------------------------------------------------------------------------------- SPC - WETH POOL
      // User -> Vault (tokenA, tokenB), Approve(Vault Address) -> Transfer
      // const amount1 = ethers.parseUnits('185.2', 'ether');
      // const amount2 = ethers.parseUnits('0.1', 'ether');
      // await spcToken.approve(vaultAddress, amount1);
      // await wethToken.approve(vaultAddress, amount2);
      // await spcToken.transfer(vaultAddress, amount1);
      // await wethToken.transfer(vaultAddress, amount2);

      // Add liquidity to the pool
      // let liquidity = await tokenVault.addLiquidityWithERC20(
      //   spcAddress,
      //   wethAddress,
      //   amount1,
      //   amount2
      // );
      // console.log('liquidity ', liquidity);

      // ---------------------------------------------------------------------------------- WETH - XXX POOL
      // User -> Vault (tokenA, tokenB), Approve(Vault Address) -> Transfer
      // const xxxToken = new ethers.Contract(xxxAddress, XXXToken, signer);
      // const amount1 = ethers.parseUnits('0.1', 'ether');
      // const amount2 = ethers.parseUnits('185.2', 'ether');
      // await wethToken.approve(vaultAddress, amount1);
      // await xxxToken.approve(vaultAddress, amount2);
      // await wethToken.transfer(vaultAddress, amount1);
      // await xxxToken.transfer(vaultAddress, amount2);

      // // Add liquidity to the pool
      // let liquidity = await tokenVault.addLiquidityWithERC20(
      //   wethAddress,
      //   xxxAddress,
      //   amount1,
      //   amount2
      // );
      // console.log('liquidity ', liquidity);

      // ------------------------------------------------------------------------------------ SPC - XXX POOL
      // User -> Vault (tokenA, tokenB), Approve(Vault Address) -> Transfer
      // const amount = ethers.parseUnits('10000', 'ether');
      // await spcToken.approve(vaultAddress, amount);
      // await xxxToken.approve(vaultAddress, amount);
      // await spcToken.transfer(vaultAddress, amount);
      // await xxxToken.transfer(vaultAddress, amount);

      // Add liquidity to the pool
      // let liquidity = await tokenVault.addLiquidityWithERC20(
      //   spcAddress,
      //   xxxAddress,
      //   amount,
      //   amount
      // );
      // console.log('liquidity', liquidity);
    } catch (error: any) {
      console.log(error);
    }
  }
  
  const handleShareWithdrawClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    withdrawAssetPair_(shareAmount);
  };

  async function withdrawAssetPair_(amountShare: string) {
    try {
      const shareEther = ethers.parseUnits(amountShare, 'ether');
      // await tokenVault.withdrawAssetPair(shareEther);
      await tokenVault.approve(vaultAddress, shareEther);
      await tokenVault.withdrawAssetPairToUser(shareEther);
    } catch (error: any) {
      console.log(error);
    }
  }

  const handleClaimClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    claimAssetPair_();
  };

  async function claimAssetPair_() {
    try{
      const shareEther = ethers.parseUnits('0.000000005', 'ether');
      await tokenVault.claimUserFee(spcAddress, wethAddress, shareEther, accountAddress);
    } catch (error: any) {
      console.log(error);
    }
  }

  return (
    <div className='w-full bg-white flex m-auto h-[60vh] flex-row flex-wrap border-2 rounded-[12px] pl-0'>
      <ul
        className="w-full mb-5 flex list-none flex-row flex-wrap border-b-0 pl-0"
        role="tablist"
        data-te-nav-ref
      >
        <li role="presentation" className="flex-auto mb-0 h-1/20 text-center">
          <button
          className="bg-gray  text-black border-r rounded-tl-[12px] border-t-0 w-[100%] h-15 text-4xl leading-tight hover:isolate hover:border-b-2 focus:isolate focus:border-b-2 focus:border-black data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary"
          onClick={handleTab1Page}
          >
            Deposit
          </button>
        </li>
        <li role="presentation" className="flex-auto mb-0 text-center">
          <button
          className="bg-gray text-black border-t-0 w-[100%] h-15 text-4xl leading-tight hover:isolate hover:border-b-2 focus:isolate focus:border-b-2 focus:border-black data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary "
          onClick={handleTab2Page}
          >
            Withdraw
          </button>
        </li>
        <li role="presentation" className="flex-auto mb-0 text-center">
          <button
          className="bg-gray text-black border-l rounded-tr-[12px] border-t-0 w-[100%] h-15 text-4xl leading-tight hover:isolate hover:border-b-2 focus:isolate focus:border-b-2 focus:border-black data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary "
          onClick={handleTab3Page}
          >
            Claim
          </button>
        </li>
      </ul>
      <div className="mx-auto justify-center items-center">
        {isTab1Visible &&
          <DepositGroup
            handleSpcChange={handleSpcChange}
            handleWethChange={handleWethChange}
            handleDepositClick={handleDepositPairClick}
            balanceOfToken0={token0}
            balanceOfToken1={token1}
            spcAmount={spcAmount}
            wethAmount={wethAmount}
          />
        }
        {isTab2Visible &&
          <WithDraw
            handleShareChange={handleShareChange}
            handleShareWithdrawClick={handleShareWithdrawClick}
            isShareEmpty={isShareEmpty}
            balanceOFLP={lpToken}
          />
        }
        {isTab3Visible &&
          <ClaimTimerGroup
            handleInputChange={props.handleInputChange}
            handleClaimClick={handleClaimClick}
          />
        }
      </div>
    </div>
  );
};

export default DepositWithdraw;
