import Button from '../components/Button';
import InputBoxLabel from '../components/InputBoxLabel';

function WithDrawGroup(props: any) {
  return (
    <div className="sm:container sm:mx-auto sm:px-5 my-10 box-border">
      {/* <div className="mb-10 text-5xl text-black">Share</div> */}
      <div className="box-border h-96 w-full mt-30">
        <InputBoxLabel
          Token={'vSPC-WETH'}
          balance={props.balanceOFLP}
          onChange={props.handleShareChange}
          isEmpty={!props.isShareEmpty}
        />
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
