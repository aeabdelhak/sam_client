import React from 'react';
import type { AppProps } from 'next/app';

import '../styles/globals.css';
import Application from './Init';
import TitleConext from '../components/Context/TitleConext';
import dynamic from 'next/dynamic';
import SessionConext from '../components/Context/SessionConext';

const ReduxProvider = dynamic(() => import("../components/Context/ReduxProvider"), { ssr: false })
const AppFrameBar = dynamic(() => import("../components/AppFrameBar"), { ssr: false })
const TranslationsContext = dynamic(() => import("../utils/translations/Context"), { ssr: false })

function MyApp({ Component, pageProps }: AppProps) {



  return (
    <TranslationsContext>
      <ReduxProvider>
        <TitleConext >
          <SessionConext>
            <AppFrameBar />
            <Application>
              <Component {...pageProps} />
            </Application>
          </SessionConext>
        </TitleConext>
      </ReduxProvider>
    </TranslationsContext>
  )
}

export default MyApp
