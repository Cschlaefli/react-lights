import { Stack, Button, Card, Form, FloatingLabel, Range } from 'react-bootstrap';
import { getDeviceById } from '../../services/DeviceService';
import React, { useState, useEffect } from 'react';
import RangeSlider from 'react-bootstrap-range-slider';
import Strip from './strip';

function Details(props){
    const address = props.address;
    const name = props.name;
    const [device, setDevice] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [toggle, setToggle] = useState(true);
    const [strips, setStrips] = useState([]);
    const [validated, setValidated] = useState(false);
    const [ brightness, setBrightness ] = useState(1);

    function addStrip(){
        let toAdd = {length : 0, type : "SOLID", index:strips.length};
        setStrips(strips.concat(toAdd));
    }
    function deleteStrip(i){
        setStrips(strips.filter(function(s) { return s.index !== i }));
    }

    useEffect(() => {
        getDeviceById(address).then( (e) => {
            setIsLoaded(true);
            setDevice(e);
            setBrightness(e.strips["1520"].data);
        });
    }, [])
    const handleSubmit = (event) => {
        const form = event.currentTarget;
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }

        setValidated(true);
    }

    if(isLoaded){
        return (<Stack gap={1}>
            <Button onClick={() => setToggle(true)}>{name}</Button>
            <Card>
                <Card.Body>
                   Brightness : { device.strips["1520"].data }
                   <br/>
                   Buffer 1 : {device.strips["1521"].data }
                   <br/>
                   Buffer 2 : {device.strips["1522"].data }
                   <br/>
                   Buffer 3 : {device.strips["1523"].data }
                   <br/>
                   Buffer 4 : {device.strips["1524"].data }
                   <br/>
                   Buffer 5 : {device.strips["1525"].data }
                </Card.Body>
            </Card>
            <Form className='bg-light' validated={validated} onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Brightness :</Form.Label>
                    <RangeSlider value={brightness} onChange={e => setBrightness(e.target.value)} min={1} max={255}/>
                </Form.Group>
                {strips.map((strip, i) => 
                    <div key={i.toString()}>
                        <Strip indx={i} length={strip.length} stripType={strip.stripType}/>
                        <Button variant='danger' onClick={e => deleteStrip(strip.index)}>X</Button>
                    </div>
                )};
                <Button onClick={e => addStrip()}>+</Button>
            </Form>
            </Stack>
        );
    }else{
        return <Button>{name}</Button>;
    }
}

export default Details;