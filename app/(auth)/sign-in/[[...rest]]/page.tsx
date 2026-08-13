import { SignIn } from '@clerk/nextjs';
import React from 'react';

const Page = () => {
    return (
        <div className='h-screen w-scren items-center justify-center flex'>
            <SignIn/>
        </div>
    );
}

export default Page;
