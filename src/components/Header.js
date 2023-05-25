import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { MdOutlineAdd } from 'react-icons/md';
import { auth } from '../firebaseConfig';
import { AlertData } from '../context/AlertContext';

const Header = () => {
    const { setAlertData } = AlertData()
    const [isAddShowen,setIsAddShowen] = useState(false);
    const [formData,setFormData] = useState({asset:'',percentage:''});
    const [maxPercetage,setMaxPercentage] = useState(100)
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
        setIsAddShowen(false)
    }

    useEffect(()=>{
        let removeStateChange = onAuthStateChanged(auth,(res)=>{
            if(res){
                setUsername(res.displayName)
            }
        })

        return () => removeStateChange
    },[])
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
                </select>
                <input 
                    type="text" 
                    placeholder='Percentage'
                    name="percentage" 
                    onChange={(e)=>handleChange(e)} 
                    value={formData.percentage}
                    />
                    <p>maximam percentage is {maxPercetage}%</p>
                    <h2 className='price'>
                        {/* here goes the price of the stocks */}
                        $3200
                    </h2>
                <button className='cancel' onClick={(e)=>handleAdd(e)}>Cancel</button>
                <button className='add Btn' onClick={(e)=>handleAdd(e)}>Buy</button>
            </form>
        </article>
    </>
  )
}

export default Header