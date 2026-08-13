import { Button } from '@/components/ui/button';
const Navbar = () => {
    return (
        <div className='flex ml-3 pt-4 pb-2 justify-between fixed w-full pr-4 pl-5 z-50 shadow-2xl bg-gray-950'>
            <div className='flex gap-7'>

            <h1 className='text-fuchsia-500 text-3xl font-black  tracking-tighter italic'>VibeFlow</h1>
            {/* <ul className='flex text-lg gap-5 items-center justify-around'>
                <li>Home</li>
                <li>Discovery</li>
                <li>Listening Rooms</li>
                <li>Library</li>
            </ul> */}
            </div>
            <div className='flex gap-4 mr-2'>
                <Button variant='primary' className='h-11 w-19' >Log In</Button>
                <Button className='h-11 w-19'>Sign Up</Button>
            </div>
            
        </div>
    );
}

export default Navbar;
