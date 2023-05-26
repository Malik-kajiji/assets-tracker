import React, { useEffect, useState } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { LineChart } from './LineChart';
import { LineChart2 } from './LineChart2';
import { AreaChart, XAxis, YAxis, Tooltip, Area } from 'recharts';
import { auth, db } from '../firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

const Asset = ({ title, setCurrentAsset,stocksAmount, currentAsset, index, startDate,balance,percentage }) => {
    const [chartData, setChartData] = useState([]);
    const [growth,setGrowth] = useState(0);
    const beginBalnce = parseFloat((balance * (percentage/100)).toFixed(2))
    const [currentBalance,setCurrentBalance] = useState(0)

    console.log(chartData)


    function handleClick() {
        if (currentAsset === index) {
            setCurrentAsset(null)
        } else {
            setCurrentAsset(index)
        }
    }



    useEffect(() => {
        const Ref = doc(db, 'stocks', title)
        let removeSnapShot = onSnapshot(Ref, (res) => {
            if (res.exists() && startDate !== '') {
                let startFrom = (new Date(startDate).getTime() - new Date('2022-05-26').getTime() + (24 * 60 * 60 * 1000 * 2)) / 1000 / 60 / 60 / 24 
                startFrom = startFrom - (startFrom / 7 * 2) - 5
                const difference = (new Date().getTime() - new Date('2023-05-26').getTime())
                const data = res.data().results.slice(startFrom)
                let growthPercetage = data[data.length - 1].c / (data[0].c / 100) - 100
                setGrowth(growthPercetage.toFixed(2))
                setCurrentBalance(parseFloat((beginBalnce + (beginBalnce * growthPercetage/100)).toFixed(2)))

                setChartData(()=>{
                    const newData = data.map((e)=>{
                        const { c:close, o:open , t:time  } = e
                        return {
                            date: new Date(time + difference).toLocaleDateString(),
                            open:open * stocksAmount,
                            close:close * stocksAmount
                        }
                    })
                    return newData
                })
            }
        })
        return () => removeSnapShot
    }, [startDate])
    return (
        <li className={`${index === currentAsset && 'showen'}`}>
            <div className='top'>
                <h2>{title}</h2>
                <span className={`${growth >= 0 ? 'green':'red'}`}>
                    {`${growth > 0 ? `+${growth}` : growth}`}%
                </span>
            </div>
            <button onClick={handleClick}>
                <span>
                    {RiArrowDropDownLine({})}
                </span>
            </button>
            <div className='content'>
                <div className='info'>
                    <p>
                        <span className='title'>percentage</span>
                        <span className='data'>%{percentage}</span>
                    </p>
                    <p>
                        <span className='title'>stocks amount</span>
                        <span className='data'>{stocksAmount}</span>
                    </p>
                    <p>
                        <span className='title'>begin balance</span>
                        <span className='data'>${beginBalnce}</span>
                    </p>
                    <p>
                        <span className='title'>Current balance</span>
                        <span className='data'>${currentBalance}</span>
                    </p>
                </div>
                <article className='chart'>
                {/* <AreaChart width={1000} height={340} data={chartData}
                    >
                        <defs>
                            <linearGradient id="balance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={`#215ABD`} stopOpacity={0.6} />
                                <stop offset="95%" stopColor={`#215ABD`} stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="date" />
                        <YAxis dataKey='open' />
                        <Tooltip />
                        <Area type="monotone" dataKey="open" stroke="#215ABD" fillOpacity={1} fill="url(#balance)" />
                    </AreaChart> */}
                    <LineChart stock={chartData}/>
                </article>
            </div>
        </li>
    )
}

export default Asset