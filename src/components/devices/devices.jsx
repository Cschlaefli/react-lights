import { useDevices } from '../../lib/useDevices';
import { useDevice } from '../../lib/useDevice';
import { useConfigs } from '../../lib/useConfigs';
import { useConfigStrips } from '../../lib/useConfigStrips';
import { useDeviceStrips } from '../../lib/useDeviceStrips';
import General from '../general/general';
import React from 'react';
import {Stack, Button, Col, Spinner, ToggleButton, Dropdown} from 'react-bootstrap';
import { addDeviceStrip, deleteDeviceStrip, updateDeviceById, updateOrCreateConfigById, addConfigStrip, deleteConfigStrip } from '../../services/DeviceService';
function Devices(props){
    const [devices, {mutate, loading}] = useDevices(props?.query);
    const [configs,  {mutate : configMutate, loading : configLoading}] = useConfigs(props?.query);

    async function createConfig(device){
        let config = {name : device.name, brightness : device.brightness};
        config = await updateOrCreateConfigById(config);
        device.device_strips.forEach(async (e)=> {
            await addConfigStrip({strip_id : e.strip_id, config_id : config.id, strip_order : e.strip_order});
        });
        configMutate();
        let newDevice = {...device, use_config : true, config_id : config.id};
        await updateDeviceById(newDevice);
        mutate();
    }
    

    if(!loading){
      return (
        <Stack gap={2} className="col-md-12 my-3 mx-auto"> 
        {devices?.map(dev => (
          <div key={dev.id}>
            <General key={dev.id} id={{address : dev.address}} strip_id={dev.use_config ? {config_id : dev.config_id} : {address : dev.address}} 
                  name={dev.name}
            addStrip={dev.use_config ? addConfigStrip :addDeviceStrip}
            deleteStrip={dev.use_config ? deleteConfigStrip : deleteDeviceStrip }
            useStrips={dev.use_config ? useConfigStrips : useDeviceStrips}
            useGeneral={useDevice}
            updateById={updateDeviceById}
            uuid={`${dev.address}`}
            mutate={mutate}>
              <Col xs={2}></Col>
              { dev.use_config && !configLoading &&
                <Dropdown as={Col} xs={9} md={2} className="row m-2 p-1">
                  <Dropdown.Toggle className="col btn-info">
                    { dev.config_id  ? configs?.find(e => e.id === dev.config_id)?.name ?? "Select Config" : "Select Config"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="">
                    {configs?.map( (config,i) => (
                      <Dropdown.Item eventkey={i}
                          onClick={ async (e) =>{
                            const newDev = {...dev, config_id  : config.id};
                            await updateDeviceById(newDev);
                            mutate();
                        }}>
                        {config.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              }
              {!dev.use_config &&
                <Button as={Col} md={2} xs={9} className="m-2" onClick={() => createConfig(dev)}>Create Config from Strips</Button>
              }
              <Col xs={2} md={1}></Col>
              <ToggleButton
                className='m-2 col-md-1 col-9'
                type="checkbox"
                variant="outline-info"
                checked={dev.use_config}
                onClick={ async (e) =>{
                  const newDev = {...dev, use_config  : !dev.use_config, config_id : null};
                  await updateDeviceById(newDev);
                  mutate();
                }}>
                {!dev.use_config ? "Use Config" : "Clear Config"}
              </ToggleButton>
            </General>
          </div>
        ))}
      </Stack>
      )
    }else{
      return (
        <Spinner></Spinner>
      )
    }
}

export default Devices;