import React, { Fragment, useEffect, useState } from 'react';
import type { AppProps } from 'next/app';

import '../styles/globals.css';
import { LoaderIcon, toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import Layout from '../components/layout';
import { ipcRenderer } from 'electron';
import { config } from '../utils/fetch';
import Button from '../components/Ui/button/Button';
import AppContext from '../components/Context/AppContext';
import dynamic from 'next/dynamic';
import Toast from '../components/Ui/Toast';

const Navbar = dynamic(import('../components/Navbar'), { ssr: false })
function MyApp({ Component, pageProps }: AppProps) {
  const [notConnectedToAwifi, setnotConnectedToAwifi] = useState(false)
  const [remote, setremote] = useState<string>()
  const [loading, setLoading] = useState(true)

  const rooter = useRouter()
  async function lockUp() {
    const ips = await ipcRenderer.sendSync("remoteLockUp") as string[]
    toast(ips.toString())
    if (!ips || ips.length == 0)
      return setnotConnectedToAwifi(true)
    setnotConnectedToAwifi(false)
    await Promise.all(ips.map(async ip => {
      try {
        const url = "http://" + ip + ":4000/connect"
        const data = await (await fetch(url)).json()
        if (data == true) {

          config.remoteAddress = `http://${ip}:4000`
          setremote(`http://${ip}:4000`)
        }
      } catch (error) {
      }
      setLoading(false)

    }))
  }

  useEffect(() => {
    lockUp()
    window?.addEventListener("offline", () => lockUp())
    window?.addEventListener("online", () => lockUp())

    return () => {
      window?.removeEventListener("offline", () => lockUp())
      window?.removeEventListener("online", () => lockUp())
    }
  }, [])


  if (notConnectedToAwifi) return <div className="flex flex-col h-screen w-screen  justify-center items-center">
    <p className='text-xs lowercase font-light'>
      please Connect to A wifi first
    </p>
    <Button
      onClick={lockUp}
      className='!text-xs'>
      try again
    </Button>
  </div>
  if (loading) return <div className="flex h-screen w-screen scale-150 justify-center items-center">
    <LoaderIcon />
  </div>
  if (!remote) {
    return <div className="flex gap-4 h-screen flex-col  w-screen  justify-center items-center">
      <p className='text-xs font-light'>
        unable to find a server within your network ,
      </p>

      <Button onClick={lockUp} className='!py-1 rounded-lg uppercase  !text-[8pt]'>
        try again
      </Button>
    </div>
  }


  return <Fragment>
    <AppContext>
      <Toast />
      {rooter.pathname == "/home" ?
        <Component {...pageProps} /> : <Layout>
          <Navbar />
          <div className="p-4 container mx-auto">
            <Component {...pageProps} />

          </div>
        </Layout>
      }
    </AppContext>
  </Fragment>
}

export default MyApp
