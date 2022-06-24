import {Form, FloatingLabel, Range, Col, Row } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import RangeSlider from 'react-bootstrap-range-slider';

function Strip(props){
    const [length, setLength] = useState(props.length);
    const [stripType, setStripType] = useState(props.stripType);
    return (
        <div key={props.indx} className="adsf">
            <Form.Group as={Row} controlId={props.indx + "stripLength"}>
                <Col xs={12}>
                    <Form.Label>Length :</Form.Label>
                </Col>
                <Col xs={9}>
                    <RangeSlider value={length} onChange={e => setLength(e.target.value)} min={1} max={500}/>
                </Col>
                <Col xs={3}>
                    <Form.Control value={length} onChange={e => setLength(e.target.value)}/>
                </Col>
            </Form.Group>
            <Form.Group controlId={props.indx + "stripType"}>
                <Form.FloatingLabel>Strip Type
                    <Form.Select value={stripType} onChange={e => setStripType(e.value)}>
                        <option>Solid</option>
                        <option>Rainbow</option>
                        <option>Cycle</option>
                    </Form.Select>
                </Form.FloatingLabel>
            </Form.Group>
        </div>
                );

} 
export default Strip;