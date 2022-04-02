import React, {useEffect, useState} from 'react';
import {BsPen} from 'react-icons/bs';
import {useNavigate} from 'react-router-dom';
import { db } from '../App';
import {getDocs, collection, query, where, orderBy} from "firebase/firestore";

function Note() {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const getNotes = async () => {
            const userId = window.localStorage.getItem("session").split("-")[0];
            const notesRef = collection(db, "notes");
            const userNotesQuery = query(notesRef, where("userId", "==", userId), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(userNotesQuery);
            let userNotes = [];
            querySnapshot.forEach(doc => {
                userNotes.push(doc.data());
            })
            setNotes(userNotes);
        }
        getNotes();
    }, []);

    const createNewNote = () => {
        const now = new Date();
        const nowGettime = now.getTime();
        const userId = window.localStorage.getItem('session').split('-')[0];
        const noteId = `note-${userId}${nowGettime}`;
        navigate(`/note/${noteId}`); 
    }

    return (
        <div className='pt-20 lg:pl-40 lg:pt-4 relative min-h-screen'>
            <h1 className='text-4xl xl:text-6xl text-center font-bold uppercase lg:pt-20'>Your notes</h1>
            <div className='mt-12 w-10/12 lg:w-7/12 xl:w-1/2 mx-auto'>
                {notes.map(note => (
                    <div onClick={() => {navigate(`${note.noteId}`)}} key={note.createdAt} className="border border-slate-500 shadow-md hover:shadow-inner rounded-md p-3 w-full mt-4 lg:mt-6 bg-indigo-100 hover:bg-indigo-200">
                        <h1 className='font-bold text-lg'>{note.title}</h1>
                        <p className='ml-auto w-fit'>{new Date(note.createdAt).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
            <div onClick={createNewNote} className='border rounded-full bg-indigo-700 hover:bg-indigo-900 w-16 h-16 flex flex-col justify-center duration-200 absolute bottom-10 right-10 lg:bottom-20 lg:right-20'>
                <BsPen className='text-white text-center my-auto text-3xl w-fit h-fit mx-auto'/>
            </div>
        </div>
    )
}

export default Note