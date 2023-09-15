import { Dropdown, Ripple, initTE } from 'tw-elements';

initTE({ Dropdown, Ripple });

function DropDown(props: any) {

  return (
    <div className="relative text-4xl" data-te-dropdown-ref>
      <select
        onChange={props.onChange}
        className="flex items-center whitespace-nowrap rounded bg-blue-800 px-6 pb-2 pt-2.5 text-2xl font-medium uppercase leading-normal text-black shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] motion-reduce:transition-none"
        id="dropdownMenuButton1"
        data-te-dropdown-toggle-ref
        aria-expanded="false"
        data-te-ripple-init
        data-te-ripple-color="dark"
      >
        <option value={0}>
          <span
            className="block w-full whitespace-nowrap bg-transparent px-4 text-xl font-normal text-neutral-700 hover:bg-neutral-100 active:te xt-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
            data-te-dropdown-item-ref
          >
          SPC
          </span>
        </option>
        <option value={1}>
          <span
            className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-xl font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
            data-te-dropdown-item-ref
          >
           WETH
          </span>
        </option>
        <option value={2}>
          <span
            className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-xl font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
            data-te-dropdown-item-ref
          >
            XXX
          </span>
        </option>
      </select>
    </div>
  );
}

export default DropDown;
