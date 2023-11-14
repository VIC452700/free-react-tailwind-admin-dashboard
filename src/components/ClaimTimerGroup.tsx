import React from 'react';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import Button from './Button';
import WarningModal from './WarningModal';

function ClaimTimerGroup(props: any) {
  const [severTime, setServerTime] = useState(0);
  const [timer, setTimer] = useState(0); // 604800 seconds = 7 days
  const [showModal, setShowModal] = useState(false);
  const [showModalForUser, setShowModalForUser] = useState(false);

  let amount = parseFloat(props.lpToken) / 1000;
  let _claimAmount = amount.toFixed(5).toString();
  const [claimAmount, setClaimAmount] = useState(_claimAmount);

  let checked = false; // browser storage
  let initialChecked = localStorage.getItem('toggleChecked');
  if (initialChecked === 'true') checked = true;  
  const [toggleChecked, setToggleChecked] = useState(checked);
 
  useEffect(() => {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      if (timer === 0) {
        clearInterval(interval);
        setTimer(severTime); // 604800 seconds = 7 days
      }
      return () => { clearInterval(interval); };
  }, [timer]);

  const handleToggleChange = (event: any) => {
    setToggleChecked(event.target.checked);
    localStorage.setItem('toggleChecked', event.target.checked);
    setShowModal(event.target.checked);
  };

  const handleYesClick = () => {
    setShowModal(false);
    setToggleChecked(true);
    localStorage.setItem('toggleChecked', 'true');
    setShowModalForUser(true);
    setClaimAmount('0.00005');
    handle();
  };

  const handleNoClick = () => {
    setShowModal(false);
    setToggleChecked(false);
    localStorage.setItem('toggleChecked', 'false');
  };

  const handleYesClickForUser = () => {
    setShowModalForUser(false);
    setToggleChecked(false);
    localStorage.setItem('toggleChecked', 'false');
    setClaimAmount(_claimAmount);
  };

  const handleNoClickForUser = () => {
    setShowModalForUser(true);
    setToggleChecked(true);
    localStorage.setItem('toggleChecked', 'true');
  };

  const handle = async () => {
     try {
      const res = await Axios.get("https://defivaultservice.onrender.com/api");
      const data = res.data;
      setServerTime(data["userTime"]);
      setTimer(data["userTime"]);
     } catch (error) {
       console.error(error);
     }
  }

  if (checked) handle();

  return (
    <div className="border w-full py-3 rounded-2xl px-auto">
      <label className="relative inline-flex items-center cursor-pointer mt-5 ml-11">
        <input
          type="checkbox"
          value=""
          className="sr-only peer"
          role="switch"
          checked={toggleChecked}
          onChange={handleToggleChange}
        />
        <div className={`w-16 h-8 rounded-full bg-gray-300 flex items-center transition-colors duration-300 ease-in-out ${toggleChecked ? 'bg-primary' : 'bg-white border border-gray-300'}`}>
          <div className={`w-7 h-7 rounded-full bg-primary ml-0.5 shadow-md transform transition-transform duration-300 ease-in-out ${toggleChecked ? 'translate-x-8 bg-white' : 'translate-x-0'}`}></div>
        </div>
        <span className="ml-4 text-2xl font-medium">Auto Claim</span>
      </label>
      <div className="grid grid-cols-2 auto-rows-max gap-8 md:grid-cols-4 border my-10 mx-10 py-5 px-12">
          <div>
            <div className='text-sm'>DAYS</div>
            <div className='font-bold text-4xl'>{toggleChecked && !showModal ? Math.floor(timer / (3600*24)).toString().padStart(2, '0') : '00'}:</div>
          </div>
          <div>
            <div className='text-sm'>HOURS</div>
            <div className='font-bold text-4xl'>{toggleChecked && !showModal ? Math.floor(timer % (3600*24) / 3600).toString().padStart(2, '0') : '00'}:</div>
          </div>
          <div>
            <div className='text-sm'>MINUTES</div>
            <div className='font-bold text-4xl'>{toggleChecked && !showModal ? Math.floor(timer % 3600 / 60).toString().padStart(2, '0') : '00'}:</div>
          </div>
          <div>
            <div className='text-sm'>SECONDS</div>
            <div className='font-bold text-4xl'>{toggleChecked && !showModal ? (timer % 60).toString().padStart(2, '0') : '00'}</div>
          </div>
      </div>
      <div className='mx-11 text-lg flex items-center'>
        <span className='font-bold pr-5'>Claimed reward:</span>
        <span className='ml-auto'>{toggleChecked ? '0.00005' : claimAmount} LP</span>
      </div>
      <div className='flex justify-center mt-15 mb-6'>
        <Button text={'Claim'} buttonClicked={props.handleClaimClick} isDisable={toggleChecked}/>
      </div>
        
      {toggleChecked && showModal &&(
        <WarningModal
          handleNoClick={handleNoClick}
          handleYesClick={handleYesClick}
          text="Are you sure you want to autoclaim every 7 days?" 
        />
      )}
      {!toggleChecked && showModalForUser &&(
        <WarningModal
          handleNoClick={handleNoClickForUser}
          handleYesClick={handleYesClickForUser}
          text="Are you sure you want to claim immediately?" 
        />
      )}
    </div>
  );
}

export default ClaimTimerGroup;