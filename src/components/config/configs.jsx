import Config from './config'
import { useConfigs } from '../../lib/useConfigs';
import React, { useState, useEffect } from 'react';
import Stack from 'react-bootstrap/Stack';
function Configs(props){
    const [configs, {loading}] = useConfigs(props?.query);
    useEffect(() =>{},[configs]);

    if(!loading){
      return (
        <Stack gap={2} className="col-md-12 my-3 mx-auto"> 
        {configs?.map(dev => (
          <Config key={dev.id} id={dev.id} name={dev.name} strips={dev.device_strips}/>
        ))}
      </Stack>
      )
    }else{
      return (<div className='text-light'>...</div>)
    }
}

export default Configs;