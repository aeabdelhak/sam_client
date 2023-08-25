import React, { Fragment, useEffect, useState } from 'react';
import type { AppProps } from 'next/app';

import '../styles/globals.css';
import Application from './Init';
import TitleConext from '../components/Context/TitleConext';
import dynamic from 'next/dynamic';
import SessionConext from '../components/Context/SessionConext';

const AppFrameBar = dynamic(() => import("../components/AppFrameBar"), { ssr: false })
const TranslationsContext = dynamic(() => import("../utils/translations/Context"), { ssr: false })

function MyApp({ Component, pageProps }: AppProps) {



  return <TranslationsContext>
    <TitleConext >
      <SessionConext>
        <AppFrameBar />
        <Application>
          <Component {...pageProps} />
        </Application>
      </SessionConext>
    </TitleConext>
  </TranslationsContext>
}

export default MyApp
