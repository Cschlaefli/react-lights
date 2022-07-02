import Details from './details'
import { getDevices } from '../../services/DeviceService';
import React, { useState, useEffect } from 'react';
import Stack from 'react-bootstrap/Stack';
function Devices(props){
    const [devices, setDevices] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getDevices().then( (e) => {
        setIsLoaded(true);
        console.log(e.map(e=> e).concat(""));
        setDevices(e);       
    })

  }, [])

    if(isLoaded){
        return (<Stack gap={2} className="col-md-5 mx-auto"> 
          {devices.map(dev => (
            <Details key={dev.address} address={dev.address} name={dev.name} strips={dev.stripDef}/>
          ))}
        </Stack>
        )
    }else{
        return <div>...</div>
    }
}

export default Devices;