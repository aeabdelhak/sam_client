import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import { Fragment, ReactNode, useEffect } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { initConfig } from '../../redux/reducers/config';
import IpSettings from '../IpSettings';
import { LoaderIcon } from 'react-hot-toast';
import { ipcRenderer } from 'electron';


export default function InitProvider({ children }: { children: ReactNode }) {
    const config = useAppSelector(e => e.config)

    useEffect(() => {
        (async () => {
            const remote = await ipcRenderer.sendSync("getRemoteIp")
            store.dispatch(initConfig({ host: remote }))
        })()
    }, [])

    if (!config.init) return <div className="w-screen h-screen flex justify-center items-center">
        <div className="scale-[3]">
            <LoaderIcon />
        </div>
    </div>;
    if (!config.nudedHost || config.nudedHost == null) {
        return <IpSettings open={true} setOpen={() => { }} />
    }

    return (
        <Fragment key={config.nudedHost}>
            {children}
        </Fragment>
    )
}