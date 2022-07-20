import { Stack, Button,  Form, Col, Row, Dropdown } from 'react-bootstrap';
import {  updateOrCreateSchedule, deleteSchedule } from '../../services/DeviceService';
import React, { useState, useEffect } from 'react';
import { useSchedules } from '../../lib/useSchedules';
import { useConfigs } from '../../lib/useConfigs';
import { useDevices } from '../../lib/useDevices';
import ScheduleDetails from './scheduleDetails';

function Schedules(props){
    
    const [schedules, {loading, mutate}] = useSchedules(props?.query);
    const [devices, {loading : devicesLoading}] = useDevices(props?.query);
    const [configs, {loading : configsLoading}] = useConfigs(props?.query);
    const [config, setConfig] = useState(null);
    const [device, setDevice] = useState(null);
    const [hour, setHour] = useState(0);
    const [min, setMin] = useState(0);
    const [name, setName] = useState("");

    async function addSchedule(){
        let sched = {device_address : device.address, config_id : config.id, name : name, start_hour :hour, start_min : min};
        await updateOrCreateSchedule(sched);
        mutate();
    }
    
    return (<Stack gap={1} className='bg-dark p-3'>
        <Form as={Row}>
            <Form.Group as={Row} controlId='n'>

            <Col xs={9} md={2}>
                <Form.FloatingLabel className="text-light" label='Name'>
                    <Form.Control className='bg-dark text-light my-2' value={name} onChange={(e) => { setName(e.target.value)}} />
                </Form.FloatingLabel>
            </Col>
            {!devicesLoading &&
                <Dropdown as={Col} xs={9} md={2} className="row m-2 p-1">
                  <Dropdown.Toggle className={`col btn-${device ? "info" : "warning" }`}>
                    Device : { device?.name  ?? "Select"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="">
                    {devices?.map( (dev,i) => (
                      <Dropdown.Item eventkey={i}
                          onClick={ async (e) =>{
                            setDevice(dev);
                        }}>
                        {dev.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              }
            {!configsLoading &&
                <Dropdown as={Col} xs={9} md={2} className="row m-2 p-1">
                  <Dropdown.Toggle className={`col btn-${config ? "info" : "warning" }`}>
                    Config : { config?.name  ?? "Select Config"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="">
                    {configs?.map( (conf,i) => (
                      <Dropdown.Item eventkey={i}
                          onClick={ async (e) =>{
                            setConfig(conf);
                        }}>
                        {conf.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              }
            <Col xs={9} md={2}>
            <Form.FloatingLabel className="text-light" label='Hour'>
                <Form.Control className='bg-dark text-light m-2' value={hour} onChange={ (e) => { setHour(e.target.value); }}/>
            </Form.FloatingLabel>
            </Col>
            <Col xs={9} md={2}>
              <Form.FloatingLabel className="text-light" label='Min'>
                  <Form.Control className='bg-dark text-light my-2' value={min} onChange={ (e) => {setMin(e.target.value)}} />
              </Form.FloatingLabel>
            </Col>
            <Button as={Col} xs={9} md={2} className="my-2" onClick={addSchedule} variant={(device && config) ? "primary" : "danger"}>
              {(device && config) ? "Create Event" : "Select a Config and Device first"}
            </Button>
              </Form.Group>
        </Form>
        {!loading && schedules?.map( (sched) =>(
          <div key={sched.id}>
            <Row>
              <Col className='text-light'>
                <ScheduleDetails schedule={sched}></ScheduleDetails>
              </Col>
            </Row>
          </div>
        ))}

        </Stack>
    );
}

export default Schedules;