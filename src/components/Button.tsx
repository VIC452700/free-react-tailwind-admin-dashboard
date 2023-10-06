import React from "react";

function Button(props: any) {
  return (
    <div className="flex">
      <button
        className="rounded-md bg-black px-3.5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-48"
        onClick={props.buttonClicked}
      >
        {props.text}
      </button>
    </div>
  );
}

export default Button;