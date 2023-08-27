import React, { Fragment, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';
import Layout from '../components/layout';

import AppContext, { useAppContext } from '../components/Context/AppContext';
import Toast from '../components/Ui/Toast';
import OnlineChecker from '../components/Context/OnlineChecker';

import { Roles, useSession } from '../components/Context/SessionConext';
export default function Application({ children }: any) {
    const router = useRouter()




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

