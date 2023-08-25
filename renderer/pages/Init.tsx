import React, { Fragment, useEffect, useState } from 'react';

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
import { useAppSelector } from '../redux/hooks';
import IpSettings from '../components/IpSettings';
import { initConfig } from '../redux/reducers/config';
import { store } from '../redux/store';
export default function Application({ children }: any) {
    const router=useRouter()
    



    return <Fragment >
        <OnlineChecker >
            <AppContext>
                <Toast />
                {router.pathname == "/home" ?
                    children : <div className='flex flex-col min-h-screen'>
                        <Layout >
                            <div className="p-4 flex-1 container mx-auto">
                                {children}

                            </div>
                        </Layout>
                    </div>
                }
            </AppContext>
        </OnlineChecker>
    </Fragment>
}

