import { Stack, Button,  Form, Col, Row } from 'react-bootstrap';
import { deleteDeviceStrip, addDeviceStrip, updateDeviceById, updateStripById, updateOrCreateConfigById, addConfigStrip } from '../../services/DeviceService';
import React, { useState, useEffect } from 'react';
import RangeSlider from 'react-bootstrap-range-slider';
import Strip from '../Strip/strip';
import { useDevice } from '../../lib/useDevice';
import { useDeviceStrips } from '../../lib/useDeviceStrips';

function Device(props){
    const [device, {loading, mutate}] = useDevice({address : props.address})
    const [toggle, setToggle] = useState(JSON.parse(window.localStorage.getItem(`device-${props.address}-toggle`)));
    const [strips, {loading : stripsLoading, mutate : stripsMutate}] = useDeviceStrips({device_address :props.address});

    useEffect(() =>{
        setToggle(JSON.parse(window.localStorage.getItem(`device-${props.address}-toggle`)));
    }, []);
    useEffect(() => {
        window.localStorage.setItem(`device-${props.address}-toggle`, toggle);
    }, [toggle]);

    async function addStrip(id){
        let toAdd = {device_address : props.address, strip_order : strips.length+1, strip_id : id};
        if(!id){
            let newId = await updateStripById({name : "New", bytes : 0, });
            toAdd.strip_id = newId.id;
        }
        await addDeviceStrip(toAdd);
        stripsMutate();
    }
    async function deleteStrip(strip){
        let delstrip = {strip_order : strip.strip_order, device_address : strip.device_address, strip_id : strip.strip_id}
        await deleteDeviceStrip(delstrip);
        stripsMutate();
    }

    async function createConfig(strip){
        let config = {name : strip.name, brightness : strip.brightness};
        config = await updateOrCreateConfigById(config);
        strips.forEach(async (e)=> {
            let cs = await addConfigStrip({strip_id : e.strip_id, config_id : config.id, strip_order : e.strip_order});
        });
    }

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            event.preventDefault();
            event.stopPropagation();
            //let res = await updateDeviceById(device);
            //setDevice(res);
    }

    if(!loading){
        return (<Stack gap={1}>
            <Button onClick={() => setToggle(!toggle)}>{device.name}</Button>
            {toggle && 
            <div>
                <Form className='bg-dark text-light p-3' onSubmit={handleSubmit}>
                    <Form.Group as={Row} controlId='n'>
                        <Col xs={10}>
                            <Form.FloatingLabel label='Name'>
                                <Form.Control className='bg-dark text-light my-2' value={device.name} onChange={async (e) =>{
                                    const newDev = {...device, name : e.target.value};
                                    await updateDeviceById(newDev);
                                    mutate(newDev);
                                } }/>
                            </Form.FloatingLabel>
                        </Col>
                        <Col xs={2}>
                            <Button onClick={() => createConfig(device)}>Create Config</Button>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId='b'>
                        <Col xs={1}>
                            <Form.Label>Brightness :</Form.Label>
                        </Col>
                        <Col xs={10}>
                            <RangeSlider value={device.brightness}
                                onChange={(e)=> mutate({...device, brightness : e.target.value}, false)}
                                onAfterChange={async (e) => {
                                    const newDev = {...device, brightness : e.target.value};
                                    await updateDeviceById(newDev);
                                    mutate(newDev);
                                }
                                } min={1} max={255}/>
                        </Col>
                    </Form.Group>
                    {!stripsLoading && strips && strips?.map((strip, i) => 
                        <div key={i.toString()}>
                            <Strip indx={i} strip={strip.strip} name={strip.strip.name} 
                                    stripType={strip.strip.stripType} 
                                    _strip={strip}
                                    uuid={`${strip.device_address}-${strip.strip_id}-${strip.strip_order}`}
                                    addStrip={addStrip}
                                    deleteStrip={deleteStrip}
                                    >
                            </Strip>
                        </div>
                    )}
                    <Button className='m-3' onClick={e => addStrip()}>New Strip</Button>
                </Form>
            </div>
            }
            </Stack>
        )
    }else{
        return <Button>{props.name}</Button>
    }
}

export default Device;