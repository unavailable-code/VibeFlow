import { Button } from "@/components/ui/button"
import { LucideMusic4, Music, Music2, Music2Icon, Music3, Music3Icon, Music4Icon, Users } from "lucide-react"

export const Hero=()=>{
    return(
        <div>

        <div className="pt-70 mt-20 px-15 flex justify-between pb-30">
            <div>

            <span >
            <h1 className="text-6xl md:text-8xl font-black  leading-[0.9] tracking-tighter italic">Listen Together,</h1>
            <h1 className="text-6xl md:text-8xl font-black  leading-[0.9] tracking-tighter italic text-fuchsia-500">Anywhere</h1>
            </span>
            <p className="text-2xl max-w-xl leading-relaxed text-gray-400 pt-10">Create virtual rooms, share playlists, and vibe with your friends in real-time. Experience the pulse of the digital studio from anywhere in the world.</p>
            <span className="gap-7 flex font-black mt-5">
                <Button variant='neon' className="rounded-md h-10 w-25 md:h-15 md:w-40 md:text-xl hover:cursor-pointer">Start Listening</Button>
                <Button className="rounded-md h-10 w-25 md:h-15 md:w-40 md:text-xl hover:cursor-pointer text-white bg-gray-400 rounded-full hover:bg-gray-800">Create Room</Button>
            </span>

            </div>
            <div className="hidden lg:block flex flex-col h-125 w-80 bg-gray-300/10 rotate-4  rounded-2xl">
                <div className="mt-5 ml-2.5  bg-black z-50 h-70 w-75 ">
                    <img src="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202412/karan-aujla-is-one-of-the-top-performing-punjabi-music-artistes-in-india-122052412-3x4.jpg?VersionId=OWdd_9hjZUtN4HgOGt_hTWS1n9n_B9yJ" alt="Karan" className="rounded-xl" />
                </div>
                <div className="mt-32 pl-4 text-xl font-bold">
                    <p>Karan Aujla</p>
                    <p className="text-cyan-300">P-Pop Culture</p>
                </div>
            </div>
        </div>
        

        <div className="flex flex-col bg-gray-600/10 pb-30">
            <div className="w-full flex justify-around pt-20 ">
            <span>

            <h5 className="text-fuchsia-500 text-xl">The Experience</h5>
            <h1 className="text-5xl font-bold ">Sonic Social Ecosystem</h1>
            </span>
            <p className="text-gray-400 text-2xl max-w-xl pt-5">Built for next generation of music listeners who believe music is better when shared</p>
            </div>

            <div className="flex justify-center pt-20 gap-10">
                <div className="h-90 w-170 bg-amber-200 bg-center rounded-4xl" style={{backgroundImage:"url('https://media.istockphoto.com/id/1164356734/photo/3d-render-blue-neon-abstract-background-ultraviolet-light-night-club-empty-room-interior.jpg?s=612x612&w=0&k=20&c=JVnr8u915q_YzDjq1yguPX0IJfoSgM0dovE-dO3Dr_M=')"} }>
                    <Users className="text-cyan-400 mt-50 ml-10"/>
                    <h1 className="text-3xl font-bold ml-10">Social Rooms</h1>
                    <p  className="ml-10 text-xl text-lime-400 max-w-sm">Drop into the rooms where you can chat,react and vibe to the same track</p>
                </div>
                <div className="h-90 w-110 bg-gray-600/5 shadow-2xl rounded-4xl flex flex-col pt-20 pl-10">
                <span className="flex text-fuchsia-500">
                    <LucideMusic4/><Music2Icon/>
                </span>
                <h1 className="text-3xl font-bold pt-10">Collaborative Queues</h1>
                <p className="text-gray-400 text-xl max-w-sm pt-4">Everyone is a DJ. Add, vote, and reorder tracks in real-time without skipping a beat.</p>
                </div>

            </div>
                <div className="h-70 w-full items-center flex justify-center">
                <div className="flex bg-gray-500/10 shadow-2xl h-40 rounded-3xl shadow-2xl items-center gap-20 pl-10 pr-10">

                    <h1 className="text-5xl font-bold">Ready to join the VibeFlow ?</h1>
                    <span className="gap-5 flex ">
                        <Button variant='cyan' className="text-xl h-20 w-30 rounded-2xl cursor-pointer">Get Started</Button>
                        <Button variant='neon' className="text-xl h-20 w-70 rounded-2xl cursor-pointer">Already Have an Account</Button>
                    </span>
                </div>
                </div>

        </div>


        </div>
    )
}