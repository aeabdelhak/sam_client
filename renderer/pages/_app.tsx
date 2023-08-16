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
import OnlineChecker from '../components/Context/OnlineChecker';

const Navbar = dynamic(import('../components/Navbar'), { ssr: false })
function MyApp({ Component, pageProps }: AppProps) {
  const [notConnectedToAwifi, setnotConnectedToAwifi] = useState(false)
  const [remote, setremote] = useState<string>()
  const [loading, setLoading] = useState(true)
  const [rerender, setrerender] = useState(0)

  const rooter = useRouter()
  async function lockUp() {
    const old = localStorage.getItem("remoteIp")
    if (old) {
      try {
        setLoading(true)
        const abortController = new AbortController()
        const url = "http://" + old + ":4000/connect"
        setTimeout(() => {
          abortController.abort()
        }, 500);
        const data = await (await fetch(url, {
          signal: abortController.signal
        })).json();
        setLoading(false)

        if (data == true) {
          await config.setremoteAddress(`http://${old}:4000`)
          localStorage.setItem("remoteIp", old)
          setremote(`http://${old}:4000`)
          setnotConnectedToAwifi(false)
          return
        }
      } catch (error) {

      }
    }
    const ips = await ipcRenderer.sendSync("remoteLockUp") as string[]

    if (!ips || ips.length == 0)
      return (setnotConnectedToAwifi(true), setLoading(false))
    setnotConnectedToAwifi(false)
    await Promise.all(ips.map(async ip => {
      try {
        const abortController = new AbortController()
        setTimeout(() => {
          abortController.abort()
        }, 500);
        const url = "http://" + ip + ":4000/connect"
        const data = await (await fetch(url, {
          signal: abortController.signal
        })).json()
        if (data == true) {
          await config.setremoteAddress(`http://${ip}:4000`)
          localStorage.setItem("remoteIp", ip)
          setremote(`http://${ip}:4000`)
          setLoading(false)
        }
      } catch (error) {
      }
    }))
    setLoading(false)
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


  if (notConnectedToAwifi) return <div className="flex select-none flex-col h-screen w-screen  justify-center items-center">
    <p className='text-xs lowercase font-light'>
      please Connect to A wifi first
    </p>
    <Button
      onClick={lockUp}
      className='!text-xs'>
      try again
    </Button>
  </div>
  if (loading) return <div className="flex select-none h-screen w-screen  justify-center items-center">

    <div className="scale-150">
      <LoaderIcon className='' />
    </div>
  </div>
  if (!remote) {
    return <div className="flex select-none gap-4 h-screen flex-col  w-screen  justify-center items-center">
      <p className='text-xs font-light'>
        unable to find a server within your network ,
      </p>

      <Button onClick={lockUp} className='!py-1 rounded-lg uppercase  !text-[8pt]'>
        try again
      </Button>
    </div>
  }


  return <Fragment >
      <OnlineChecker >
    <AppContext>
        <Toast />
        {rooter.pathname == "/home" ?
          <Component {...pageProps} /> : <div className='flex flex-col min-h-screen'>
            <Navbar />
            <Layout key={rerender}>
              <div className="p-4 flex-1 container mx-auto">
                <Component {...pageProps} />

              </div>
            </Layout>
          </div>
        }
    </AppContext>
      </OnlineChecker>
  </Fragment>
}

export default MyApp
