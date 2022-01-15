import React from 'react';
import {FaMoneyBillAlt} from 'react-icons/fa';
import {BsFillCalendar3WeekFill} from 'react-icons/bs';

function NavigationBar() {
    return (
        <div>
            <VerticalNav/>
            <HorizontalNav/>
        </div>
    )
}

function HorizontalNav() {
    return (
        <div className='fixed bg-slate-800 h-10 md:h-12 w-full lg:hidden flex flex-row'>
            <div className='ml-4 hidden md:flex flex-col justify-center'>
                <a href='/'><h1 className='text-yellow-400 text-xl md:text-2xl'>LifeExpert</h1></a>
            </div>
            <div className='ml-4 md:ml-12 h-full flex flex-col justify-center'>
                <a href='/budget-manager'><FaMoneyBillAlt className='text-slate-400 hover:text-white text-2xl md:text-3xl'/></a>
            </div>
            <div className='ml-8 md:ml-12 h-full flex flex-col justify-center'>
                <a href='/scheduler'><BsFillCalendar3WeekFill className='text-slate-400 hover:text-white text-xl md:text-2xl'/></a>
            </div>
        </div>
    )
}

function VerticalNav() {
    return (
        <div className='hidden lg:flex fixed flex-col h-screen w-fit bg-slate-800'>
                <div className='border-b border-slate-600 pb-4'>
                    <a href='/'><h1 className='text-yellow-400 text-2xl mx-3 font-bold mt-2'>LifeExpert</h1></a>
                </div>
                <a href='/budget-manager'>
                    <div className='mt-4 hover:bg-slate-700 h-12 w-full flex flex-col justify-center'>
                        <FaMoneyBillAlt className='text-white text-4xl mx-auto my-auto'/>
                    </div>
                </a>
                <a href='/scheduler'>
                    <div className='mt-4 hover:bg-slate-700 h-12 w-full flex flex-col justify-center'>
                        <BsFillCalendar3WeekFill className='text-white text-3xl mx-auto my-auto'/>
                    </div>
                </a>

        </div>
    )
}

export default NavigationBar
