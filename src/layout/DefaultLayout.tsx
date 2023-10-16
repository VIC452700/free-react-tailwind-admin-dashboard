import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {FaExchangeAlt, FaDollarSign} from 'react-icons/fa';

import ConnectWalletModal from '../components/ConnectWalletModal';
import Logo from '../images/logo/xfi.png';

import { WagmiConfig, createConfig, configureChains } from 'wagmi'

import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
 
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import SwitchNetworkModal from '../components/SwitchNetworkModal';
import { sepolia, arbitrumGoerli, bscTestnet, optimismGoerli, polygonMumbai } from 'wagmi/chains';
import CustomConnectButton from '../components/CustomConnectButton';
import { ConnectButton, RainbowKitProvider, useAccountModal, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit';


const DefaultLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isVisibleWalletModal, setIsVisibleWalletModal] = useState(false);
  const [connectWallet, setConnectWallet] = useState('Connect Wallet');
  const [isVisibleNetworkModal, SetIsVisibleNetworkModal] = useState(false);
  const [connectNetwork, setConnectNetwork] = useState('Switch Network');
  const [connectorId, setConnectorId] = useState(0);
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);
  
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isVisibleWalletModal && !(event.target as HTMLElement).closest('.modal')) {
        setIsVisibleWalletModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, [isVisibleWalletModal]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isVisibleNetworkModal && !(event.target as HTMLElement).closest('.modal')) {
        SetIsVisibleNetworkModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, [isVisibleNetworkModal]);

  const handleVisibleWalletModal = () => {
    setIsVisibleWalletModal(!isVisibleWalletModal);
  }

  const handleConnectWallet = (walletAddress: string) => {
    setConnectWallet(walletAddress);
    setIsVisibleWalletModal(!isVisibleWalletModal);
  };

  const handleVisibleNetworkModal = () => {
    SetIsVisibleNetworkModal(!isVisibleNetworkModal);
  }

  const handleConnectNetwork = (networkName: string) => {
    setConnectNetwork(networkName);
    SetIsVisibleNetworkModal(!isVisibleNetworkModal);
  };

  const alchemyId: string = "Z66PxY86kCkFslToB82DiSM531OnIyHS"; // const alchemyId: string = process.env.ALCHEMY_ID || "";
  const projectId: string = "177249e407d373ae3ed64ace1806e582"; // const projectId: string = process.env.WALLETCONNECT_PROJECT_ID || "";

  const { chains, publicClient, webSocketPublicClient } = configureChains([sepolia, bscTestnet, polygonMumbai, arbitrumGoerli, optimismGoerli], [
    alchemyProvider({ apiKey: alchemyId }),
    publicProvider(),
  ])

  const connectors = [
    new MetaMaskConnector({
      chains,
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {appName: 'wagmi'},
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId,
        showQrModal: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      }
    }),
  ];

  const config = createConfig({
    autoConnect: true,
    connectors: connectors,
    publicClient,
    webSocketPublicClient,
  })

  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <aside
          ref={sidebar}
          className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between gap-2 px-10 py-5.5 border-b">
            <NavLink to="/">
              <img src={Logo} alt="Logo" />
            </NavLink>
            <button
              ref={trigger}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              className="block lg:hidden"
            >
              <svg
                className="fill-current"
                width="20"
                height="18"
                viewBox="0 0 20 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                  fill=""
                />
              </svg>
            </button>
          </div>
          <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
            <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
              <div>
                <div className="mb-4 rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="p-4 md:p-6 ml:p-9">
                    <div className="flex flex-wrap gap-5 xl:gap-7.5"> 
                    <WagmiConfig config={config}>
                    <RainbowKitProvider chains={chains} modalSize="compact">
                      <button
                        onClick={handleVisibleWalletModal}
                        className="inline-flex items-center justify-center gap-2.5 rounded-full border border-primary py-1 px-10 text-center text-primary hover:bg-opacity-90 lg:px-8 xl:px-10"
                      >
                        {connectWallet}
                      </button>
                      </RainbowKitProvider>
                      </WagmiConfig> 
                      
                      <button
                        onClick={handleVisibleNetworkModal}
                        className="inline-flex items-center justify-center gap-2.5 rounded-full border border-primary py-1 px-10 text-center text-primary hover:bg-opacity-90 lg:px-8 xl:px-10"
                      >
                        {connectNetwork}
                      </button>
                    </div>
                  </div>
                </div>
                <ul className="mb-6 flex flex-col gap-1.5">
                  <li>
                    <NavLink
                      to="/"
                      className={'group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4'}
                    >
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
                          fill=""
                        />
                        <path
                          d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
                          fill=""
                        />
                        <path
                          d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
                          fill=""
                        />
                        <path
                          d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
                          fill=""
                        />
                      </svg>
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/swap"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4`}
                    >
                      <FaExchangeAlt />
                      Swap
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/earn"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4`}
                    >
                      <FaDollarSign />
                      Earn
                    </NavLink>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </aside>

        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <main>       
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <Outlet />
              {isVisibleWalletModal &&
                (
                  <WagmiConfig config={config}>
                    {/* <RainbowKitProvider chains={chains} modalSize="compact"> */}
                      <ConnectWalletModal handleConnectWallet={handleConnectWallet} setConnectNetwork={setConnectNetwork} setConnectorId={setConnectorId} />
                    {/* </RainbowKitProvider> */}
                    
                  </WagmiConfig>
                )
              }
              {isVisibleNetworkModal &&
                (
                  <WagmiConfig config={config}>
                    <SwitchNetworkModal handleConnectNetwork={handleConnectNetwork} connectorId={connectorId} />
                  </WagmiConfig>
                )
              }
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
