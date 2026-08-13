"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const CreateRoomButton = () => {
    const [name,setName]=useState("")
    const router=useRouter()
    const buttonRef=useRef<HTMLButtonElement | null>(null)
    const onClick=async()=>{
        try{  
            const createRef=buttonRef.current
            const req=await fetch(`/api/room`,{
                method:'Post',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({name})
            })
            if(!req.ok){
                console.log(req)
            }
            const room= await req.json()
            router.push(`/room/${room.id}`)
            
        }
        catch(e){
            console.log(e)
        }
    }    
    return (
        <Dialog>
            <DialogTrigger asChild>

            <Button variant='neon' className="w-full h-15 text-lg mt-10 hover:bg-fuchsia-400">Create Room</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create Your Room
                    </DialogTitle>
                    <DialogDescription>
                        Enter the name of the room.
                    </DialogDescription>
                </DialogHeader>
                    <input type="text" placeholder="Room Name" onChange={(e)=> setName(e.target.value)} />
                    <div className="flex gap-4">

                    <DialogClose asChild>
                        <Button size='lg'>Cancel</Button>
                    </DialogClose>
                    <Button variant='neon' size='lg' onClick={onClick} ref={buttonRef} >Create</Button>
                    </div>
            </DialogContent>
        </Dialog>
    );
}

export default CreateRoomButton;
