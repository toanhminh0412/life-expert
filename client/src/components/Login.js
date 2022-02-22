import React, { useState, useEffect } from 'react';
import {auth, db} from '../App';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {useNavigate} from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate();

  const typeEmail = e => {
    setEmail(e.target.value)
  }

  const typePassword = e => {
    setPassword(e.target.value);
  }

  useEffect(() => {
    const session = window.localStorage.getItem("session");
    if (session) {
      navigate('/');
    }
  }, [])

  const signIn = e => {
    e.preventDefault()
    signInWithEmailAndPassword(auth, email, password)
    .then(async(userCredential) => {
      const user = userCredential.user
      const userId = user.uid
      let sessionId = userId + "-" + Date.now().valueOf();
      await setDoc(doc(db, "sessions", sessionId), {
        "created_at": Date.now()
      })
      window.localStorage.setItem("session", sessionId);
      navigate('/');
    })
    .catch((error) => {
      const errorCode = error.code
      console.log(errorCode);
      if (errorCode === "auth/invalid-email") {
        setError("Invalid email. Please try again.")
      } else if (errorCode === "auth/internal-error") {
        setError("Invalid password. Please try again")
      } else {
        setError("Account doesn't exist. Please sign up")
      }
    })
  }

  return (
    <div className='pt-2 md:pt-16 lg:pl-40 lg:pt-4 bg-indigo-100 h-full pb-auto min-h-screen pb-8'>
        <h1 className='text-6xl font-bold pt-32 ml-8 md:ml-20 lg:ml-40 xl:ml-60'>Login</h1>
        {error===""? (<div></div>):<p className='border border-red-500 bg-red-100 font-lg text-red-600 rounded-sm px-4 md:px-8 py-2 text-center w-fit ml-8 md:ml-20 lg:ml-40 xl:ml-60 mt-6'>{error}</p>}
        <form className="flex flex-col w-fit ml-10 mt-10 md:ml-32 lg:ml-56 xl:ml-72" onSubmit={signIn}>
            <input type='text' name='username' placeholder='Username' className='h-12 w-72 xl:w-80 rounded-sm text-xl p-2 border shadow-md' onChange={typeEmail}/>
            <input type='password' name='password' placeholder='Password' className='h-12 w-72 xl:w-80 rounded-sm mt-8 text-xl p-2 border shadow-md' onChange={typePassword}/>
            <p className='text-lg mt-4'>Do not have an account? Click <a href='/signup' className='font-bold underline text-lg'>here</a> to sign up</p>
            <input type='submit' value='Login' className='w-20 h-10 text-white bg-indigo-500 rounded-sm mt-8 ml-auto text-lg hover:bg-indigo-700 duration-200 mr-4'/>
        </form>
    </div>
  );
}

export default Login;
