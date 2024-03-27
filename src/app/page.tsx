'use client'
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { readFile } from "fs";
import Image from "next/image";
import { JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { WorkBook } from "sheetjs-style";
import * as XLSX from 'xlsx';
export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [workbook, setWorkbook] = useState<WorkBook | null | undefined>(null);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {workbook != null && workbook != undefined ? <TableBody file={workbook}/>:
      <>
        <input type="file" accept=".xlsx" onChange={async (e)=>{
          if(e.target.files === null) return;
          const file = e.target.files[0];
          const workbook = XLSX.read(await file.arrayBuffer(),{
            type:'binary',
            cellDates:true,
            dateNF:'yyyy-mm-dd',
          });
          setWorkbook(workbook);
        }}/>
      </>
      }

    </main>
  );
}

type searchinfo = {
  index?:{
    searchVal:string,
  }
}
const TableBody = ({file}:{file:WorkBook})=>{
  const worksheet =file.Sheets[file.SheetNames[0]];
  const raw_data = XLSX.utils.sheet_to_json(worksheet,{header:1, defval:"N/A"})
  const headers = raw_data[0];
  const data = raw_data.slice(1);
  const [activeRows, setRows] = useState(data);
  const [searchList, setSearchList] = useState<null | searchinfo>(null);
  useEffect(()=>{
    if(searchList == null){
      setRows(data);
      return;
    };
    const x = data.filter((val,index)=>{
      const date = new Date('12/12/2024');
      for(const e of Object.keys(searchList)){
        console.log(e);
          for(let i = 0; i < (val as Array<unknown>).length; i++){
            if(i.toString() != e){
              continue;
            }
            const values = (val as Array<unknown>)[i];
            const searchValue = searchList[e as keyof typeof searchList]!.searchVal
            console.log(values,searchValue,searchList)
            if (values == null) return;
            if (typeof values == "object") {
              if(new Date(values as Date).toLocaleDateString().includes(searchValue)){
                return true;
              }else{
                return false;
              }
            }else{
              if (values.toString().includes(searchValue)) {
                return true;
              }else{
                continue;
              }
            }
          }
          return false;
      }
    })
    setRows(x);
  },[searchList])
  return(
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {(headers as Array<any>).map((header,index)=>{
          return (
            <div key={index} className="flex flex-col w-48 gap-2">
              <input placeholder="Input goes here" className="border-black border - 2 p-2" onChange={(e)=>{
                setSearchList(prevVal=>{
                  console.log(prevVal);
                  if(e.target.value == ''){
                    if(prevVal == null){
                      return null;
                    }
                   delete prevVal[index.toString() as keyof typeof prevVal]
                   if(Object.keys(prevVal).length == 0){
                    return null;
                   }
                   return prevVal;
                  }
                  return {
                    ...prevVal,
                    [index]:{
                      searchVal:e.target.value
                    }
                  }
                })
              }}></input>
              <HeaderComp>{header}</HeaderComp>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-2">
        {(activeRows).map((rows,index)=>{
          return (
            <div className="flex gap-2" key={index}>
              {(rows as Array<unknown>).map(
                (values,index) => {
                  if(typeof values == 'object' && values != null){
                    return <HeaderComp key={index}>{new Date(values.toString()).toLocaleDateString()}</HeaderComp>
                  }
                  return <HeaderComp key={index}>{values as string | number}</HeaderComp>;
                }
              )}
            </div>
          );
        })}
      </div>
    </div>
  )
}

const HeaderComp = ({className,children}:{className?:string,children:React.ReactNode})=>{
  return (
    <HoverCard>
      <HoverCardTrigger>
        <div className="border-2 p-2 border-black w-48  h-12 overflow-ellipsis overflow-hidden">
          {children}
        </div>
      </HoverCardTrigger>
      <HoverCardContent>
        {children}
      </HoverCardContent>
    </HoverCard>
  );
}