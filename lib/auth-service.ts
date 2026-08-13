import { currentUser } from "@clerk/nextjs/server"
import { db } from "./db"

export const getSelf=async()=>{
    const self= await currentUser()
    if(!self){
        throw new Error("Get signed-in or sign-up")
    }
    const user=await db.user.findUnique({
        where:{
            clerkId:self.id
        }
    })
    if(!user){
        throw new Error("Not found")
    }
    return user
}
export const handleUser=async()=>{
    const self=await currentUser()
    if(!self){
        throw new Error("Get singed in")
    }
    const user=await db.user.findUnique({
        where:{
            clerkId: self.id
        }
    })
    if(!user){
        const newUser=await db.user.create({
            data:{
                clerkId: self.id,
                username: self.username ||  self.firstName || self.fullName || self.id,
                image: self.imageUrl,
                email: self.emailAddresses[0].emailAddress,

            }
        })
        if(!newUser){
            throw new Error("Something went wrong while creating the user")
        }
    }
}