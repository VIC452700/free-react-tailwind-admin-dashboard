import Button from '../components/Button';
import InputBoxLabel from '../components/InputBoxLabel';

function DepositGroup(props: any) {
  return (
    <div className="sm:container sm:mx-auto sm:px-5 my-10 box-border">
      {/* <div className="my-10 text-5xl text-black">Assets</div> */}
      <div className="box-border h-full w-full">
        <InputBoxLabel
          Token={'SPC'}
          balance={props.balanceOfToken0}
          onChange={props.handleSpcChange}
          isEmpty={!props.isAssetEmpty}
          value={props.spcAmount}
        />
        <InputBoxLabel
          Token={'WETH'}
          balance={props.balanceOfToken1}
          onChange={props.handleWethChange}
          isEmpty={!props.isAssetEmpty}
          value={props.wethAmount}
        />
        <div className="flex flex-row px-7 pt-3 justify-center items-center">
          <Button text={'Deposit'} buttonClicked={props.handleDepositClick} />
        </div>
      </div>
    </div>
  );
}

export default DepositGroup;
