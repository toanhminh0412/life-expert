import React from 'react';
import {FaMoneyBillAlt} from 'react-icons/fa';
import {BsFillCalendar3WeekFill} from 'react-icons/bs';
import {GrNote} from 'react-icons/gr';
import {FiLogOut} from 'react-icons/fi';
import {auth, db} from '../App';
import { signOut } from "firebase/auth";
import { doc, deleteDoc} from 'firebase/firestore';
import {useNavigate} from 'react-router-dom';

function NavigationBar() {
    const navigate = useNavigate();

    const logOut = () => {
        signOut(auth)
        .then(async() => {
            const currentSession = window.localStorage.getItem('session');
            await deleteDoc(doc(db, 'sessions', currentSession))
            window.localStorage.setItem('session', '')
            navigate('/login');
        })
        .catch(error => {
            console.log(error);
        })
    }

    return (
        <div>
            <VerticalNav logOut={logOut}/>
            <HorizontalNav logOut={logOut}/>
        </div>
    )
}

function HorizontalNav({logOut}) {
    return (
        <div className='fixed bg-slate-800 h-10 md:h-12 w-full lg:hidden flex flex-row z-30'>
            <div className='ml-4 hidden md:flex flex-col justify-center'>
                <a href='/'><h1 className='text-yellow-400 text-xl md:text-2xl'>LifeExpert</h1></a>
            </div>
            <div className='ml-4 md:ml-12 h-full flex flex-col justify-center'>
                <a href='/budget-manager'><FaMoneyBillAlt className='text-slate-400 hover:text-white text-2xl md:text-3xl duration-200'/></a>
            </div>
            <div className='ml-8 md:ml-12 h-full flex flex-col justify-center'>
                <a href='/scheduler'><BsFillCalendar3WeekFill className='text-slate-400 hover:text-white text-xl md:text-2xl duration-200'/></a>
            </div>
            <div className='ml-8 md:ml-12 h-full flex flex-col justify-center'>
                <a href='/note'><GrNote className='text-slate-400 hover:text-white text-xl md:text-2xl bg-slate-400 hover:bg-white duration-200'/></a>
            </div>
            
            {window.localStorage.getItem('session')!==""?(
                <div className='absolute top-3 right-4 md:right-6'>
                <div onClick={logOut}><FiLogOut className='text-slate-400 hover:text-white text-xl md:text-2xl'/></div>
            </div>
            ):(<div></div>)}
        </div>
    )
}

function VerticalNav({logOut}) {
    return (
        <div className='hidden lg:flex fixed flex-col h-screen w-fit bg-slate-800 z-30'>
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

                <a href='/note'>
                    <div className='mt-4 hover:bg-slate-700 h-12 w-full flex flex-col justify-center'>
                        <GrNote className='text-white text-3xl mx-auto my-auto bg-white'/>
                    </div>
                </a>

                {window.localStorage.getItem('session')!==""?(<div className='text-center absolute bottom-10 left-12'>
                    <FiLogOut onClick={logOut} className='text-slate-400 hover:text-white text-3xl mx-auto my-auto'/>
                </div>):(<div></div>)}
                

        </div>
    )
}

export default NavigationBar
