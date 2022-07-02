import {Form, FloatingLabel, Range, Col, Row } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import RangeSlider from 'react-bootstrap-range-slider';
import ColorRange from './colorRange';

function Strip(props){
    const [strip, setStrip] = useState(props.strip);
    const [length, setLength] = useState(props.strip.Length);
    const [stripType, setStripType] = useState(props.strip.StripType);
    const [cycleShift, setCycleShift] = useState(props.strip.CycleShift);
    const [rainbowStretch, setRainbowStretch] = useState(props.strip.RainbowStretch);
    const [color, setColor] = useState(props.strip.Color);
    const [speed, setSpeed] = useState(props.strip.Speed);
    const [upper, setUpper] = useState(props.strip.Upper);
    const [lower, setLower] = useState(props.strip.Lower);

    const labelSize = 3;
    const sliderSize = 9;

    const onInputChange = (e) =>{
        let name = e.target.name;
        switch(name){
            case "Length" :
                setLength(e.target.value);
                break;
            case "StripType" :
                setStripType(e.target.value);
                break;
            case "Color" :
                console.log(e.target.value);
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
        <div className='border p-4 m-1' key={props.indx}>
            <Form.Group as={Row} controlId={props.indx + "bleh"}>
                <Col xs={11}>
                    <Form.Label>
                        PLACEHOLDER FOR LOADING SAVED STRIPS
                    </Form.Label>
                </Col>
                <Col xs={1}>
                    {props.children}
                </Col>
            </Form.Group>
            <Form.Group controlId={props.indx + "stripType"}>
                <Form.FloatingLabel label='Strip Type'>
                    <Form.Select className='bg-dark text-light my-2' name="StripType" value={stripType} onChange={e => onInputChange(e) }>
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
                    <RangeSlider name="Length" value={length} onChange={e => onInputChange(e)} min={1} max={500}/>
                </Col>
                <Col xs={2}>
                    <Form.Control className='bg-dark text-light m-1' name="Length" value={length} onChange={e => onInputChange(e)}/>
                </Col>
            </Form.Group>
            {stripType === "Solid" && 
            <Form.Group controlId={props.indx + "stripColor"}>
                    <Form.Control
                        name="Color"
                        type="color"
                        defaultValue={color}
                        value={color}
                        title="Strip Color"
                        onChange={ e => onInputChange(e)}
                        />
            </Form.Group>}

            {(stripType === "Cycle" || stripType === "Rainbow" ) &&
                <div>
                    <Form.Group as={Row} controlId={props.indx + "stripSpeed"}>
                        <Col xs={labelSize}>
                            <Form.Label>Speed :</Form.Label>
                        </Col>
                        <Col xs={sliderSize}>
                            <RangeSlider name="Speed" value={speed} onChange={e => onInputChange(e)} min={0} max={31}/>
                        </Col>
                    </Form.Group>
            {stripType === "Cycle" && 
                    <Form.Group as={Row} controlId={props.indx + "stripCy"}>
                        <Col xs={labelSize}>
                            <Form.Label>Cycle Shift :</Form.Label>
                        </Col>
                        <Col xs={sliderSize}>
                            <RangeSlider name="CycleShift" value={cycleShift} onChange={e => onInputChange(e)} min={0} max={15}/>
                        </Col>
                    </Form.Group>
            }

            {stripType === "Rainbow" && 
                    <Form.Group as={Row} controlId={props.indx + "stripCof"}>
                        <Col xs={labelSize}>
                            <Form.Label>Rainbow Strech :</Form.Label>
                        </Col>
                        <Col xs={sliderSize}>
                            <RangeSlider name="RainbowStretch" value={rainbowStretch} onChange={e => onInputChange(e)} min={0} max={15}/>
                        </Col>
                    </Form.Group>
            }
                    <Form.Group as={Row} controlId={props.indx + "stripUpper"}>
                        <Col xs={labelSize}>
                            <Form.Label>Magnitude :</Form.Label>
                        </Col>
                        <Col xs={sliderSize}>
                            <RangeSlider name="Upper" value={upper} onChange={e => onInputChange(e)} min={0} max={15}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId={props.indx + "stripLower"}>
                        <Col xs={labelSize}>
                            <Form.Label>Offset :</Form.Label>
                        </Col>
                        <Col xs={sliderSize}>
                            <RangeSlider name="Lower" value={lower} onChange={e => onInputChange(e)} min={0} max={15}/>
                        </Col>
                    </Form.Group>
                    <ColorRange max={upper*24} min={lower*24}></ColorRange>
                </div>
            }
        </div>
                )

} 
export default Strip;