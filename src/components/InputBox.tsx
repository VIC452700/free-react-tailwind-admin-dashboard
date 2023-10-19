import React from "react";
import DropDown from "./DropDown";

function InputBox(props: any) {
  return (
    <div className="grid grid-cols-3 gap-4 mt-15"> 
      <div className="col-span-2"> 
        <div className="mx-auto"> 
          <input 
            type="text" 
            minLength={1} 
            maxLength={20} 
            inputMode="decimal" 
            name={props.name} 
            value={props.value} 
            placeholder="0" 
            className="py-3 pl-3 text-xl rounded-xl w-full shadow-lg" 
            onFocus={(e) => e.target.select()} 
            onChange={props.onChange} 
          /> 
        </div> 
      </div> 
      <div className="col-span-1"> 
        <div className="mx-auto"> 
          <DropDown onChange={props.handleCurrentValueChange} /> 
          <div className="pt-3 text-center font-medium">Balance: {props.balance}</div> 
        </div> 
      </div> 
    </div> 
  );
}

export default InputBox;
