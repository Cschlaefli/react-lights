import { Stack, Button,  Form, Col, Row, Dropdown,ToggleButton, Spinner } from 'react-bootstrap';
import {  updateOrCreateSchedule, deleteSchedule } from '../../services/DeviceService';
import React, { useState, useEffect } from 'react';
import { useSchedules } from '../../lib/useSchedules';
import { useConfigs } from '../../lib/useConfigs';
import { useDevices } from '../../lib/useDevices';

function ScheduleDetails(props){
    
    const [schedules, {loading, mutate}] = useSchedules({id : props.schedule.id});
    const [devices, {loading : devicesLoading}] = useDevices(props?.query);
    const [configs, {loading : configsLoading}] = useConfigs(props?.query);

    if(!loading){

    return (
        <Form as={Row}>
            <Form.Group as={Row} controlId='n'>
            <Col xs={9} md={2}>
                {!loading &&
                <Form.FloatingLabel className="text-light" label='Event Name'>
                    <Form.Control className='bg-dark text-light my-2' value={schedules.name} onChange={
                      async (e) => { 
                          const newSch = {...schedules, name : e.target.value};
                          await updateOrCreateSchedule(newSch);
                          mutate(newSch);
                        }} />
                </Form.FloatingLabel>
                }
            </Col>
            {!devicesLoading &&
                <Dropdown as={Col} xs={9} md={2} className="row m-2 p-1">
                  <Dropdown.Toggle className="col btn-info">
                    Device :  { schedules.device.name  ?? "Select"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="">
                    {devices?.map( (dev,i) => (
                      <Dropdown.Item eventkey={i}
                          onClick={ async (e) =>{
                            const newSch = {...schedules, device_address : dev.address};
                            await updateOrCreateSchedule(newSch);
                            mutate(newSch);
                        }}>
                        {dev.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              }
            {!configsLoading &&
                  <Dropdown as={Col} xs={9} md={2} className="row m-2 p-1">
                    <Dropdown.Toggle className="col btn-info">
                      Config : { schedules.config.name  ?? "Select"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="">
                      {configs?.map( (conf,i) => (
                        <Dropdown.Item eventkey={i}
                            onClick={ async (e) =>{
                              const newSch = {...schedules, config_id : conf.id};
                              await updateOrCreateSchedule(newSch);
                              mutate(newSch);
                          }}>
                            {conf.name}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                </Dropdown>
              }

            <Col xs={9} md={2}>
            <Form.FloatingLabel className="text-light" label='Hour'>
                <Form.Control className='bg-dark text-light my-2' value={schedules.start_hour} onChange={
                  async (e) => { 
                      const newSch = {...schedules, start_hour : e.target.value};
                      await updateOrCreateSchedule(newSch);
                      mutate(newSch);
                    }} />
            </Form.FloatingLabel>
            </Col>
            <Col xs={9} md={2}>
              <Form.FloatingLabel className="text-light" label='Min'>
                  <Form.Control className='bg-dark text-light my-2' value={schedules.start_min} onChange={
                    async (e) => { 
                        const newSch = {...schedules, start_min : e.target.value};
                        await updateOrCreateSchedule(newSch);
                        mutate(newSch);
                      }} />
              </Form.FloatingLabel>
            </Col>
              {schedules.has_run &&
              <ToggleButton
                className='m-2 col-md-1 col-9'
                type="checkbox"
                variant="outline-warning"
                checked={schedules.has_run}
                onClick={ async (e) =>{
                  const newSch = {...schedules, has_run : false};
                  await updateOrCreateSchedule(newSch);
                  mutate(newSch);
                }}>
                {schedules.has_run ? "Re-run" : "Already run"}
                </ToggleButton>
              }
            <Row>
              <Button as={Col} xs={9} md={4} variant='danger' onClick={async () => await deleteSchedule(schedules)}>
                Delete Event {schedules.name}
              </Button>
            </Row>
            </Form.Group>
        </Form>
    );
    }else{
      <Spinner></Spinner>
    }    
}

export default ScheduleDetails;