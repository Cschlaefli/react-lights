global.Buffer = global.Buffer || require('buffer').Buffer
const baseUrl = "http://mockra:3000"

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

export async function updateDeviceById(id, stripDef){
    let newDevice = JSON.stringify({
        address : id,
        stripDef :stripDef,
        strips : serializeStrips(stripDef)
    });
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: newDevice
    };
    return await fetch(`${baseUrl}/dev`, requestOptions);
}

const Cycle = 0;
const Rainbow = 1;

function serializeStrips(stripDef){
    let currBuffer = 1;
    console.log(stripDef.brightness);
    let bufferList = {"1520" : Buffer.from(stripDef.brightness)};
    let prefix = '152';
    for(var strip of stripDef.strips){
        let length = strip.Length;
        let stripType = strip.StripType;
        let color = strip.Color;
        let upper = strip.Upper;
        let lower = strip.Lower;
        let speed = strip.speed;
        console.log(stripType);
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
                if(stripType === "Cycle"){ ty = Cycle; }
                if(stripType === "Rainbow"){ ty = Rainbow; }

                length = length % 2 !== 0 ? length : length -1;
                speed = Math.min(Math.max(speed, 0),31);
                speed = speed << 3;

                let bounds = (lower << 4) + upper;
                let type_speed = ty + speed; 
                while(length > 255){
                    length -= 255;
                    buff = `${prefix}${currBuffer}`;
                    bufferList[buff] = Buffer.from([255, type_speed, otherParam, bounds]);
                    currBuffer += 1;
                }
                buff = `${prefix}${currBuffer}`;
                console.log(`Bounds ${bounds}`);
                bufferList[buff] = Buffer.from([length, type_speed, otherParam, bounds]);
                currBuffer += 1;
        }
    }
    return bufferList;
}