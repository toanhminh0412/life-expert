import React, {useEffect} from 'react';
import {db} from '../App';
import { getDoc, doc, deleteDoc} from 'firebase/firestore';
import {useNavigate} from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

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
                // console.log(day_diff)
                if (day_diff >= 1) {
                    await deleteDoc(doc(db, "sessions", currentSession))
                    window.localStorage.setItem("session", "");
                    navigate('/login')
                } 
            }
            } 
        }

        checkSession();
        
    }, [])
    
    return (
        <div className='pt-16 lg:pl-40 lg:pt-4'>
            <h1 className="text-3xl font-bold underline">Dashboard</h1>
        </div>
    )
}

export default Dashboard
