import React, { useEffect, useState } from "react";
import { FaEthereum } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface TableRow {
  id: number;
  network: string;
  name: string;
  wallet: number;
  deposited: number;
  apy: string;
  tvl: string;
}

interface TableProps {
  rows: TableRow[];
  onRowClick: (row: TableRow) => void;
}

const EarnTable: React.FC<TableProps> = ({ rows, onRowClick }) => {
  const sortedRows = [...rows].sort((a, b) => a.id - b.id);
  const handleRowClick = (row: TableRow) => {
    onRowClick(row);
  }
  return (
     <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                  <th scope="col" className="p-4 w-2">
                    Network
                  </th>
                  <th scope="col" className="px-6 py-3 w-10">
                    <label htmlFor="table-search" className="sr-only">Search</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                          </svg>
                      </div>
                      <input type="text" id="table-search-users" className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..." />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                      WALLET
                  </th>
                  <th scope="col" className="px-6 py-3">
                      DEPOSITED
                  </th> 
                  <th scope="col" className="px-6 py-3">
                      APY
                  </th>
                  <th scope="col" className="px-6 py-3">
                      TVL
                  </th>
              </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => (
              <tr key={row.id} onClick={() => handleRowClick(row)} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="w-2 p-4">{row.network === 'eth' && <FaEthereum className="w-6 h-6 mr-2" />}{row.network === 'polygon' && <img src="polygon.png" className="w-6 h-6 mr-2" />}</td>
                <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"><div className="pl-3"><div className="text-base font-semibold">{row.name}</div></div></th>
                <td className="w-8 p-4">{row.wallet}</td>
                <td className="w-8 p-4">{row.deposited}</td>
                <td className="w-8 p-4">{row.apy}</td>
                <td className="w-8 p-4">{row.tvl}</td>
              </tr>
            ))}
          </tbody>
      </table>
  )
}

const Earn = (props: any) => {
  const [rows, setRows] = useState<TableRow[]>([]);
  const [isClickedClearBtn, setIsClickedClearBtn] = useState(false);
  const navigate = useNavigate();
  const handleRowClick = (row: TableRow) => {
    navigate('/vault');
  }
  const [isClick, setIsClick] = useState(false);

  const buttonClasses = `text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 ${
    isClick ? 'dark:bg-blue-700 dark:text-white dark:border-blue-500 dark:hover:text-white dark:focus:ring-blue-800' : ''
  }`;

  const handleButtonClick = (buttonRows: TableRow[]) => {
    setRows((prevRows) => {
      setIsClick((prevIsClick) => !prevIsClick);

      const isDisplayed = buttonRows.every((row) =>
        prevRows.some((prevRows) => prevRows.id === row.id)
      );
      if(isDisplayed){
        setIsClickedClearBtn(true);
        return prevRows.filter(
          (prevRows) => !buttonRows.some((row) => row.id === prevRows.id)
        );
      } else {
        setIsClickedClearBtn(false);
      }

      return [...prevRows, ...buttonRows];
    });
  };

  useEffect(() => {
    // Fetch or set the initial rows data here
    const initialRows: TableRow[] = [
      { id: 1, network: 'eth', name: 'SPC-WETH vLP - 1', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M' },
      { id: 2, network: 'eth', name: 'SPC-WETH vLP - 2', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M' },
      { id: 3, network: 'polygon', name: 'USDC-USDR sLP - 1', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M' },
      { id: 4, network: 'polygon', name: 'USDC-USDR sLP - 2', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M' },
    ];

    setRows(initialRows);
  }, []);

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <button
            id="etherBtn" 
            type="button" 
            onClick={() => 
              handleButtonClick([
                {id:1, network: 'eth', name: 'SPC-WETH vLP - 1', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M'},
                {id:2, network: 'eth', name: 'SPC-WETH vLP - 2', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M'}
                ])
            } 
            className={buttonClasses}
          >
            <FaEthereum className="w-12 h-6"/>
          </button>
          <button 
            id="polygonBtn"
            type="button" 
            onClick={() => 
              handleButtonClick([
                {id:3, network: 'polygon', name: 'USDC-USDR sLP - 1', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M'},
                {id:4, network: 'polygon', name: 'USDC-USDR sLP - 2', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M'}
                ])
            } 
            className={buttonClasses}
          >
            <img src="polygon.png" className="w-6 h-6 mr-3 ml-3"/>
          </button>
          <button type="button" className={buttonClasses}>
            <FaEthereum className="w-12 h-6"/>
          </button>
          <button type="button" className={buttonClasses}>
            <FaEthereum className="w-12 h-6"/>
          </button>
          <button type="button" className={buttonClasses}>
            <FaEthereum className="w-12 h-6"/>
          </button>
          <button type="button" className={buttonClasses}>
            <FaEthereum className="w-12 h-6"/>
          </button>
        </div>
        {!isClickedClearBtn &&
        <button type="button" onClick={() => 
              handleButtonClick([
                {id:1, network: 'eth', name: 'SPC-WETH vLP - 1', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M'},
                {id:2, network: 'eth', name: 'SPC-WETH vLP - 2', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M'},
                {id:3, network: 'polygon', name: 'USDC-USDR sLP - 1', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M'},
                {id:4, network: 'polygon', name: 'USDC-USDR sLP - 2', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M'}
                ])
            }  className="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500 ml-auto">
          Clear All
        </button>}

      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg border-t">
        {/* <EarnTable rows={rows} onRowClick={handleRowClick}/> */}
        <EarnTable rows={rows} onRowClick={handleRowClick}/>
      </div>
    </>
  );
};

export default Earn;