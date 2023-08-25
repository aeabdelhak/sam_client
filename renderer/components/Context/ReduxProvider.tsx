import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import { ReactNode } from 'react';
import InitProvider from './InitProvider';


export default function ReduxProvider({ children }: { children: ReactNode }) {


    return (
        <Provider store={store}>
            <InitProvider>
                {children}
            </InitProvider>
        </Provider>
    )
}