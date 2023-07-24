import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Login from '../components/Login';
import { useRouter } from 'next/router';
import { ipcRenderer } from 'electron';

function Home() {
  const router = useRouter()
  const [loading, setloading] = useState(true)
  useEffect(() => {
    setloading(true)
    if (typeof window !="undefined")
   (async () => {
      if (localStorage.getItem("authToken"))
   {    await router.replace("/menu") 
       ipcRenderer.send("loginSuccess");}

    })()
    setloading(false)
    
    return () => {
      
    };
  }, [])
  if (loading) return null

  return (
    <React.Fragment>
      <Login/>
    </React.Fragment>
  );
}

export default Home;
