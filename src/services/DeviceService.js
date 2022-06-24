
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