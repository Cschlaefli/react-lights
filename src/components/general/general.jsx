import { Stack, Button,  Form, Col, Row } from 'react-bootstrap';
import {  updateStripById } from '../../services/DeviceService';
import React, { useState, useEffect } from 'react';
import RangeSlider from 'react-bootstrap-range-slider';
//import RangeSlider from '../rangeSlider/index';
import Strip from '../Strip/strip';

function General(props){
    const deleteGeneralStrip = props.deleteStrip;
    const addGeneralStrip = props.addStrip;
    const updateById = props.updateById;
    const useStrips = props.useStrips;
    const [strips, {loading : stripsLoading, mutate : stripsMutate}] = useStrips(props.strip_id);
    const [general, {loading, mutate}] = props.useGeneral(props.id);
    const [toggle, setToggle] = useState(JSON.parse(window.localStorage.getItem(`${props.uuid}-toggle`)));

    async function addStrip(id){
        let toAdd = {...props.strip_id, strip_order : strips.length+1, strip_id : id};
        if(!id){
            let newId = await updateStripById({name : "New", bytes : 0, });
            toAdd.strip_id = newId.id;
        }
        await addGeneralStrip(toAdd);
        stripsMutate();
    }

    async function deleteStrip(strip){
        let delstrip = {...props.strip_id, strip_order : strip.strip_order, device_address : strip.device_address, config_id : strip.config_id, strip_id : strip.strip_id}
        await deleteGeneralStrip(delstrip);
        stripsMutate();
    }


    useEffect(() =>{
        setToggle(JSON.parse(window.localStorage.getItem(`${props.uuid}-toggle`)));
    }, []);
    useEffect(() => {
        window.localStorage.setItem(`${props.uuid}-toggle`, toggle);
    }, [toggle]);

    if(!loading){
        return (<Stack gap={1} className='bg-dark p-3'>
            {!toggle &&
            <Row className="p-3">
                <Col md={1} xs={6}>
                    <Button className="m-2" onClick={_=> setToggle(!toggle)}>+</Button>
                </Col>
                <Button className="col-4 text-left m-2" onClick={() => setToggle(!toggle)}>{general.name}</Button>
                {props.children} 
            </Row>
            }
            {toggle && 
            <div>
                <Form className='bg-dark text-light p-3'>
                    <Form.Group as={Row} controlId='n'>
                        <Col md={1} xs={6}>
                            <Button className="m-2" onClick={_=> setToggle(!toggle)}>-</Button>
                        </Col>
                        <Col xs={4}>
                            <Form.FloatingLabel label='Name'>
                                <Form.Control className='bg-dark text-light my-2' value={general.name}
                                onChange={async (e) =>{
                                    const newDev = {...general, name : e.target.value};
                                    await updateById(newDev);
                                    mutate(newDev);
                                } }/>
                            </Form.FloatingLabel>
                        </Col>
                        <Col xs={4}>
                            <Form.FloatingLabel label='Brightness'>
                                <RangeSlider 
                                    className="my-2"
                                    value={general.brightness}
                                    onChange={(e)=> mutate({...general, brightness : e.target.value}, false)}
                                    onAfterChange={async (e) => {
                                        const newDev = {...general, brightness : e.target.value};
                                        await updateById(newDev);
                                        mutate(newDev);
                                    }
                                    } min={1} max={255}/>
                            </Form.FloatingLabel>
                        </Col>
                        <Col xs={2}>
                        </Col>
                        <Col>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId='b'>
                        {!stripsLoading && strips && strips?.map((strip, i) => 
                            <div key={i.toString()}>
                                <Strip indx={i} strip={strip.strip} name={strip.strip.name} 
                                        stripType={strip.strip.stripType} 
                                        _strip={strip}
                                        uuid={`${strip?.device_address}-${strip?.config_id}-${strip.strip_id}-${strip.strip_order}`}
                                        addStrip={addStrip}
                                        deleteStrip={deleteStrip}
                                        >
                                </Strip>
                            </div>
                        )}
                    <Button className='m-3' onClick={e => addStrip()}>New Strip</Button>
                    </Form.Group>
                </Form>
            </div>
            }
            </Stack>
        )
    }else{
        return <Button className='m-2'>{props.name}</Button>
    }
}

export default General;