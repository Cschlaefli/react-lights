import Color from 'color';

global.Buffer = global.Buffer || require('buffer').Buffer
const baseUrl = "http://ruse:3000"

export async function getDevices(){
    let test = await fetch(`${baseUrl}/dev/`);
    if(test.status === 200){
        return await test.json();
    }
    return [];
}

export async function getDeviceById(id){
    return await (await fetch(`${baseUrl}/dev/${id}`)).json();
}

export async function updateDeviceById(device){
    console.log(device);
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(device)
    };
    return await fetch(`${baseUrl}/dev`, requestOptions);
}

export async function addDeviceStrip(deviceStrip){
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deviceStrip)
    };
    return await fetch(`${baseUrl}/dev_strips`, requestOptions);
}

export async function deleteDeviceStrip(deviceStrip){
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deviceStrip)
    };
    return await fetch(`${baseUrl}/dev_strips`, requestOptions);
}

export async function updateStripById(strip){
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serializeStrip(strip))
    };
    return await (await fetch(`${baseUrl}/strips`, requestOptions)).json();
}
export async function addConfigStrip(configStrip){
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configStrip)
    };
    return await (await fetch(`${baseUrl}/config_strips`, requestOptions)).json();
}

export async function deleteConfigStrip(configStrip){
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configStrip)
    };
    return (await fetch(`${baseUrl}/config_strips`, requestOptions));
}

export async function deleteConfigById(config){
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
    };
    return await (await fetch(`${baseUrl}/config`, requestOptions)).json();
}
export async function updateOrCreateConfigById(config){
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
    };
    return await (await fetch(`${baseUrl}/config`, requestOptions)).json();
}
export async function updateOrCreateSchedule(sched){
    console.log(sched);
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sched)
    };
    return await (await fetch(`${baseUrl}/schedule`, requestOptions)).json();
}
export async function deleteSchedule(sched){
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sched)
    };
    return await (await fetch(`${baseUrl}/schedule`, requestOptions)).json();
}

const Cycle = 0;
//const Cycle_NoBounce = 1;
const Rainbow = 2;

export function deserializeStrip(strip){
    //console.log("bytes",strip.bytes);
    let l = strip.bytes & 255;
    let r = (strip.bytes >>> 8)  & 255;
    let g = (strip.bytes >>> 16) & 255;
    let b = (strip.bytes >>> 24) & 255;
    let upper = (strip.bytes >>> 24) & 15;
    let lower = (strip.bytes >>> 28) & 15;
    let speed = (r  & 248) >>> 3;

    let ret = {...strip, color:Color(1.0), length:l, upper:upper, lower:lower, otherParam:g, cycleShift:g&15, rainbowStretch:g&15,  speed:speed};


    ret.color = Color.rgb(r,g,b).hex();

    if(l % 2 === 0){
        ret.stripType = "Solid";
    }else{
        let stype = r & 7;
        switch(stype){
            case 0 :
                ret.stripType = "Cycle";
                break;
            case 2 :
                ret.stripType = "Rainbow";
                break;
            default :
                ret.stripType = "Cycle";
        }
    }

    return ret;
}

export function serializeStrip(strip){
    let bytes = 0;
    let len = Number(strip.length);
    let otherParam = 0;

    if(strip.stripType === "Solid"){
        if(len % 2 !== 0 ){len -= 1}
        let color = Color(strip.color)

        strip.r = color.color[0];
        strip.g = color.color[1];
        strip.b = color.color[2];

        bytes += (strip.r << 8);
        bytes += (strip.g << 16);
        bytes += ((strip.b << 24) >>> 0);
    }else{
        if(len % 2 === 0 ){len -= 1}
        switch(strip.stripType){
            case "Rainbow":
                otherParam = strip.rainbowStretch;
                bytes += Rainbow << 8;
                break;
            case "Cycle" :
                otherParam = strip.cycleShift;
                bytes += Cycle << 8;
                break;
            default :
                otherParam = strip.cycleShift;
                break;
        }
        bytes += Number(strip.speed) << 11;
        bytes += Number(otherParam)  << 16;
        bytes += Number(strip.upper) << 24;
        bytes += (Number(strip.lower) << 28) >>> 0;
    }
    bytes += (len & 255);

    //console.log(bytes);

    let ret = {name :strip.name, bytes : bytes, id : strip.id};
    return ret;

}
/*
function serializeStrips(stripDef){
    let currBuffer = 1;
    let bufferList = {"1520" : Buffer.from([Number(stripDef.brightness)])};
    let prefix = '152';
    for(var strip of stripDef.strips){
        let length = strip.Length;
        let stripType = strip.StripType;
        let color = strip.Color;
        let upper = strip.Upper;
        let lower = strip.Lower;
        let speed = strip.Speed;
        let cycleShift = strip.CycleShift;
        let rainbowStretch = strip.RainbowStretch;
        let buff = `${prefix}${currBuffer}`;
        switch(stripType){
            case "Solid" :
                length = length % 2 === 0 ? length : length -1;
                while(length > 254){
                    length -= 254;
                    buff = `${prefix}${currBuffer}`;
                    bufferList[buff] = Buffer.from([254, color]);
                    currBuffer += 1;
                }
                buff = `${prefix}${currBuffer}`;
                bufferList[buff] = Buffer.from([254, color]);
                break;
            default :
                let ty = Cycle;
                let otherParam = 0;
                if(stripType === "Cycle"){ 
                    ty = Cycle;
                    otherParam = cycleShift;
                }
                if(stripType === "Rainbow"){ 
                    ty = Rainbow;
                    otherParam = rainbowStretch;
                }

                length = length % 2 !== 0 ? length : length -1;
                speed = Math.min(Math.max(speed, 0),31);
                speed = speed << 3;

                let bounds = (lower << 4) + (upper << 0);
                let type_speed = ty + speed; 
                while(length > 255){
                    length -= 255;
                    buff = `${prefix}${currBuffer}`;
                    bufferList[buff] = Buffer.from([255, type_speed, otherParam, bounds]);
                    currBuffer += 1;
                }
                console.log(`Bounds ${bounds}`);
                buff = `${prefix}${currBuffer}`;
                bufferList[buff] = Buffer.from([length, type_speed, otherParam, bounds]);
                currBuffer += 1;
        }
    }
    while(currBuffer <= 5){
        let buff = `${prefix}${currBuffer}`;
        bufferList[buff] = Buffer.from([0,0,0,0])
        currBuffer += 1;
    }
    return bufferList;
}
*/