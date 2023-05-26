import React, { useEffect, useState } from 'react';
import '../styles/home.css';
import { FiLogOut } from 'react-icons/fi';
import { auth, db } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { AreaChart, XAxis, YAxis, Tooltip, Area } from 'recharts';
import Asset from './Asset';
import Header from './Header';
import { LineChart } from './LineChart';
import { PieChart } from './PieChart';
import { AlertData } from '../context/AlertContext';

const Home = () => {
    const [portfolio, setProtfolio] = useState({
        assets: [],
        currentBalance: 0,
        growth: 0,
        initialBalance: 0,
        startDate: ''
    })
    const [pieChartData, setPieChartData] = useState({})
    const [maxPercetage, setMaxPercentage] = useState(100);
    const [currentAsset, setCurrentAsset] = useState(null);
    const { setAlertData } = AlertData()

    useEffect(() => {
        console.log('useEffect');
        const Ref = doc(db, 'portfolio', auth.currentUser.uid)
        let removeSnapShot = onSnapshot(Ref, (res) => {
            if (res.exists()) {
                let allAssestsPercentage = 0;
                let newPrice = 0;
                for (let i = 0; i < res.data().assets.length; i++) {
                    allAssestsPercentage = + res.data().assets[i].percentage
                    newPrice += res.data().assets[i].recentPrice * res.data().assets[i].stocksAmount
                }
                setMaxPercentage(prev => prev - allAssestsPercentage)
                let noneChangedBalance = res.data().initialBalance * ((100 - allAssestsPercentage) / 100)
                let ChangedBalance = noneChangedBalance + newPrice
                ChangedBalance = parseFloat(ChangedBalance.toFixed(2))
                let growth = parseFloat((ChangedBalance / res.data().initialBalance).toFixed(2))
                if (ChangedBalance === res.data().initialBalance) {
                    growth = 0
                }
                setProtfolio({ ...res.data(), currentBalance: ChangedBalance, growth })
            }
        })
        return () => removeSnapShot
    }, [portfolio.startDate])


    useEffect(() => {
        let newObj = {}
        for (let i = 0; i < portfolio.assets.length; i++) {
            newObj[portfolio.assets[i].asset] = portfolio.assets[i].percentage
        }
        setPieChartData(newObj)
    }, [portfolio.assets.length])



    const handleChange = e => {
        if (new Date(e.target.value) < new Date('6/1/2022')) {
            setAlertData({ type: 'warrning', showen: true, msg: "you can't choose date before this: (1/6/2022)" })
        } else if (new Date(e.target.value) >= new Date(new Date().getTime() - (24 * 60 * 60 * 1000))) {
            setAlertData({ type: 'warrning', showen: true, msg: "you can't choose a future date" })
        } else {
            setProtfolio(prev => ({ ...prev, startDate: e.target.value }))
            const Ref = doc(db, 'portfolio', auth.currentUser.uid)
            setDoc(Ref, { ...portfolio, startDate: e.target.value });
            console.log(portfolio);
        }
    }

    return (
        <section>
            <Header startDate={portfolio.startDate} maxPercetage={maxPercetage} initiatBalance={portfolio.initialBalance} assets={portfolio.assets} />
            <article className='portfolio'>
                <h2>Your Portfolio</h2>
                <div className='Portfolio-status'>
                    <p>
                        <span className='title'>Start Date</span>
                        <span className='data'>
                            {/* {portfolio.startDate} */}
                            <input
                                type="date"
                                autoComplete='off'
                                id='startDate'
                                name='startDate'
                                value={portfolio.startDate}
                                onChange={handleChange}
                            />
                        </span>
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
                        <span className={`data ${portfolio.growth > 0 ? 'green' : 'red'}`}>
                            {portfolio.growth > 0 ?
                                `+${portfolio.growth}%`
                                :
                                `${portfolio.growth}%`
                            }
                        </span>
                    </p>
                </div>
                <div className='portfolio-chart'>
                    <PieChart piData={pieChartData} />
                </div>
            </article>
            <ul>
                {portfolio.assets.map((e, i) => (

                    <Asset
                        title={e.asset}
                        currentAsset={currentAsset}
                        setCurrentAsset={setCurrentAsset}
                        index={i}
                        key={i}
                        startDate={portfolio.startDate}
                        balance={portfolio.initialBalance}
                        percentage={e.percentage}
                        stocksAmount={e.stocksAmount}
                    />
                ))
                }
            </ul>
            <button className='logout' onClick={() => signOut(auth)}>
                <p>sign out</p>
                <span>{FiLogOut({})}</span>
            </button>
        </section>
    )
}

export default Home;