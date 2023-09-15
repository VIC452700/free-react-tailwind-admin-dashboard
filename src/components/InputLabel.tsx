function InputLabel(props: any) {
  return (
    <div className="flex p-3 mb-5 bg-blue-200 mx-0 items-center sm:container sm:mx-auto sm:px-5 rounded-2xl border-2 border-blue-600 box-border p-9">
      <div className="flex-auto items-center">
        <label className="flex justify-between">
          <span>XXX Reward:</span>
          <span>61.9%</span>
        </label>
        <label className="flex justify-between">
          <span>SPC Reward:</span>
          <span>19.05%</span>
        </label>
        <label className="flex justify-between">
          <span>WETH Reward:</span>
          <span>19.05%</span>
        </label>
      </div>
    </div>
  );
}

export default InputLabel;
