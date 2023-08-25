import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import { Fragment, ReactNode, useEffect } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { initConfig } from '../../redux/reducers/config';
import IpSettings from '../IpSettings';
import { LoaderIcon } from 'react-hot-toast';


export default function InitProvider({ children }: { children: ReactNode }) {
    const config = useAppSelector(e => e.config)

    useEffect(() => {
        store.dispatch(initConfig({ host: localStorage.getItem("remoteIp") }))
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