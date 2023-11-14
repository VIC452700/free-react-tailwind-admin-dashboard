import React from 'react';
import Button from '../components/Button';
import InputBoxLabel from '../components/InputBoxLabel';

function WithDrawGroup(props: any) {
  return (
    <div className="sm:container sm:mx-auto sm:px-5 my-10 box-border">
      <div className="box-border h-full w-full">
          <InputBoxLabel
            Token={'vSPC-WETH'}
            balance={props.balanceOFLP}
            onChange={props.handleShareChange}
            isEmpty={!props.isShareEmpty}
            value={props.shareAmount}
            setMaxAmount={props.handleMaxLP}
          />
          <label className="flex justify-between p-3">
            <span>Your SPC :</span>
            <span>{props.depositAmountOfToken0}</span>
          </label>
          <label className="flex justify-between p-3">
            <span>Your WETH :</span>
            <span>{props.depositAmountOfToken1}</span>
          </label>
          <div className="flex justify-center mt-10">
            <Button
              text={'Withdraw'}
              buttonClicked={props.handleShareWithdrawClick}
            />
          </div>
      </div>
    </div>
  );
}

export default WithDrawGroup;
