import React from "react";
import DropDown from "./DropDown";

interface InputBoxProps {
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  options: string[];
  balance: string;
  handleCurrentValueChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const InputBox: React.FC<InputBoxProps> = ({ name, value, onChange, options, balance, handleCurrentValueChange }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mt-15"> 
      <div className="col-span-2"> 
        <div className="mx-auto"> 
          <input 
            type="text" 
            minLength={1} 
            maxLength={20} 
            inputMode="decimal" 
            name={name} 
            value={value} 
            placeholder="0" 
            className="py-3 pl-3 text-xl rounded-xl w-full shadow-lg" 
            onFocus={(e) => e.target.select()} 
            onChange={onChange} 
          /> 
        </div> 
      </div> 
      <div className="col-span-1"> 
        <div className="mx-auto"> 
          <DropDown options={options} onChange={handleCurrentValueChange} /> 
          <div className="pt-3 text-center font-medium">Balance: {balance}</div> 
        </div> 
      </div> 
    </div> 
  );
}

export default InputBox;
