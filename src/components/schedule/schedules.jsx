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
    const [name, setName] = useState("");

    async function addSchedule(){
        let sched = {device_address : device.address, config_id : config.id, name : name};
        await updateOrCreateSchedule(sched);
        mutate();
    }
    
    return (<Stack gap={1} className='bg-dark p-3'>
        <Form as={Row}>
            <Form.Group as={Row} controlId='n'>
            <Button as={Col} xs={9} md={2} onClick={addSchedule} variant={(device && config) ? "primary" : "danger"}>
                {(device && config) ? "Create Schedule" : "Need to select a Config and Device"}
            </Button>
            <Col xs={9} md={2}>
                <Form.FloatingLabel className="text-light" label='Name'>
                    <Form.Control className='bg-dark text-light my-2' value={name} onChange={(e) => { setName(e.target.value)}} />
                </Form.FloatingLabel>
            </Col>
            {!configsLoading &&
                <Dropdown as={Col} xs={9} md={2} className="row m-2 p-1">
                  <Dropdown.Toggle className="col btn-info">
                    { config?.name  ?? "Select Config"}
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
            {!devicesLoading &&
                <Dropdown as={Col} xs={9} md={2} className="row m-2 p-1">
                  <Dropdown.Toggle className="col btn-info">
                    { device?.name  ?? "Select Device"}
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
              </Form.Group>
        </Form>
        {!loading && schedules?.map( sched=>(
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