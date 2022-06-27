import {Form, FloatingLabel, Range, Col, Row } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import RangeSlider from 'react-bootstrap-range-slider';
import ColorRange from './colorRange';

function Strip(props){
    const [strip, setStrip] = useState(props.strip);
    const [length, setLength] = useState(props.strip.Length);
    const [stripType, setStripType] = useState(props.strip.StripType);
    const [color, setColor] = useState(props.strip.Color);
    const [speed, setSpeed] = useState(props.strip.Speed);
    const [upper, setUpper] = useState(props.strip.Upper);
    const [lower, setLower] = useState(props.strip.Lower);

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
                setColor(e.target.value);
                break;
            case "Speed" :
                setSpeed(e.target.value);
                break;
            case "Upper" :
                setUpper(e.target.value);
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
        <div key={props.indx}>
            <Form.Group as={Row} controlId={props.indx + "stripLength"}>
                <Col xs={12}>
                    <Form.Label>Length :</Form.Label>
                </Col>
                <Col xs={9}>
                    <RangeSlider name="Length" value={length} onChange={e => onInputChange(e)} min={1} max={500}/>
                </Col>
                <Col xs={3}>
                    <Form.Control name="Length" value={length} onChange={e => onInputChange(e)}/>
                </Col>
            </Form.Group>
            <Form.Group controlId={props.indx + "stripType"}>
                <Form.FloatingLabel>Strip Type
                    <Form.Select name="StripType" value={stripType} onChange={e => onInputChange(e) }>
                        <option value="Solid">Solid</option>
                        <option value="Rainbow">Rainbow</option>
                        <option value="Cycle">Cycle</option>
                    </Form.Select>
                </Form.FloatingLabel>
            </Form.Group>
            {stripType === "Solid" && 
            <Form.Group controlId={props.indx + "stripColor"}>
                    <Form.Control
                        name="Color"
                        type="color"
                        value={color}
                        title="Strip Color"
                        onChange={ e => onInputChange(e)}
                        />
            </Form.Group>}

            {(stripType === "Cycle" || stripType === "Rainbow" ) &&
                <div>
                    <Form.Group controlId={props.indx + "stripSpeed"}>
                        <Form.Label>Speed :</Form.Label>
                        <RangeSlider name="Speed" value={speed} onChange={e => onInputChange(e)} min={0} max={31}/>
                    </Form.Group>
                    <Form.Group controlId={props.indx + "stripUpper"}>
                        <Form.Label>Upper Color Boundary :</Form.Label>
                        <RangeSlider name="Upper" value={upper} onChange={e => onInputChange(e)} min={0} max={15}/>
                    </Form.Group>
                    <Form.Group controlId={props.indx + "stripLower"}>
                        <Form.Label>Lower Color Boundary :</Form.Label>
                        <RangeSlider name="Lower" value={lower} onChange={e => onInputChange(e)} min={0} max={15}/>
                    </Form.Group>
                    <ColorRange max={upper*22.5} min={lower*22.5}></ColorRange>
                </div>
            }
        </div>
                );

} 
export default Strip;