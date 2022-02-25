import React, {useEffect, useState} from 'react';
import {db} from '../App';
import { getDoc, doc, deleteDoc, setDoc} from 'firebase/firestore';
import {useNavigate} from "react-router-dom";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function Scheduler() {
    const [showEdit, setShowEdit] = useState(false);
    const [date, setDate] = useState(new Date());
    const [editId, setEditId] = useState('');
    const [title, setTitle] = useState('');
    const [hour, setHour] = useState(-1);
    const [minute, setMinute] = useState(-1);
    const [midday, setMidday] = useState('AM');
    const [frequency, setFrequency] = useState('')
    const [schedule, setSchedule] = useState([])
    const [error, setError] = useState('')
    const [editDate, setEditDate] = useState(-1);
    const [editMonth, setEditMonth] = useState(-1);
    const [editYear, setEditYear] = useState(-1);
    const [viewOption, setViewOption] = useState('all-time');

    const navigate = useNavigate();

    // Store number of hours, minutes and seconds
    const hours = ['1','2','3','4','5','6','7','8','9','10','11','12'];
    const minutes = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59'] 

    // Insert item maintains the order of the schedule
    const insertItem = (sched, item) => {
        if (sched.length === 0) {
            sched.push(item)
        } else {
            let insertIndex = -1;
            for(let i = 0; i < sched.length; i++) {
                if(item.date.getTime() < sched[i].date.seconds*1000) {
                    insertIndex = i;
                    break;
                }
            }
            if (insertIndex !== -1) {
                sched.splice(insertIndex, 0, item)
            } else {
                sched.push(item);
            }
        }
        return sched;
    }
    
    const getSchedule = async () => {
        const userId = window.localStorage.getItem('session').split('-')[0];
        const scheduleId = 'schedule-' + userId;
        const scheduleRef = doc(db, 'schedules', scheduleId);
        const scheduleSnap = await getDoc(scheduleRef);
        let fullSchedule = []
        if (scheduleSnap.exists()) {
            fullSchedule = scheduleSnap.data().schedule
        }
        if (fullSchedule.length === 0 || viewOption === 'all-time') {
            setSchedule(fullSchedule);
            return;
        } else if (viewOption === 'today') {
            let extractSchedule = []
            let today = new Date();
            let date = today.getDate();
            let month = today.getMonth();
            let year = today.getFullYear();
            let begin_today = new Date(year, month, date, 0, 0, 0, 0).getTime();
            let end_today = begin_today + 60*60*24*1000;
            for (let i = 0; i < fullSchedule.length; i++) {
                let eventTime = fullSchedule[i].date.seconds*1000;
                if(eventTime >= begin_today && eventTime < end_today) {
                    extractSchedule.push(fullSchedule[i]);
                }
            }
            setSchedule(extractSchedule);
            return;
        } else if (viewOption === "this-week") {
            let extractSchedule = []
            let today = new Date();
            let date = today.getDate();
            let month = today.getMonth();
            let year = today.getFullYear();
            let day = today.getDay();
            let begin_today = new Date(year, month, date, 0, 0, 0, 0).getTime();
            let begin_week = begin_today - day*60*60*24*1000;
            let end_week = begin_week + 7*60*60*24*1000;
            for (let i = 0; i < fullSchedule.length; i++) {
                let eventTime = fullSchedule[i].date.seconds*1000;
                if(eventTime >= begin_week && eventTime < end_week) {
                    extractSchedule.push(fullSchedule[i]);
                }
            }
            setSchedule(extractSchedule);
            return;
        } else if (viewOption === "this-month") {
            let extractSchedule = []
            let today = new Date();
            let month = today.getMonth();
            let year = today.getFullYear();
            let day_num = new Date(year, month, 0).getDate();
            let begin_month = new Date(year, month, 1, 0, 0, 0, 0).getTime();
            let end_month = begin_month + day_num*60*60*24*1000;
            for (let i = 0; i < fullSchedule.length; i++) {
                let eventTime = fullSchedule[i].date.seconds*1000;
                if(eventTime >= begin_month && eventTime < end_month) {
                    extractSchedule.push(fullSchedule[i]);
                }
            }
            setSchedule(extractSchedule);
            return;
        } else if (viewOption === "this-year") {
            let extractSchedule = []
            let today = new Date();
            let year = today.getFullYear();
            let begin_year = new Date(year, 0, 1, 0, 0, 0, 0).getTime();
            let end_year = new Date(year+1, 0, 1, 0, 0, 0, 0).getTime();
            for (let i = 0; i < fullSchedule.length; i++) {
                let eventTime = fullSchedule[i].date.seconds*1000;
                if(eventTime >= begin_year && eventTime < end_year) {
                    extractSchedule.push(fullSchedule[i]);
                }
            }
            setSchedule(extractSchedule);
            return;
        }
    }
    
    useEffect(() => {

        function getDifferenceInDays(date1, date2) {
            const diffInMs = Math.abs(date2 - date1);
            return diffInMs / (1000 * 60 * 60 * 24);
          }

        const checkSession = async () => {
            const currentSession = window.localStorage.getItem('session')
            if (currentSession === "") {
                navigate('/login')
            }
            else {
                const sessionSnap = await getDoc(doc(db, "sessions", currentSession));
            if (!sessionSnap.exists()) {
                window.localStorage.setItem('session', '')
                navigate('/login')
            } else {
                const created_int = sessionSnap.data().created_at
                const created_date = new Date(created_int)
                const current_date = Date.now()
                const day_diff = getDifferenceInDays(created_date, current_date)
                if (day_diff >= 1) {
                    await deleteDoc(doc(db, "sessions", currentSession))
                    window.localStorage.setItem("session", "");
                    navigate('/login')
                } 
            }
            } 
        }

        checkSession();
        getSchedule();
    }, [viewOption])

    const changeDate = d => {
        setDate(d);
    }

    const changeTitle = e => {
        setTitle(e.target.value);
    }

    const changeHour = e => {
        setHour(e.target.value);
    }

    const changeMinute = e => {
        setMinute(e.target.value);
    }

    const changeMidday = e => {
        setMidday(e.target.value);
    }

    const changeFrequency = e => {
        setFrequency(e.target.value);
    }

    const changeEditDate = e => {
        setEditDate(e.target.value);
    }

    const changeEditMonth = e => {
        setEditMonth(e.target.value);
    }

    const changeEditYear = e => {
        setEditYear(e.target.value);
    }

    const changeViewOption = e => {
        setViewOption(e.target.value);
    }

    // add and item to the schedule that still maintains the order of the events in firestore
    const addItem = async e => {
        e.preventDefault();
        if (title === '') {
            setError('Please add title to your item');
        } else if (hour === -1) {
            setError('Please select an hour for your item');
        } else if (minute === -1) {
            setError('Please select a minute for your item');
        } else if (frequency === '') {
            setError('Please set a frequency for your item');
        } else {
            let hourInt = 0;
            let minuteInt = 0;
            if (midday === "AM") {
                hour === '12' ? hourInt = parseInt(hour) - 12: hourInt = parseInt(hour);
                minuteInt = parseInt(minute);
            } else {
                hour === '12' ? hourInt = parseInt(hour) : hourInt = parseInt(hour) + 12;
                minuteInt = parseInt(minute);
            }   
            let itemId = `item-${new Date().getTime()}`;
            let newItem = {};
            if (editId !== '') {
                if (editDate < 0 || editMonth < 0 || editYear < 0) {
                    setError('Invalid DD/MM/YY for item edition , please check again');
                    return;
                } else if (!Date.parse(`${editYear}/${editMonth}/${editDate}`)) {
                    setError('Invalid DD/MM/YY for item edition , please check again');
                    return;
                } else {
                    newItem = {
                        "id": itemId,
                        "title": title,
                        "date": new Date(editYear, editMonth, editDate, hourInt, minuteInt),
                        "frequency": frequency
                    }
                    await deleteMultipleItems(editId);
                    setEditYear(-1);
                    setEditMonth(-1);
                    setEditDate(-1);
                    setEditId('')
                }
            } else {
                newItem = {
                    "id": itemId,
                    "title": title,
                    "date": new Date(date.getFullYear(), date.getMonth(), date.getDate(), hourInt, minuteInt),
                    "frequency": frequency 
                }
            }
            let newSchedule = [];
            const userId = window.localStorage.getItem('session').split('-')[0];
            const scheduleId = 'schedule-' + userId;
            const scheduleRef = doc(db, 'schedules', scheduleId);
            const scheduleSnap = await getDoc(scheduleRef);
            if(scheduleSnap.exists()) {
                newSchedule = scheduleSnap.data().schedule;
            }
            if (frequency === 'one-time') {
                newSchedule = insertItem(newSchedule, newItem);
            } else if (frequency === 'daily') {
                newSchedule = insertItem(newSchedule, newItem);
                let d = newItem["date"]
                for (let i = 0; i < 200; i++) {
                    d = new Date(d.getTime() + 60*60*24*1000)
                    newItem = {
                        "id": itemId,
                        "title": title,
                        "date": d,
                        "frequency": frequency 
                    }
                    newSchedule = insertItem(newSchedule, newItem);
                }
            } else if (frequency === 'weekly') {
                newSchedule = insertItem(newSchedule, newItem);
                for (let i = 0; i < 20; i++) {
                    newItem = {
                        "id": itemId,
                        "title": title,
                        "date": new Date(newItem['date'].getTime() + 60*60*24*7*1000),
                        "frequency": frequency 
                    }
                    newSchedule = insertItem(newSchedule, newItem);
                }
            } else if (frequency === 'monthly') {
                newSchedule = insertItem(newSchedule, newItem);
                for (let i = 0; i < 5; i++) {
                    let d = newItem["date"];
                    let test_d = new Date(d.getFullYear(), d.getMonth()+1, 0);
                    let day_num = test_d.getDate();
                    newItem = {
                        "id": itemId,
                        "title": title,
                        "date": new Date(newItem['date'].getTime() + 60*60*24*day_num*1000),
                        "frequency": frequency 
                    }
                    newSchedule = insertItem(newSchedule, newItem);
                }
            }

            const newScheduleObj = {
                "schedule": newSchedule
            }
            
            await setDoc(scheduleRef, newScheduleObj);
        }

        getSchedule();
        setTitle('')
        setHour(-1);
        setMinute(-1);
        setMidday('AM')
        setFrequency('');
        setShowEdit(false)
        setError('')
    }

    // delete an item upon completion from firestore
    const deleteOneItem = async id => {
        let delIndex = -1;
        const userId = window.localStorage.getItem('session').split('-')[0];
        const scheduleId = 'schedule-' + userId;
        const scheduleRef = doc(db, "schedules", scheduleId);
        const scheduleSnap = await getDoc(scheduleRef);
        let newSchedule = [];
        if (scheduleSnap.exists()) {
            newSchedule = scheduleSnap.data().schedule;
        }
        for(let i = 0; i < newSchedule.length; i++) {
            if (newSchedule[i].id === id) {
                delIndex = i;
                break;
            }
        }
        if (delIndex !== -1) {
            newSchedule.splice(delIndex, 1);
        }
        const newScheduleObj = {
            "schedule": newSchedule
        }

        await setDoc(scheduleRef, newScheduleObj);
        getSchedule();
    }

    const deleteMultipleItems = async id => {
        const userId = window.localStorage.getItem('session').split('-')[0];
        const scheduleId = 'schedule-' + userId;
        const scheduleRef = doc(db, "schedules", scheduleId);
        const scheduleSnap = await getDoc(scheduleRef);
        let oldSchedule = [];
        if (scheduleSnap.exists()) {
            oldSchedule = scheduleSnap.data().schedule;
        }
        let newSchedule = [];
        for (let i = 0; i < oldSchedule.length; i++) {
            if (oldSchedule[i].id !== id) {
                newSchedule.push(oldSchedule[i]);
            }
        }
        const newScheduleObj = {
            "schedule": newSchedule
        }

        await setDoc(scheduleRef, newScheduleObj);
        getSchedule();
    }

    // print time in aa:bb AM/PM form
    const printTimeformat = seconds => {
        const d = new Date(seconds * 1000);
        let h = d.getHours();
        const m = d.getMinutes();
        let m_string = m.toString();
        let mid = 'AM';
        if (h >= 12) {
            h = h - 12;
            mid = 'PM';
        }
        if (m < 10) {
            m_string = '0' + m_string;
        }

        return h + ':' + m_string + ' ' + mid;

    }

    return (
        <div className='pt-16 lg:pl-40 lg:pt-4 relative'>
            {error === '' ? (<div></div>) : (<div className='border border-red-700 bg-red-200 text-red-700 rounded-md p-4 w-fit ml-4 md:mt-4 md:ml-8 mb-4'>
                {error}
            </div>)}
            {showEdit? (
                <form className='border border-black p-4 w-fit rounded-sm absolute left-4 md:top-20 md:left-8 lg:top-8 lg:left-48 z-20 bg-white' onSubmit={addItem}>
                <input className='border border-black p-2 rounded-sm text-lg' name='title' placeholder='Title' onChange={changeTitle}></input>
                <Calendar className='mt-4' onChange={changeDate} value={date}/>
                <div className='flex flex-row mt-4'>
                    <select className='border border-black rounded-sm mr-4 text-lg p-2' defaultValue='hour' onChange={changeHour}>
                        <option value='hour' disabled>Hour</option>
                        { hours.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    <p className='font-bold text-2xl'>:</p>
                    <select className='border border-black rounded-sm ml-4 text-lg p-2' defaultValue='minute' onChange={changeMinute}>
                        <option value='minute' disabled>Minute</option>
                        {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select className='border border-black rounded-sm ml-4 text-lg p-2' defaultValue='AM' onChange={changeMidday}>
                        <option value='AM'>AM</option>
                        <option value='PM'>PM</option>
                    </select>
                </div>
                <select className='border border-black rounded-sm mt-4 text-lg p-2' defaultValue='frequency' onChange={changeFrequency}>
                    <option value='frequency'>Frequency</option>
                    <option value='one-time'>One time</option>
                    <option value='daily'>Daily</option>
                    <option value='weekly'>Weekly</option>
                    <option value='monthly'>Monthly</option>
                </select>
                <div className='flex flex-row w-fit ml-auto mt-4'>
                    <div className='text-lg bg-red-700 hover:bg-red-900 rounded-sm py-1 px-4 text-white cursor-pointer mr-4' onClick={() => {setShowEdit(false); setTitle(''); setHour(-1); setMinute(-1); setMidday('AM'); setFrequency('');}}>Cancel</div>
                    <input className='text-lg bg-indigo-700 hover:bg-indigo-900 rounded-sm py-1 px-4 text-white' type='submit' value='Add'></input>
                </div>
                
                </form>
            ): (
                <div className='bg-indigo-700 hover:bg-indigo-900 text-white text-lg py-1 px-6 rounded-sm w-fit duration-200 cursor-pointer ml-4 md:mt-4 md:ml-8' onClick={() => {setShowEdit(true); setError('')}}>Add Item</div>
            )}

                <select className='ml-8 mt-4 p-2 font-lg border border-black rounded-sm' name='view-option' defaultValue='view-option' placeholder='View option' onChange={changeViewOption}>
                    <option value='view-option' disabled>View Option</option>
                    <option value='today'>Today</option>
                    <option value='this-week'>This week</option>
                    <option value='this-month'>This month</option>
                    <option value='this-year'>This year</option>
                    <option value='all-time'>All Time</option>
                </select>

            <div className='mt-12 flex flex-row flex-wrap w-11/12 mx-auto'>
                {schedule.map((item, index) => editId !== item.id ? (
                <div className='border border-slate-300 rounded-md p-4 w-full md:w-5/12 md:mr-12 xl:mr-16 box-border shadow-md shadow-slate-500 z-0 mt-4' key={index}>
                    <p className='text-lg'>{new Date(item.date.seconds*1000).toLocaleDateString()}</p>
                    <p>{printTimeformat(item.date.seconds)}</p>
                    <h1 className='text-2xl font-bold w-fit ml-auto'>{item.title}</h1>
                    <p className='w-fit ml-auto text-lg'>{item.frequency}</p>
                    <div className='flex flex-row flex-wrap mt-2 w-fit ml-auto'>
                        <div className='bg-red-700 hover:bg-red-900 rounded-sm py-1 px-4 mr-2 text-white duration-200 cursor-default' onClick={() => {deleteMultipleItems(item.id)}}>Delete</div>
                        <div className='bg-indigo-700 hover:bg-indigo-900 rounded-sm py-1 px-4 mr-2 text-white duration-200 cursor-default' onClick={() => {setEditId(item.id); setEditDate(new Date(item.date.seconds*1000).getDate()); setEditMonth(new Date(item.date.seconds*1000).getMonth()); setEditYear(new Date(item.date.seconds*1000).getFullYear()); setHour(new Date(item.date.seconds*1000).getHours() % 12 || 12); setMinute(new Date(item.date.seconds*1000).getMinutes()); setMidday(new Date(item.date.seconds*1000).getHours < 12 ? 'AM' : 'PM'); setTitle(item.title); setFrequency(item.frequency)}}>Edit</div>
                        <div onClick={() => {deleteOneItem(item.id)}} className='bg-green-500 hover:bg-green-900 rounded-sm py-1 px-2 text-white duration-200 cursor-default'>Complete</div>
                    </div>
                </div>
                ) : (
                    <form className='border border-slate-300 rounded-md p-4 w-full md:w-5/12 md:mr-12 xl:mr-16 box-border shadow-md shadow-slate-500 z-0 flex flex-col' key={index} onSubmit={addItem}>
                        <div className='flex flex-row'>
                            <input className='border border-slate-300 w-10 text-sm mr-2 shadow-md shadow-slate-300 text-center' type='number' placeholder='DD' defaultValue={new Date(item.date.seconds*1000).getDate()} onChange={changeEditDate}></input>
                            <p className='mr-2 text-lg'>/</p>
                            <input className='border border-slate-300 w-10 text-sm mr-2 shadow-md shadow-slate-300 text-center' type='number' placeholder='MM' defaultValue={new Date(item.date.seconds*1000).getMonth() + 1} onChange={changeEditMonth}></input>
                            <p className='mr-2 text-lg'>/</p>
                            <input className='border border-slate-300 w-16 text-sm mr-2 shadow-md shadow-slate-300 text-center' type='number' placeholder='YY' defaultValue={new Date(item.date.seconds*1000).getFullYear()} onChange={changeEditYear}></input>
                        </div>
                        <div className='flex flex-row mt-4'>
                            <select className='border border-slate-300 rounded-sm mr-2 text-sm shadow-md shadow-slate-300 text-center' defaultValue={new Date(item.date.seconds*1000).getHours() % 12 || 12} onChange={changeHour}>
                                <option value='hour' disabled>HH</option>
                                { hours.map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                            <p className='font-bold text-2xl mr-2'>:</p>
                            <select className='border border-slate-300 rounded-sm mr-2 text-sm shadow-md shadow-slate-300 text-center' defaultValue={new Date(item.date.seconds*1000).getMinutes()} onChange={changeMinute}>
                                <option value='minute' disabled>Min</option>
                                {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <select className='border border-slate-300 rounded-sm mr-2 text-sm shadow-md shadow-slate-300 text-center' defaultValue={new Date(item.date.seconds*1000).getHours() <= 12 ? 'AM' : 'PM'} onChange={changeMidday}>
                                <option value='AM'>AM</option>
                                <option value='PM'>PM</option>
                            </select>
                        </div>
                        <input type='text' className='border border-slate-300 mt-6 w-6/12 text-center ml-auto text-xl font-bold p-1 shadow-md shadow-slate-300' defaultValue={item.title} onChange={changeTitle}></input>
                        <select className='border border-slate-300 shadow-md shadow-slate-300 text-lg p-2 rounded-sm mt-4 text-sm w-fit ml-auto' defaultValue={item.frequency} onChange={changeFrequency}>
                            <option value='frequency'>Frequency</option>
                            <option value='one-time'>One time</option>
                            <option value='daily'>Daily</option>
                            <option value='weekly'>Weekly</option>
                            <option value='monthly'>Monthly</option>
                        </select>
                        <div className='flex flex-row w-fit ml-auto mt-4'>
                            <div className='text-lg bg-red-700 hover:bg-red-900 rounded-sm py-1 px-4 text-white cursor-pointer mr-4' onClick={() => {setShowEdit(false); setTitle(''); setHour(-1); setMinute(-1); setMidday('AM'); setFrequency(''); setEditId('');}}>Cancel</div>
                            <input className='text-lg bg-indigo-700 hover:bg-indigo-900 rounded-sm py-1 px-4 text-white' type='submit' value='Edit'></input>
                        </div>
                    </form>
                ))}
            </div>
        </div>
    )
}

export default Scheduler
