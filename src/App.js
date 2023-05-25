import React, { useEffect, useState } from 'react';
import Account from './components/Account';
import Home from './components/Home';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';


function App() {
  const [isLoggedIn,setIsLoggedIn] = useState(false);


  useEffect(()=>{
    onAuthStateChanged(auth,(res)=>{
      if(res){
        setIsLoggedIn(true)
      }else {
        setIsLoggedIn(false)
      }
    })
  },[])

  return (
    <main className="App">
      {isLoggedIn?
        <Home />
      :
        <Account />
      }
    </main>
  );
}

export default App;
