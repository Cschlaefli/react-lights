import { Stack, Button, CloseButton, Form, Col, Row } from 'react-bootstrap';
import { updateStripById, updateOrCreateConfigById, addConfigStrip, deleteConfigStrip } from '../../services/DeviceService';
import React, { useState, useEffect } from 'react';
import RangeSlider from 'react-bootstrap-range-slider';
import Strip from '../Strip/strip';
import { useConfig } from '../../lib/useConfig';
import { useConfigStrips } from '../../lib/useConfigStrips';

function Config(props){
    const [config, {loading, mutate}] = useConfig({id : props.id})
    const [toggle, setToggle] = useState(JSON.parse(window.localStorage.getItem(`config-${props.id}-toggle`)));
    const [strips, {loading : stripsLoading, mutate : stripsMutate}] = useConfigStrips({config_id :props.id});

    useEffect(() =>{
        setToggle(JSON.parse(window.localStorage.getItem(`config-${props.id}-toggle`)));
    }, []);
    useEffect(() => {
        window.localStorage.setItem(`config-${props.id}-toggle`, toggle);
    }, [toggle]);


    async function addStrip(id){
        let toAdd = {config_id : props.id, strip_order : strips.length+1, strip_id : id};
        if(!id){
            let newId = await updateStripById({name : "New", bytes : 0, });
            toAdd.strip_id = newId.id;
        }
        await addConfigStrip(toAdd);
        stripsMutate();
    }
    async function deleteStrip(strip){
        let delstrip = {strip_order : strip.strip_order, config_id : props.id, strip_id : strip.strip_id}
        await deleteConfigStrip(delstrip);
        stripsMutate();
    }
    async function deleteConfig(config){

    }

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            event.preventDefault();
            event.stopPropagation();
    }

    if(!loading){
        return (<Stack gap={1} className="bg-dark p-3">
            <Row className="m-3">
                <Button className="col-4" onClick={() => setToggle(!toggle)}>{config.name}</Button> 
                <div className='col'></div>
                <Button className="col-1" align="end" variant="danger" onClick={() => deleteConfig(config)}>Delete</Button>
            </Row>
            {toggle && 
            <div>
                <Form className='bg-dark text-light p-3' onSubmit={handleSubmit}>
                    <Form.Group controlId='n'>
                        <Form.FloatingLabel label='Name'>
                            <Form.Control className='bg-dark text-light my-2' value={config.name} onChange={async (e) =>{
                                const newConf = {...config, name : e.target.value};
                                await updateOrCreateConfigById(newConf);
                                mutate(newConf);
                            } }/>
                        </Form.FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Row} controlId='b'>
                        <Col xs={1}>
                            <Form.Label>Brightness :</Form.Label>
                        </Col>
                        <Col xs={10}>
                            <RangeSlider value={config.brightness}
                                onChange={(e)=> mutate({...config, brightness : e.target.value}, false)}
                                onAfterChange={async (e) => {
                                    const newConf = {...config, brightness : e.target.value};
                                    await updateOrCreateConfigById(newConf);
                                    mutate(newConf);
                                    }
                                } min={1} max={255}/>
                        </Col>
                    </Form.Group>
                    {!stripsLoading && strips && strips?.map((strip, i) => 
                        <div key={i.toString()}>
                            <Strip indx={i} strip={strip.strip} name={strip.strip.name} 
                                    stripType={strip.strip.stripType}
                                    _strip={strip}
                                    uuid={`${strip.config_id}-${strip.strip_id}-${strip.strip_order}`}
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

export default Config;