'use client'
import { Button } from "@/components/ui/button";
import { readFile } from "fs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { readArrayFile } from "./actions/Input";
export default function Home() {
  const [file, setFile] = useState<ArrayBuffer | null>(null);
  useEffect(()=>{
    const searchQuery:Array<{value:string, key:string, filtertype:string}> = [
      { value: "23-1951", key: "23-0013", filtertype: "purchaseRequest" },
      { value: "23-0013", key: "23-0013", filtertype: "purchaseRequest" },
    ]
    const fetchData = async () => {
      const data = await fetch(
        `http://localhost:3001/api/DocumentQuery?pages=0&rows=10&searchQuery=${encodeURIComponent(
          JSON.stringify(searchQuery)
        )}`,
        {
          method: "GET",
        }
      )
        .then((e) => {
          console.log(e);
        })
    };
    fetchData();
  },[])
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <input type="file" accept=".xlsx" onChange={async (e)=>{
        if(e.target.files === null) return;
        const file = await e.target.files[0].arrayBuffer();
        setFile(file);
      }}/>
      <Button type="button" onClick={async () =>{
        if(file === null) return;
        try{
          const workbook = await readArrayFile(file);
        }catch(e){
          console.log(e);
        }
      }}>Upload Excel File</Button>
    </main>
  );
}
