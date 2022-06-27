import { Stack, Button, Card, Form, FloatingLabel, Range } from 'react-bootstrap';
import { getDeviceById, updateDeviceById } from '../../services/DeviceService';
import React, { useState, useEffect } from 'react';
import RangeSlider from 'react-bootstrap-range-slider';
import Strip from './strip';

function Details(props){
    const address = props.address;
    const name = props.name;
    const [device, setDevice] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [toggle, setToggle] = useState(false);
    const [strips, setStrips] = useState([]);
    const [validated, setValidated] = useState(false);
    const [brightness, setBrightness ] = useState(1);

    function addStrip(){
        let toAdd = {   Length : 16,
                        Upper : 16,
                        Lower : 0,
                        Speed : 0,
                        Color : "#ffffff",
                        StripType : "Solid",
                        index:strips.length
                    };
        setStrips(strips.concat(toAdd));
    }
    function deleteStrip(i){
        setStrips(strips.filter(function(s) { return s.index !== i }));
    }

    useEffect(() => {
        getDeviceById(address).then( (e) => {
            setIsLoaded(true);
            setDevice(e);
            console.log(e.strips);
            //setBrightness(e.strips["1520"].data);
        });
    }, []);
    const handleChange = (index, property, value) => {
        const newStrips = [...strips];
        newStrips[index][property] = value;
        setStrips(newStrips);
        console.log(strips);
    }



    const handleSubmit = async (event) => {
        const form = event.currentTarget;
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            event.preventDefault();
            event.stopPropagation()
            console.log(strips);
            let res = await updateDeviceById(address, {brightness : brightness, strips : strips });

    }

    if(isLoaded){
        return (<Stack gap={1}>
            <Button onClick={() => setToggle(!toggle)}>{name}</Button>
            {toggle && 
            <div>
                <Card>
                    <Card.Body>
                        Brightness : { device.strips["1520"].data.join("\t") }
                        <br/>
                        Buffer 1 : {device.strips["1521"].data.join("\t") }
                        <br/>
                        Buffer 2 : {device.strips["1522"].data.join("\t") }
                        <br/>
                        Buffer 3 : {device.strips["1523"].data.join("\t") }
                        <br/>
                        Buffer 4 : {device.strips["1524"].data.join("\t") }
                        <br/>
                        Buffer 5 : {device.strips["1525"].data.join("\t") }
                    </Card.Body>
                </Card>
                <Form className='bg-light' validated={validated} onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Brightness :</Form.Label>
                        <RangeSlider value={brightness} onChange={e => setBrightness(e.target.value)} min={1} max={255}/>
                    </Form.Group>
                    {strips.map((strip, i) => 
                        <div key={i.toString()}>
                            <Strip indx={i} strip={strip}
                                handleChange={handleChange}
                                />
                            <Button variant='danger' onClick={e => deleteStrip(strip.index)}>X</Button>
                        </div>
                    )}
                    <Button onClick={e => addStrip()}>+</Button>
                    <Button type="submit">Set Strip</Button>
                </Form>
            </div>
            }
            </Stack>
        );
    }else{
        return <Button>{name}</Button>;
    }
}

export default Details;