'use server'
async function readArrayFile(file:ArrayBuffer){
    console.log('asdasd');
    try{
        const XLSX = await import("sheetjs-style");
        const workbook = XLSX.read(file);
        return workbook;
    }catch(e){
        console.log(e);
    }

}

export {readArrayFile}