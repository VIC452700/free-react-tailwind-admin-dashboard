import React from 'react';
import ChartThree4 from '../components/ChartThree4.tsx';
import DepositWithdraw from './DepositWithdraw.tsx';

const Vault = () => {
  return (
    <div className='border-t mt-4'>
        <h1 className='mt-4 font-bold'>Overview</h1>
        <div className="flex mt-4 grid-cols-3 gap-4 md:grid-cols-1 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
          <ChartThree4 />
          <DepositWithdraw />
        </div>
    </div>
  );
};

export default Vault;
