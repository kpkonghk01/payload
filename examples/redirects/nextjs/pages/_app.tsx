import App, { AppContext, AppProps as NextAppProps } from 'next/app';
import { ModalContainer, ModalProvider } from '@faceless-ui/modal';
import React from 'react';
import { MainMenu } from "../payload-types";
import { Header } from '../components/Header';
import { GlobalsProvider } from '../providers/Globals';
import { CloseModalOnRouteChange } from '../components/CloseModalOnRouteChange';
import { CookiesProvider } from 'react-cookie';

import '../css/app.scss';
export interface IGlobals {
  mainMenu: MainMenu,
}

export const getAllGlobals = async (): Promise<IGlobals> => {
  const [
    mainMenu,
  ] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/globals/main-menu?depth=1`).then((res) => res.json()),
  ]);

  return {
    mainMenu,
  }
}

type AppProps<P = any> = {
  pageProps: P;
} & Omit<NextAppProps<P>, "pageProps">;

const PayloadApp = (appProps: AppProps & {
  globals: IGlobals,
}): React.ReactElement => {
  const {
    Component,
    pageProps,
    globals,
  } = appProps;

  return (
    <CookiesProvider>
      <GlobalsProvider {...globals}>
        <ModalProvider
          classPrefix="form"
          transTime={0}
          zIndex="var(--modal-z-index)"
        >
          <CloseModalOnRouteChange />
          <Header />
          <Component {...pageProps} />
          <ModalContainer />
        </ModalProvider>
      </GlobalsProvider>
    </CookiesProvider>
  )
}

PayloadApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  const globals = await getAllGlobals();

  return {
    ...appProps,
    globals
  };
};

export default PayloadApp
