import { useConfigs } from '../../lib/useConfigs';
import { useConfig } from '../../lib/useConfig';
import React, { useState, useEffect } from 'react';
import {Stack, Button, Col, Spinner} from 'react-bootstrap';
import { updateOrCreateConfigById, addConfigStrip, deleteConfigStrip, deleteConfigById } from '../../services/DeviceService';
import General from '../general/general';
import { useConfigStrips } from '../../lib/useConfigStrips';
function Configs(props){
    const [configs, {mutate, loading}] = useConfigs(props?.query);
    useEffect(() =>{},[configs]);


    async function createConfig(strip){
        let config = {name : "New Config", brightness : 12};
        config = await updateOrCreateConfigById(config);
        mutate();
    }
    async function deleteConfig(dev){
        let delconfig = {id : dev.id};
        await deleteConfigStrip({config_id : dev.id});
        await deleteConfigById(delconfig);
        let newConfigs = configs.filter(e=> e.id !== dev.id);
        mutate(newConfigs);
    }

    if(!loading){
      return (
        <Stack gap={2} className="col-md-12 my-3 mx-auto"> 
        {configs?.map(dev => (
          <div key={dev.id}>
            <General key={dev.id} id={{id : dev.id}} strip_id={{config_id : dev.id}} name={dev.id}
            addStrip={addConfigStrip}
            deleteStrip={deleteConfigStrip}
            useStrips={useConfigStrips}
            useGeneral={useConfig}
            updateById={updateOrCreateConfigById}
            uuid={`${dev.id}`}
            mutate={mutate}>
              <Col xs={2} md={4}></Col>

              <Button xs={8} md={2} as={Col} className="m-2" variant="danger" onClick={() => deleteConfig(dev)}>
                Delete Config
              </Button>
            </General>
          </div>
        ))}
        <Button xs={6} md={4} as={Col} className='col-4 m-2 align-center center-align' onClick={() => createConfig()}>
          New Config
        </Button>
      </Stack>
      )
    }else{
      return (
        <Spinner></Spinner>
      )
    }
}

export default Configs;