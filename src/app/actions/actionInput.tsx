'use server'
import * as XLSX from 'xlsx';
async function readArrayFile(form:FormData){
    const file = form.get('file') as File;
    console.log(file.arrayBuffer());
    return {data:'hello'}

}

export {readArrayFile}