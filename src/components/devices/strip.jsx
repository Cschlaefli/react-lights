import {Form, FloatingLabel, Range, Col, Row } from 'react-bootstrap';
import { serializeStrip, updateStripById } from '../../services/DeviceService';
import React, { useState, useEffect } from 'react';
import { useStrip } from '../../lib/useStrip';
import RangeSlider from 'react-bootstrap-range-slider';
import ColorRange from './colorRange';
import {deserializeStrip} from "../../services/DeviceService"

function Strip(props){
    const [length, setLength] = useState(props.strip.Length);
    const [stripType, setStripType] = useState(props.strip.StripType);
    const [cycleShift, setCycleShift] = useState(props.strip.CycleShift);
    const [rainbowStretch, setRainbowStretch] = useState(props.strip.RainbowStretch);
    const [color, setColor] = useState(props.strip.Color);
    const [speed, setSpeed] = useState(props.strip.Speed);
    const [upper, setUpper] = useState(props.strip.Upper);
    const [lower, setLower] = useState(props.strip.Lower);
    const [name, setName] = useState(props.strip.name);
    const [strip, {loading, mutate}] = useStrip({id : props.strip.id});

    const labelSize = 3;
    const sliderSize = 9;

    const onInputChange = (e) =>{
        switch(e.target.name){
            case "Name" :
                setName(e.target.value);
                break;
            case "Length" :
                setLength(e.target.value);
                break;
            case "StripType" :
                setStripType(e.target.value);
                break;
            case "Color" :
                setColor(e.target.value);
                break;
            case "Speed" :
                setSpeed(e.target.value);
                break;
            case "Upper" :
                setUpper(e.target.value);
                break;
            case "CycleShift" :
                setCycleShift(e.target.value);
                break;
            case "RainbowStretch" :
                setRainbowStretch(e.target.value);
                break;
            case "Lower" :
                setLower(e.target.value);
                break;
            default :
                break;
        }

        props.handleChange(props.indx, e.target.name, e.target.value);
    }

    useEffect(() => {

    }, [])
    return (
        !loading &&
        <div className='border p-4 m-1' key={props.indx}>
            <Form.Group as={Row} controlId={props.indx + "bleh"}>
                <Col xs={11}>
                    <Form.FloatingLabel label='Name'>
                        <Form.Control className='bg-dark text-light my-2' name="Name" value={strip.name} 
                        onChange={async e => {
                            const newStrip = {...strip, name : e.target.value};
                            const retStrip = await updateStripById(newStrip);
                            mutate(retStrip);
                        }}/>
                    </Form.FloatingLabel>
                </Col>
                <Col xs={1}>
                    {props.children}
                </Col>
            </Form.Group>
            <Form.Group controlId={props.indx + "stripType"}>
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
            </Form.Group>
            <Form.Group as={Row} controlId={props.indx + "stripLength"}>
                <Col xs={3}>
                    <Form.Label>Length :</Form.Label>
                </Col>
                <Col xs={7}>
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
                <Col xs={2}>
                    <Form.Control className='bg-dark text-light m-1' name="Length" value={strip.length} onChange={async (e) => {
                        const newStrip = {...strip, length : e.target.value};
                        const retStrip = await updateStripById(newStrip);
                        mutate(retStrip);
                    }}/>
                </Col>
            </Form.Group>
            {strip.stripType === "Solid" && 
            <Form.Group controlId={props.indx + "stripColor"}>
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
                    <ColorRange max={strip.upper*24} min={strip.lower*24}></ColorRange>
                </div>
            }
        </div>
                )

} 
export default Strip;