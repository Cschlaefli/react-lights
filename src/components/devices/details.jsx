import { Stack, Button, Card, Form, FloatingLabel, Range } from 'react-bootstrap';
import { deleteDeviceStrip, addDeviceStrip, updateDeviceById, updateStripById } from '../../services/DeviceService';
import React, { useState, useEffect } from 'react';
import RangeSlider from 'react-bootstrap-range-slider';
import Strip from './strip';
import { useDevice } from '../../lib/useDevice';
import { useDeviceStrips } from '../../lib/useDeviceStrips';

function Details(props){
    const [device, {loading, mutate}] = useDevice({id : props.address})
    //const [device, setDevice] = useState(null);
    const [toggle, setToggle] = useState(false);
    //const [strips, setStrips] = useState(props.strips ?? []);
    const [strips, {loading : stripsLoading, mutate : stripsMutate}] = useDeviceStrips({device_address :props.address});
    const [validated, setValidated] = useState(false);
    const [name, setName ] = useState(props.name);
    const [debug, setDebug ] = useState(true);

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

    useEffect(() => {
    }, []);



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
                <Form className='bg-dark text-light p-3' validated={validated} onSubmit={handleSubmit}>
                    <Form.Group controlId='n'>
                        <Form.FloatingLabel label='Name'>
                            <Form.Control className='bg-dark text-light my-2' value={device.name} onChange={async (e) =>{
                                const newDev = {...device, name : e.target.value};
                                await updateDeviceById(newDev);
                                mutate(newDev);
                            } }/>
                        </Form.FloatingLabel>
                    </Form.Group>
                    <Form.Group controlId='b'>
                        <Form.Label>Brightness :</Form.Label>
                        <RangeSlider value={device.brightness}
                            onChange={(e)=> mutate({...device, brightness : e.target.value}, false)}
                            onAfterChange={async (e) => {
                                const newDev = {...device, brightness : e.target.value};
                                await updateDeviceById(newDev);
                                mutate(newDev);
                            }
                            } min={1} max={255}/>
                    </Form.Group>
                    {!stripsLoading && strips && strips?.map((strip, i) => 
                        <div key={i.toString()}>
                            <Strip indx={i} strip={strip.strip}>
                                <Button variant='danger' onClick={e => deleteStrip(strip)}>X</Button>
                            </Strip>
                            <Button className='m-3' onClick={e => addStrip(strip.strip.id)}>Duplicate</Button>
                        </div>
                    )}
                    <Button className='m-3' onClick={e => addStrip()}>New Strip</Button>
                </Form>
            </div>
            }
            </Stack>
        )
    }else{
        return <Button>{name}</Button>
    }
}

export default Details;