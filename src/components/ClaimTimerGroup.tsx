import { ChangeEvent, useState, useEffect } from 'react';
import { MdImportExport } from 'react-icons/md';
import Button from './Button';
import TimerComp from './TimerComp';
import { BiCloudLightRain } from 'react-icons/bi';
import axios from 'axios';

function ClaimTimerGroup(props: any) {
  const [isShownClaimButton, setIsShownClaimButton] = useState('user');
  const [timer, setTimer] = useState(20*60); // 604800 seconds = 7 days

  // Set timer
  useEffect(() => {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      if (timer === 0) {
        clearInterval(interval);
        alert("Hello,");
        setTimer(20*60); // 604800 seconds = 7 days
      }
      return () => {
      clearInterval(interval);
    };
  }, [timer]);


  const handleShow = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsShownClaimButton(event.target.value);

    if (event.target.value === 'vault') setTimer(20*60);
    handle();
  }

  async function handle(): Promise<void> {
     try {
      
       axios.post('https://defivaultservice.onrender.com/test')
      //  axios.post('http://localhost:5000/test')
       .then(function (response) {
        const status = response.data;

        if (status == 'success') {
            console.log("receive");
        }
      });

     } catch (error) {
       console.error(error);
     }
   }

  return (
    <div className="sm:container sm:mx-auto sm:px-5 my-10 box-border">
      {/* <div className="mb-10 text-3xl text-black">Automatic Claim ( Once per 7 days )</div> */}
      <div className="h-96 w-full">
        {/* <label className="text-3xl">Once per 7 days</label> */}
        <div className="grid grid-cols-2 auto-rows-max gap-8 md:grid-cols-4">
          <div >
            <div className='text-soft-red font-bold text-4xl'>{Math.floor(timer / (3600*24)).toString().padStart(2, '0')}:</div>
              <div className='text-sm'>DAYS</div>
            </div>
            <div >
              <div className='text-soft-red font-bold text-4xl'>{Math.floor(timer % (3600*24) / 3600).toString().padStart(2, '0')}:</div>
              <div className='text-sm'>HOURS</div>
            </div>
            <div >
              <div className='text-soft-red font-bold text-4xl'>{Math.floor(timer % 3600 / 60).toString().padStart(2, '0')}:</div>
              <div className='text-sm'>MINUTES</div>
            </div>
            <div >
              <div className='text-soft-red font-bold text-4xl'>{(timer % 60).toString().padStart(2, '0')}</div>
              <div className='text-sm'>SECONDS</div>
            </div>
        </div>
        <div className='flex space-x-3.5 justify-center mt-10 border-t border-b'>
          <div className="flex items-center mt-5 mb-5 w-50 pl-4 border border-gray-200 rounded dark:border-gray-700">
              <input type="radio" name="radioGroup" value="user" checked={isShownClaimButton === 'user'} onChange={handleShow} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label htmlFor="bordered-radio-1" className="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">User</label>
          </div>
          <div className="flex items-center mt-5 mb-5 w-50 pl-4 border border-gray-200 rounded dark:border-gray-700">
              <input type="radio" name="radioGroup" value="vault" checked={isShownClaimButton === 'vault'} onChange={handleShow} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label htmlFor="bordered-radio-2" className="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Vault</label>
          </div>
        </div>
        <div className="flex flex-row px-7 pt-3 mt-5 justify-center items-center">
          { isShownClaimButton === 'user' && <Button text={'Claim'} buttonClicked={props.handleClaimClick}/>}
        </div>
      </div>
    </div>
  );
}

export default ClaimTimerGroup;


{/* <div className="flex items-center space-x-4 justify-center mt-10">
<div className="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700">
  <input
    id="bordered-radio-1"
    type="radio"
    value=""
    name="bordered-radio"
    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
  />
  <label
    htmlFor="bordered-radio-1"
    className="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
  >
    User
  </label>
</div>
<div className="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700">
  <input
    checked
    id="bordered-radio-2"
    type="radio"
    value=""
    name="bordered-radio"
    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
  />
  <label
    htmlFor="bordered-radio-2"
    className="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
  >
    Vault
  </label>
</div>
</div> */}