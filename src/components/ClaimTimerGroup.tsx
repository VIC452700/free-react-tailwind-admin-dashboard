import React from 'react';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import Button from './Button';

function ClaimTimerGroup(props: any) {
  const [severTime, setServerTime] = useState(0);
  const [timer, setTimer] = useState(0); // 604800 seconds = 7 days
  const [toggleChecked, setToggleChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalForUser, setShowModalForUser] = useState(false);

  // Set timer
  useEffect(() => {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      if (timer === 0) {
        clearInterval(interval);
        setTimer(severTime); // 604800 seconds = 7 days
      }
      return () => {
      clearInterval(interval);
    };
  }, [timer]);

  const handleToggleChange = (event: any) => {
    setToggleChecked(event.target.checked);
    setShowModal(event.target.checked);
  };

  const handleYesClick = () => {
    setShowModal(false);
    setToggleChecked(true);

    setShowModalForUser(true);
    handle();
  };

  const handle=async()=> {
     try {
      const res = await Axios.get("https://defivaultservice.onrender.com/api");
      const data = res.data;
      
      console.log(res.data); //{vaultTime: 518296, userTime: 604696}
      console.log(data["vaultTime"]);
      console.log(data["userTime"]);

      setServerTime(data["userTime"]);
      setTimer(data["userTime"]);

     } catch (error) {
       console.error(error);
     }
   }

  const handleNoClick = () => {
    setShowModal(false);
    setToggleChecked(false);
  };

  const handleYesClickForUser = () => {
    setShowModalForUser(false);
    setToggleChecked(false);
  };

  const handleNoClickForUser = () => {
    setShowModalForUser(true);
    setToggleChecked(true);
  };

  return (

    <div className="sm:container sm:mx-auto sm:px-5 my-10 box-border">
      <div className="h-96 w-full">   
        {toggleChecked && !showModal &&(
          <div className="grid grid-cols-2 auto-rows-max gap-8 md:grid-cols-4">
          <div>
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
        )}

        <label className="relative inline-flex items-center cursor-pointer mt-5">
          <input
            type="checkbox"
            value=""
            className="sr-only peer"
            role="switch"
            checked={toggleChecked}
            onChange={handleToggleChange}
          />
          <div className={`w-19 h-10 rounded-full bg-gray-300 flex items-center transition-colors duration-300 ease-in-out ${toggleChecked ? 'bg-primary' : 'bg-white border border-gray-300'}`}>
            <div className={`w-8 h-8 rounded-full bg-primary shadow-md transform transition-transform duration-300 ease-in-out ${toggleChecked ? 'translate-x-10 bg-white' : 'translate-x-0'}`}></div>
          </div>
          <span className="ml-5 text-3xl font-medium text-red-900 dark:text-red-300">Auto Claim</span>
        </label>

        {toggleChecked && showModal &&(
          <div id="popup-modal" className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-opacity-75 bg-gray-900">
            <div className="relative bg-white rounded-lg shadow-lg p-6 border-primary">
              <button type="button" onClick={handleNoClick} className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-6 text-center">
                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to autoclaim every 7 days?</h3>
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  onClick={handleYesClick}
                  className="text-black bg-white hover:text-white hover:bg-primary mr-6 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  Yes, I'm sure
                </button>
                <button 
                  data-modal-hide="popup-modal"
                  type="button"
                  onClick={handleNoClick}
                  className="text-white bg-primary focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {!toggleChecked && showModalForUser &&(
          <div id="popup-modal" className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-opacity-75 bg-gray-900">
            <div className="relative bg-white rounded-lg shadow-lg p-6 border-primary">
              <button type="button" onClick={handleNoClickForUser} className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-6 text-center">
                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to claim immediately?</h3>
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  onClick={handleYesClickForUser}
                  className="text-black bg-white hover:text-white hover:bg-primary mr-6 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  Yes, I'm sure
                </button>
                <button 
                  data-modal-hide="popup-modal"
                  type="button"
                  onClick={handleNoClickForUser}
                  className="text-white bg-primary focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        )}

          
          
        <div className="flex flex-row px-7 pt-3 mt-5 justify-center items-center">
          { !toggleChecked && <Button text={'Claim'} buttonClicked={props.handleClaimClick}/>}
        </div>
      </div>
    </div>
  );
}

export default ClaimTimerGroup;