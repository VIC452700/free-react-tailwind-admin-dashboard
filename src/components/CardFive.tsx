import { BsFileRichtext } from 'react-icons/bs';
import { FaEthereum } from 'react-icons/fa';
const CardFive = () => {
  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex item-center">
        <BsFileRichtext style={{ fontSize: '4em' }}/>
        <h1 className="text-xl font-bold mt-auto mb-auto ml-4">LAST HARVEST</h1>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white">
            21 minutes ago
          </h4>
        </div>
      </div>
    </div>
  );
};

export default CardFive;
