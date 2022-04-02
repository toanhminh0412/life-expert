import React, {useEffect, useState} from 'react';
import {db} from '../App';
import {deleteDoc, doc, getDoc, setDoc} from 'firebase/firestore';
import {useParams, useNavigate} from 'react-router-dom';
import {BsFillTrashFill} from 'react-icons/bs';

function NoteWrite() {
    let { noteId } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();
    const [deletePrompt, setDeletePrompt] = useState(false);
    const [noteFound, setNoteFound] = useState(false);

    useEffect (() => {
        const getNote = async () => {
            const noteRef = doc(db, "notes", noteId);
            const noteSnap = await getDoc(noteRef);
            let curNote = {}
            if(noteSnap.exists()) {
                curNote = noteSnap.data();
                setTitle(curNote.title);
                setContent(curNote.content);
                setNoteFound(true);
            }
        }

        getNote();
    }, [])

    const changeTitle = e => {
        setTitle(e.target.value);
    }

    const changeContent = e => {
        setContent(e.target.value);
    }

    const editNote = async(e) => {
        e.preventDefault();
        const userId = window.localStorage.getItem('session').split('-')[0];
        const editedNote = {
            noteId: noteId,
            userId: userId,
            title: title,
            content: content,
            createdAt: Date.now().valueOf()
        }
        const noteRef = doc(db, "notes", noteId);
        await setDoc(noteRef, editedNote);
        navigate('/note');
    }

    const deleteNote = async(e) => {
        await deleteDoc(doc(db, "notes", noteId));
        navigate('/note');
    }

    return (
        <div className='pt-20 lg:pl-40 lg:pt-4 relative'>
            {deletePrompt?(<div className='absolute w-screen h-screen bg-black top-0 left-0 opacity-50'></div>):(<div></div>)}
            {deletePrompt?(<div className='absolute w-fit mb-20 bg-white h-32 z-20 left-0 right-0 mx-auto top-64'>
                    <div className='bg-indigo-900 h-8'>
                        <div className='bg-red-500 hover:bg-red-900 text-white h-8 w-8 border-box text-center text-lg font-bold ml-auto flex flex-col justify-center cursor-default' onClick={() => {setDeletePrompt(false)}}>X</div>
                    </div>
                    <p className='px-2 mt-2'>Are you sure you want to delete this note?</p>
                    <div className='flex flex-row justify-center mt-4'>
                        <div className='w-20 py-1 shadow-md hover:shadow-inner border border-slate-300 text-center cursor-default rounded-sm mr-4' onClick={deleteNote}>Yes</div>
                        <div className='w-20 py-1 shadow-md hover:shadow-inner border border-slate-300 text-center cursor-default rounded-sm' onClick={() => {setDeletePrompt(false)}}>Cancel</div>
                    </div>
            </div>):(<div></div>)}
            <h1 className='text-4xl md:text-6xl font-bold text-center lg:pt-20'>Edit Note</h1>
            <form className='w-10/12 mx-auto mt-12' onSubmit={editNote}>
                <input className='p-2 text-lg border border-black w-full' type='text' name='title' placeholder='Title' value={title} onChange={changeTitle}></input>
                <textarea className='p-2 text-lg border border-black w-full mt-5' rows='8' name='content' placeholder='Content' value={content} onChange={changeContent}></textarea>
                <div className='flex flex-row w-fit mt-10 ml-auto'>
                    <div onClick={() => {navigate('/note')}} className='p-2 text-xl w-24 h-fit mr-4 lg:w-32 text-center bg-red-500 hover:bg-red-900 duration-200 text-white ml-auto'>Cancel</div>
                    <input className='p-2 text-xl w-24 h-fit lg:w-32 text-center bg-green-500 hover:bg-green-900 duration-200 text-white' type='submit' value='Post'></input>
                </div>
                {noteFound ? (<div className='rounded-full bg-slate-300 hover:bg-slate-400 text-center flex flex-col justify-center w-16 h-16 absolute bottom-0 left-7 lg:relative' onClick={() => {setDeletePrompt(true)}}>
                        <BsFillTrashFill className='text-3xl mx-auto text-gray-600'/>
                </div>  ) : (<div></div>)}
                
            </form>
        </div>
    )
}

export default NoteWrite