import React, {useState,useEffect,useContext,createContext} from "react";


const Context = createContext();
const AlertContext = ({children})=>{
    const [alertData,setAlertData] = useState({type:'',showen:false,msg:''});

    useEffect(()=>{
        if(alertData.showen){
            setTimeout(()=>{
                setAlertData(prev => ({...prev,showen:false}));
            },3000)
        }
    },[alertData.showen])

    return <Context.Provider
        value={{
            alertData,
            setAlertData
        }}
    >
        {children}
    </Context.Provider>
}

export default AlertContext;

export const AlertData = () => useContext(Context)