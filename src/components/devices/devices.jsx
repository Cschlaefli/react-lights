import Details from './details'
import { useDevices } from '../../lib/useDevices';
import React, { useState, useEffect } from 'react';
import Stack from 'react-bootstrap/Stack';
function Devices(props){
    const [devices, {loading}] = useDevices();
    useEffect(() =>{},[devices]);

    if(!loading){
      return (
        <Stack gap={2} className="col-md-5 mx-auto"> 
        {devices?.map(dev => (
          <Details key={dev.address} address={dev.address} name={dev.name} strips={dev.device_strips}/>
        ))}
      </Stack>
      )
    }else{
      return (<div className='text-light'>...</div>)
    }
}

export default Devices;