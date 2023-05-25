import React, { useEffect, useState } from 'react';
import '../styles/home.css';
import { FiLogOut } from 'react-icons/fi';
import { auth, db } from '../firebaseConfig';
import {  signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { AreaChart, XAxis , YAxis ,Tooltip , Area } from 'recharts';
import Asset from './Asset';
import Header from './Header';

const Home = () => {
    const [portfolio,setProtfolio] = useState({
        assets:[],
        currentBalance:0,
        growth:0,
        initialBalance:0,
        startDate:''
    })
    const [chartData,setChartData] = useState([])
    const [currentAsset,setCurrentAsset] = useState(null);

    useEffect(()=>{
        const Ref = doc(db,'portfolio',auth.currentUser.uid)
        let removeSnapShot = onSnapshot(Ref,(res)=>{
            if(res.exists()){
                setProtfolio(res.data())
                setChartData([
                    {date:res.data().startDate,balance:res.data().initialBalance},
                    {date:new Date().toLocaleDateString(),balance:res.data().currentBalance}
                ])
            }
        })

        return ()=> removeSnapShot()
    },[])
    return (
        <section>
            <Header />
            <article className='portfolio'>
                <h2>Your Portfolio</h2>
                <div className='Portfolio-status'>
                    <p>
                        <span className='title'>Start Date</span>
                        <span className='data'>{portfolio.startDate}</span>
                    </p>
                    <p>
                        <span className='title'>Initial Balance</span>
                        <span className='data'>${portfolio.initialBalance}</span>
                    </p>
                    <p>
                        <span className='title'>Current balance</span>
                        <span className='data'>${portfolio.currentBalance}</span>
                    </p>
                    <p>
                        <span className='title'>Growth</span>
                        <span className='data'>{portfolio.growth}%</span>
                    </p>
                </div>
                <div className='portfolio-chart'>
                <AreaChart width={1100} height={400} data={chartData}
                        >
                        <defs>
                            <linearGradient id="balance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={`#215ABD`} stopOpacity={0.6}/>
                            <stop offset="95%" stopColor={`#215ABD`} stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="date" />
                        <YAxis dataKey='balance'/>
                        <Tooltip />
                        <Area type="monotone" dataKey="balance" stroke="#215ABD" fillOpacity={1} fill="url(#balance)" />
                    </AreaChart>
                </div>
            </article>
            <ul>
                <Asset currentAsset={currentAsset} setCurrentAsset={setCurrentAsset} index={0} />
            </ul>
            <button className='logout' onClick={()=> signOut(auth)}>
                <p>sign out</p>
                <span>{FiLogOut({})}</span>
            </button>
        </section>
    )
}

export default Home