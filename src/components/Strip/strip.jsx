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
    const labelSize = {xs : 10, md : 2}
    const sliderSize = {xs : 10, md : 4}

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
                <Button md={1} xs={3} as={Col} className='m-2 mb-4' onClick={_=> setToggle(!toggle)}>-</Button>
                <Button md={1} xs={3} as={Col} className='m-2 mb-4' onClick={e => props.addStrip(strip.id)}>Copy</Button>
                <Button md={1} xs={3} as={Col} className='m-2 mb-4' variant='danger' onClick={e => props.deleteStrip(props._strip)}>X</Button>
                <Col md={2} xs={10}>
                    <Form.FloatingLabel label='Name'>
                        <Form.Control className='bg-dark text-light my-2' name="Name" value={strip.name} 
                        onChange={async e => {
                            const newStrip = {...strip, name : e.target.value};
                            const retStrip = await updateStripById(newStrip);
                            mutate(retStrip);
                        }}/>
                    </Form.FloatingLabel>
                </Col>
                <Col md={2} xs={10}>
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
                <Col md={4} xs={10}>
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
                <Row>
                    <Col xs={labelSize.xs} md={labelSize.md}>
                        <Form.Label>Speed :</Form.Label>
                    </Col>
                    <Col xs={sliderSize.xs} md={sliderSize.md}>
                        <RangeSlider name="Speed" value={strip.speed} 
                        onChange={(e)=> mutate(serializeStrip({...strip, speed : e.target.value}), false)}
                        onAfterChange={async (e) => {
                            const newStrip = {...strip, speed : e.target.value};
                            const retStrip = await updateStripById(newStrip);
                            mutate(retStrip);
                        }
                        } min={0} max={31}/>
                    </Col>
            {strip.stripType === "Cycle" && 
                    <Col xs={labelSize.xs} md={labelSize.md}>
                        <Form.Label>Shift :</Form.Label>
                    </Col>
            }
            {strip.stripType === "Cycle" && 
                    <Col xs={sliderSize.xs} md={sliderSize.md}>
                        <RangeSlider name="CycleShift" value={strip.cycleShift} 
                        onChange={(e)=> mutate(serializeStrip({...strip, cycleShift : e.target.value}), false)}
                        onAfterChange={async(e) => {
                            const newStrip = {...strip, cycleShift : e.target.value};
                            const retStrip = await updateStripById(newStrip);
                            mutate(retStrip);
                        }} min={0} max={15}/>
                    </Col>
            }

            {strip.stripType === "Rainbow" && 
                    <Col xs={labelSize.xs} md={labelSize.md}>
                        <Form.Label>Strech :</Form.Label>
                    </Col>
            }
            {strip.stripType === "Rainbow" && 
                    <Col xs={sliderSize.xs} md={sliderSize.md}>
                        <RangeSlider name="RainbowStretch" value={strip.rainbowStretch} 
                        onChange={(e)=> mutate(serializeStrip({...strip, rainbowStretch : e.target.value}), false)}
                        onAfterChange={async(e) => {
                            const newStrip = {...strip, rainbowStretch : e.target.value};
                            const retStrip = await updateStripById(newStrip);
                            mutate(retStrip);
                        }} min={0} max={15}/>
                    </Col>
            }
                    <Col xs={labelSize.xs} md={labelSize.md}>
                        <Form.Label>Magnitude :</Form.Label>
                    </Col>
                    <Col xs={sliderSize.xs} md={sliderSize.md}>
                        <RangeSlider name="Upper" value={strip.upper} 
                        onChange={(e)=> mutate(serializeStrip({...strip, upper : e.target.value}), false)}
                        onAfterChange={async(e)=>{
                            const newStrip = {...strip, upper : e.target.value};
                            const retStrip = await updateStripById(newStrip);
                            mutate(retStrip);
                        }} min={0} max={15}/>
                    </Col>
                    <Col xs={labelSize.xs} md={labelSize.md}>
                        <Form.Label>Offset :</Form.Label>
                    </Col>
                    <Col xs={sliderSize.xs} md={sliderSize.md}>
                        <RangeSlider name="Lower" value={strip.lower} 
                        onChange={(e)=> mutate(serializeStrip({...strip, lower : e.target.value}), false)}
                        onAfterChange={async(e)=>{
                            const newStrip = {...strip, lower : e.target.value};
                            const retStrip = await updateStripById(newStrip);
                            mutate(retStrip);
                        }} min={0} max={15}/>
                    </Col>
                    <Col xs={12}>
                        <ColorRange max={strip.upper*24} min={strip.lower*24}></ColorRange>
                    </Col>
                </Row>
            }
        </div>
                )
        }else{
            return (
                <div className='border p-4 m-1'>
                    <Form.Group as={Row} controlId={props.indx + "actions"}>
                        <Button md={1} xs={3} as={Col} className='m-2 mb-4' onClick={_=> setToggle(!toggle)}>+</Button>
                        <Button md={1} xs={3} as={Col} className='m-2 mb-4' onClick={e => props.addStrip(strip.id)}>Copy</Button>
                        <Button md={1} xs={3} as={Col} className='m-2 mb-4' variant='danger' onClick={e => props.deleteStrip(props._strip)}>X</Button>
                        <Col md={2} xs={10}>
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
                        <Col md={2} xs={10}>
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
                        <Col md={4} xs={10}>
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
                    </Form.Group>
                </div>
            )
        }

} 
export default Strip;