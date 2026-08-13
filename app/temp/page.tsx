"use client"
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Page = () => {
    const [query,setQuery]=useState("")
    async function handleClick(){
        // const res=await fetch("/api/download-song",{
        //     method:"Post",
        //     headers:{
        //         "content-type":"application/json"
        //     },
        //     body:JSON.stringify({song: query})
        // })
        const res=await fetch("/api/metadata-song",{
            method:"Post",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({song: query})
        })
        
        const data= await res.json()
        console.log(data)
    }
    return (
        <div >
        <div className='h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#4c1d95] text-black flex flex-col items-center gap-4 pt-8'>
            <h1 className="inline-block bg-gradient-to-r from-blue-300 to-pink-700 bg-clip-text text-transparent text-3xl">Search the song to upload to cloud</h1>
            <div>

            <input type="text" placeholder='Search song or paste url' className="inline-block text-white border-2 text-center w-[200px]" 
            onChange={(e)=>setQuery(e.target.value)}/>
            <Button variant='secondary' onClick={handleClick}>Download</Button>
            </div>
        </div>
        </div>
    );
}

export default Page;
