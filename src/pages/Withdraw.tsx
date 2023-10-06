import React from 'react';
import Button from '../components/Button';
import InputBoxLabel from '../components/InputBoxLabel';

function WithDrawGroup(props: any) {
  return (
    <div className="sm:container sm:mx-auto sm:px-5 my-10 box-border">
      <div className="box-border h-96 w-full mt-30">
        <InputBoxLabel
          Token={'vSPC-WETH'}
          balance={props.balanceOFLP}
          onChange={props.handleShareChange}
          isEmpty={!props.isShareEmpty}
        />
        <label className="flex justify-between">
          <span>Your SPC :</span>
          <span>1852</span>
        </label>
        <label className="flex justify-between">
          <span>Your WETH :</span>
          <span>1</span>
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
