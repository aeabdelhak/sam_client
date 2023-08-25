import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type configType = {
    nudedHost: string
    host: string
    init: boolean
}
const host = typeof localStorage == "undefined" ? null : localStorage.getItem("ip")
const initialState: configType = {
    host: host ? `http://${host}:4000` : null,
    nudedHost: host ?? null,
    init: false
};

const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        setRemote(state, action: PayloadAction<{ host: string }>) {
            localStorage.setItem("remoteIp",host) 
            state.nudedHost = action.payload.host
            state.host = `http://${action.payload.host}:4000`
            return state
        },
        initConfig(state,action:PayloadAction<{host?:string}>) {
            const host = action.payload.host
            state.nudedHost = host ??null 
            state.host = host ? `http://${host}:4000` : null
            state.init = true
            return state
        },

    }
});

export const { setRemote ,initConfig} = configSlice.actions;
export default configSlice.reducer;
