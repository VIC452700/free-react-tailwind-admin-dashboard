function InputBoxLabel(props: any) {
  return (
    <div className="flex block mb-5 justify-between pt-4 pb-4 items-center bg-blue-200 sm:container sm:mx-auto sm:px-4 rounded-2xl border-2 border-blue-600 box-border">
      <div className="flex-auto justify-center items-center">
        <input
          type="text"
          name={props.name}
          value={props.value}
          placeholder="0"
          className="p-2 pl-5 bg-blue-200 text-3xl rounded-lg w-3/5"
          onChange={props.onChange}
        />
        {props.isEmpty ? (
          <p className="mt-2 text-sm text-red-600 mt-0">
            
            {props.name}
          </p>
        ) : (
          <p></p>
        )}
      </div>
      <div className="my-2 ml-[-120px]">
        <div className="flex-auto font-bold text-2xl items-center">
          {props.Token}
        </div>
        <div className="text-center font-medium">Balance: {props.balance}</div>
      </div>
    </div>
  );
}

export default InputBoxLabel;
