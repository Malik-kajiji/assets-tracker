import React, { useEffect, useState } from 'react';
import Account from './components/Account';
import Home from './components/Home';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';


function App() {
  const [isLoggedIn,setIsLoggedIn] = useState(false);

  useEffect(()=>{
    // fetch('https://api.polygon.io/v2/aggs/ticker/INTC/range/1/day/2022-05-26/2023-05-26?adjusted=false&sort=asc&limit=5000&apiKey=3zj_m9FpO_48a2FI19jcJbILz_1UpEpD')
    // .then(res => res.json())
    // .then(data => {
    //   const ref = doc(db,'stocks','INTC')
    //   setDoc(ref,{...data})
    // })



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
