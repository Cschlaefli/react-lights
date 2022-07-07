import Device from './device'
import { useDevices } from '../../lib/useDevices';
import React from 'react';
import Stack from 'react-bootstrap/Stack';
function Devices(props){
    const [devices, {loading}] = useDevices(props?.query);

    if(!loading){
      return (
        <Stack gap={2} className="col-md-12 my-3 mx-auto"> 
        {devices?.map(dev => (
          <Device key={dev.address} address={dev.address} name={dev.name} strips={dev.device_strips}/>
        ))}
      </Stack>
      )
    }else{
      return (<div className='text-light'>...</div>)
    }
}

export default Devices;