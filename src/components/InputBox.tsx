import React from "react";
import DropDown from "./DropDown";

function InputBox(props: any) {
  return (
    <div className="p-3 mb-5 xs:w-4/5 items-center bg-blue-200 sm:container sm:mx-auto sm:px-5 rounded-2xl border-2 border-blue-600 box-border">
      <div className="flex">
        <div className="flex items-center">
          <input
            type="text"
            name={props.name}
            value={props.value}
            placeholder="0"
            className="p-2 pl-5 bg-blue-200 text-3xl rounded-lg w-4/5 xs:w-4/5"
            onChange={props.onChange}
          />
          {props.isEmpty ? (
            <p className="mt-2 text-sm text-red-600">  
              {props.name}
            </p>
          ) : (
            <p></p>
          )}
        </div>
        <div className="mt-6">
          <div className="">
           <DropDown onChange={props.handleCurrentValueChange} />
          </div>
          <div className="text-center font-medium">Balance:{props.balance}</div>
        </div>
      </div>
    </div>
  );
}

export default InputBox;
