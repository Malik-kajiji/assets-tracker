import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { MdOutlineAdd } from 'react-icons/md';
import { auth, db } from '../firebaseConfig';
import { AlertData } from '../context/AlertContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Header = ({startDate,maxPercetage,initiatBalance,assets}) => {
    const { setAlertData } = AlertData()
    const [isAddShowen,setIsAddShowen] = useState(false);
    const [formData,setFormData] = useState(
        {asset:'',percentage:'',totalPrice:0,stocksAmount:0,recentPrice:0}
        );
        const {asset,percentage,totalPrice,stocksAmount,recentPrice} = formData

    const [username,setUsername] = useState('')
    function handleChange(e){
        if(e.target.name === 'percentage'){
            const lastChar = parseFloat(e.target.value[e.target.value.length-1])
            if(e.target.value === ''){
                setFormData(prev => ({...prev,[e.target.name]:''}))
            } else if(Number.isNaN(lastChar)){
                if(e.target.value[e.target.value.length-1] === '.') {
                    setFormData(prev => ({...prev,[e.target.name]:e.target.value}))
                }
            }else if(typeof lastChar == 'number'){
                if(parseFloat(e.target.value) > maxPercetage){
                    setAlertData({msg:`maximam percentage is %${maxPercetage}`,type:'warrning',showen:true})
                }else {
                    setFormData(prev => ({...prev,[e.target.name]:e.target.value}))
                }
            }
        }else {
            setFormData(prev => ({...prev,[e.target.name]:e.target.value}))
        }
    }

    function handleAdd(e){
        e.preventDefault();
        if(asset === "" || percentage === '' || parseFloat(percentage) === 0){
            setAlertData({msg:`make sure to fill up the inputs`,type:'warrning',showen:true})
        }else {
            let doesExist = false;
            for(let i = 0; i < assets.length ; i++){
                if(assets[i].asset === asset){
                    doesExist = true
                }
            }

            if(doesExist){
                setAlertData({msg:`the stock is already added`,type:'warrning',showen:true})
            }else {

                const ref = doc(db,'portfolio',auth.currentUser.uid)
                getDoc(ref)
                .then(res => {
                    const newAssests = [...res.data().assets,{
                        asset:asset,
                        percentage: parseFloat(percentage),
                        totalPrice:parseFloat(totalPrice),
                        stocksAmount:parseFloat(stocksAmount),
                        recentPrice:parseInt(recentPrice)
                    }]
    
                    setDoc(ref,{...res.data(),assets:newAssests})
                    .then(()=>{
                        setAlertData({msg:`asset added successfully`,type:'success',showen:true})
                    })
                    .catch((err)=>{
                        setAlertData({msg:err.message,type:'error',showen:true})
                    })
                    .finally(()=>{
                        setFormData({asset:'',percentage:'',totalPrice:0,stocksAmount:0,recentPrice:0})
                        setIsAddShowen(false)
                    })
                })
            }
        }
    }
    
    function handleCancel(e){
        e.preventDefault();
        setFormData({asset:'',percentage:'',totalPrice:0,stocksAmount:0,recentPrice:0})
        setIsAddShowen(false)
    }

    useEffect(()=>{
        if(asset !== '' && percentage !== ''){
            const ref = doc(db,'stocks',asset)
            getDoc(ref)
            .then((res)=>{
                const difference = (new Date().getTime() - new Date('2023-05-24').getTime())
                const data = res.data().results

                let newData = data.map((e)=>{
                    const { c:close, o:open , t:time  } = e
                    if(time > (new Date(startDate).getTime() - difference)){
                        return {
                            date: new Date(time + difference).toLocaleDateString(),
                            open:open ,
                            close:close
                        }
                    }
                })

                newData = newData.filter(e => e !== undefined)


                let newPrice = (initiatBalance * parseFloat(formData.percentage) / 100).toFixed(2)
                let newAmount = (parseFloat(newPrice) / newData[0].close).toFixed(2)
                let stockPrice = newData[newData.length - 1].close
                setFormData(prev=>({
                    ...prev,
                    totalPrice:newPrice,
                    stocksAmount:newAmount,
                    recentPrice:stockPrice
                }))
            })
        }else {
            setFormData(prev=>({
                ...prev,
                totalPrice:'',
                stocksAmount:''
            }))
        }
    },[asset,percentage])

    useEffect(()=>{
        setUsername(auth.currentUser.displayName)
    },[auth.currentUser.displayName])
  return (
    <>
        <header>
                <h2>
                    Hi {username}
                </h2>
                <button onClick={()=>setIsAddShowen(true)}>
                    <span>
                        {MdOutlineAdd({})}
                    </span>
                    <p>
                        Add Asset
                    </p>
                </button>
            </header>
        <article className={`add-asset ${isAddShowen && 'show'}`} >
            <form>
                <select 
                    name="asset" 
                    onChange={(e)=>handleChange(e)} 
                    value={formData.asset}>
                    <option value="">select an asset</option>
                    <option value="AAPL">AAPL</option>
                    <option value="AMD">AMD</option>
                    <option value="AMZN">AMZN</option>
                    <option value="INTC">INTC</option>
                    <option value="MSFT">MSFT</option>
                    <option value="TSLA">TSLA</option>
                </select>
                <input 
                    type="text" 
                    placeholder='Percentage of initial balance'
                    name="percentage" 
                    onChange={(e)=>handleChange(e)} 
                    value={formData.percentage}
                    />
                    <p>maximam percentage is {maxPercetage}%</p>
                    <h2 className='price'>
                        {/* here goes the price of the stocks */}
                        {formData.totalPrice >0 && `$${formData.totalPrice} `}
                    </h2>
                    <h2 className='stocks-amount'>
                        {/* here goes the amount of the stocks */}
                        {formData.stocksAmount >0 && `${formData.stocksAmount} stocks`}
                    </h2>
                <button className='cancel' onClick={(e)=>handleCancel(e)}>Cancel</button>
                <button className='add Btn' onClick={(e)=>handleAdd(e)}>Buy</button>
            </form>
        </article>
    </>
  )
}

export default Header