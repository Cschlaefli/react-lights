import {Form, Col, Row } from 'react-bootstrap';
import {Button } from 'react-bootstrap';
import { serializeStrip, updateStripById } from '../../services/DeviceService';
import React, { useState, useEffect } from 'react';
import { useStrip } from '../../lib/useStrip';
import RangeSlider from 'react-bootstrap-range-slider';
import ColorRange from '../ColorRange/colorRange';

function Strip(props){
    const [strip, {loading, mutate}] = useStrip({id : props.strip.id});
    const [toggle, setToggle] = useState(JSON.parse(window.localStorage.getItem(`strip-${props.uuid}-toggle`)));
    const labelSize = 3;
    const sliderSize = 9;

    useEffect(() =>{
        setToggle(JSON.parse(window.localStorage.getItem(`strip-${props.uuid}-toggle`)));
    }, []);
    useEffect(() => {
        window.localStorage.setItem(`strip-${props.uuid}-toggle`, toggle);
    }, [toggle]);




    if(toggle){

    return (
        !loading &&
        <div className='border p-4 m-1' key={props.indx}>
            <Form.Group as={Row} controlId={props.indx + "actions"}>
                <Col md={2} xs={6}>
                    <Form.FloatingLabel label='Name'>
                        <Form.Control className='bg-dark text-light my-2' name="Name" value={strip.name} 
                        onChange={async e => {
                            const newStrip = {...strip, name : e.target.value};
                            const retStrip = await updateStripById(newStrip);
                            mutate(retStrip);
                        }}/>
                    </Form.FloatingLabel>
                </Col>
                <Col md={2} xs={6}>
                <Form.FloatingLabel label='Strip Type'>
                    <Form.Select className='bg-dark text-light my-2' name="StripType" value={strip.stripType} onChange={async(e) =>{
                        const newStrip = {...strip, stripType : e.target.value};
                        const retStrip = await updateStripById(newStrip);
                        mutate(retStrip);
                    } }>
                        <option value="Solid">Solid</option>
                        <option value="Rainbow">Rainbow</option>
                        <option value="Cycle">Cycle</option>
                    </Form.Select>
                </Form.FloatingLabel>
                </Col>
                <Col md={4} xs={6}>
                    <Form.Label>Length :</Form.Label>
                    <RangeSlider name="Length" value={strip.length} 
                        onChange={(e)=> {
                            const newStrip =  serializeStrip({...strip, length : e.target.value});
                            mutate(newStrip, false);
                        }
                        }
                        onAfterChange={async (e) => {
                            const newStrip = {...strip, length : e.target.value};
                            const retStrip = await updateStripById(newStrip);
                            mutate(retStrip);
                            }
                            } min={1} max={255}/>
                </Col>
                <Col md={1}xs={6}>
                    <Button className='m-3' onClick={e => props.addStrip(strip.id)}>Dupe</Button>
                </Col>
                <Col md={1} xs={6}>
                    <Button className='m-3' onClick={_=> setToggle(!toggle)}>-</Button>
                </Col>
                <Col></Col>
                <Col md={1}xs={6}>
                    <Button className='m-3' variant='danger' onClick={e => props.deleteStrip(props._strip)}>X</Button>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId={props.indx + "stripLength"}>

            </Form.Group>
            {strip.stripType === "Solid" && 
            <Form.Group controlId={props.indx + "stripColor"}>
                    <Form.Label>Color :</Form.Label>
                    <Form.Control
                        name="Color"
                        type="color"
                        value={strip.color}
                        title="Strip Color"
                        onChange={async (e) => {
                            const newStrip = {...strip, color : e.target.value};
                            const retStrip = await updateStripById(newStrip);
                            mutate(retStrip);
                        }}
                        />
            </Form.Group>}

            {(strip.stripType === "Cycle" || strip.stripType === "Rainbow" ) &&
                <div>
                    <Form.Group as={Row} controlId={props.indx + "stripSpeed"}>
                        <Col xs={labelSize}>
                            <Form.Label>Speed :</Form.Label>
                        </Col>
                        <Col xs={sliderSize}>
                            <RangeSlider name="Speed" value={strip.speed} 
                            onChange={(e)=> mutate(serializeStrip({...strip, speed : e.target.value}), false)}
                            onAfterChange={async (e) => {
                                const newStrip = {...strip, speed : e.target.value};
                                const retStrip = await updateStripById(newStrip);
                                mutate(retStrip);
                            }
                            } min={0} max={31}/>
                        </Col>
                    </Form.Group>
            {strip.stripType === "Cycle" && 
                    <Form.Group as={Row} controlId={props.indx + "stripCy"}>
                        <Col xs={labelSize}>
                            <Form.Label>Cycle Shift :</Form.Label>
                        </Col>
                        <Col xs={sliderSize}>
                            <RangeSlider name="CycleShift" value={strip.cycleShift} 
                            onChange={(e)=> mutate(serializeStrip({...strip, cycleShift : e.target.value}), false)}
                            onAfterChange={async(e) => {
                                const newStrip = {...strip, cycleShift : e.target.value};
                                const retStrip = await updateStripById(newStrip);
                                mutate(retStrip);
                            }} min={0} max={15}/>
                        </Col>
                    </Form.Group>
            }

            {strip.stripType === "Rainbow" && 
                    <Form.Group as={Row} controlId={props.indx + "stripCof"}>
                        <Col xs={labelSize}>
                            <Form.Label>Rainbow Strech :</Form.Label>
                        </Col>
                        <Col xs={sliderSize}>
                            <RangeSlider name="RainbowStretch" value={strip.rainbowStretch} 
                            onChange={(e)=> mutate(serializeStrip({...strip, rainbowStretch : e.target.value}), false)}
                            onAfterChange={async(e) => {
                                const newStrip = {...strip, rainbowStretch : e.target.value};
                                const retStrip = await updateStripById(newStrip);
                                mutate(retStrip);
                            }} min={0} max={15}/>
                        </Col>
                    </Form.Group>
            }
                    <Form.Group as={Row} controlId={props.indx + "stripUpper"}>
                        <Col xs={labelSize}>
                            <Form.Label>Magnitude :</Form.Label>
                        </Col>
                        <Col xs={sliderSize}>
                            <RangeSlider name="Upper" value={strip.upper} 
                            onChange={(e)=> mutate(serializeStrip({...strip, upper : e.target.value}), false)}
                            onAfterChange={async(e)=>{
                                const newStrip = {...strip, upper : e.target.value};
                                const retStrip = await updateStripById(newStrip);
                                mutate(retStrip);
                            }} min={0} max={15}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId={props.indx + "stripLower"}>
                        <Col xs={labelSize}>
                            <Form.Label>Offset :</Form.Label>
                        </Col>
                        <Col xs={sliderSize}>
                            <RangeSlider name="Lower" value={strip.lower} 
                            onChange={(e)=> mutate(serializeStrip({...strip, lower : e.target.value}), false)}
                            onAfterChange={async(e)=>{
                                const newStrip = {...strip, lower : e.target.value};
                                const retStrip = await updateStripById(newStrip);
                                mutate(retStrip);
                            }} min={0} max={15}/>
                        </Col>
                    </Form.Group>
                    <Col xs={12}>
                        <ColorRange max={strip.upper*24} min={strip.lower*24}></ColorRange>
                    </Col>
                </div>
            }
        </div>
                )
        }else{
            return (
                <div className='border p-4 m-1'>
                    <Form.Group as={Row} controlId={props.indx + "actions"}>
                        <Col md={2} xs={6}>
                            {!loading &&
                                <Form.FloatingLabel label='Name'>
                                    <Form.Control className='bg-dark text-light my-2' name="Name" value={strip.name} 
                                    onChange={async e => {
                                        const newStrip = {...strip, name : e.target.value};
                                        const retStrip = await updateStripById(newStrip);
                                        mutate(retStrip);
                                    }}/>
                                </Form.FloatingLabel>
                            }
                            {loading &&
                                <Form.FloatingLabel label='Name'>
                                    <Form.Control disabled className='bg-dark text-light my-2' name="Name" value={props.name} />
                                </Form.FloatingLabel>
                            }
                        </Col>
                        <Col md={2} xs={6}>
                            {!loading &&
                                <Form.FloatingLabel label='Strip Type'>
                                    <Form.Select className='bg-dark text-light my-2' name="StripType" value={strip.stripType} onChange={async(e) =>{
                                        const newStrip = {...strip, stripType : e.target.value};
                                        const retStrip = await updateStripById(newStrip);
                                        mutate(retStrip);
                                    } }>
                                        <option value="Solid">Solid</option>
                                        <option value="Rainbow">Rainbow</option>
                                        <option value="Cycle">Cycle</option>
                                    </Form.Select>
                                </Form.FloatingLabel>
                            }
                            {loading &&
                                <Form.FloatingLabel label='Strip Type'>
                                    <Form.Select disabled className='bg-dark text-light my-2' name="StripType" value={props.stripType}>
                                        <option value="Solid">Solid</option>
                                        <option value="Rainbow">Rainbow</option>
                                        <option value="Cycle">Cycle</option>
                                    </Form.Select>
                                </Form.FloatingLabel>
                            }
                        </Col>
                        <Col md={4} xs={6}>
                            <Form.Label>Length :</Form.Label>
                            {!loading &&
                            <RangeSlider name="Length" value={strip.length} 
                                onChange={(e)=> {
                                    const newStrip =  serializeStrip({...strip, length : e.target.value});
                                    mutate(newStrip, false);
                                }
                                }
                                onAfterChange={async (e) => {
                                    const newStrip = {...strip, length : e.target.value};
                                    const retStrip = await updateStripById(newStrip);
                                    mutate(retStrip);
                                    }
                                    } min={1} max={255}/>
                                }
                        </Col>
                        <Col md={1}xs={6}>
                            <Button className='m-3' onClick={e => props.addStrip(strip.id)}>Dupe</Button>
                        </Col>
                        <Col md={1} xs={6}>
                            <Button className="m-3" onClick={_=> setToggle(!toggle)}>+</Button>
                        </Col>
                        <Col></Col>
                        <Col md={1}xs={6}>
                            <Button className='m-3' variant='danger' onClick={e => props.deleteStrip(props._strip)}>X</Button>
                        </Col>
                    </Form.Group>
                </div>
            )
        }

} 
export default Strip;