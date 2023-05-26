import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertData } from '../context/AlertContext';
import { auth,db } from '../firebaseConfig';
import { createUserWithEmailAndPassword,updateProfile } from 'firebase/auth';
import { setDoc,doc } from 'firebase/firestore';

const SignUp = () => {
    const navigate = useNavigate()
    const { setAlertData } = AlertData()
    const [ formData, setFormData] = useState({
        email: '',
        password: '',
        passwordConf: '',
        username:'',
        initiateBalance:'',
        startDate:''
    })

    const { email, password, passwordConf,username,initiateBalance,startDate } = formData

    const handleSubmit = e => {
        e.preventDefault()
        if(email === '' || password === '' || passwordConf === '' || username === ''){
            setAlertData({type:'warrning',showen:true,msg:'make sure to fill all the inputs'})
        }else if(password !== passwordConf ){
            setAlertData({type:'warrning',showen:true,msg:'make sure to match the passwords'})
        } else {
            createUserWithEmailAndPassword(auth,email,password)
            .then((res)=>{
                setAlertData({type:'success',showen:true,msg:'created account successfully'})
                updateProfile(res.user,{displayName:username})
                .then(()=>{
                    const Ref = doc(db,'portfolio',auth.currentUser.uid)
                    setDoc(Ref,{
                        initialBalance:parseFloat(initiateBalance),
                        currentBalance:parseFloat(initiateBalance),
                        assets:[],
                        growth:0,
                        startDate: startDate
                    })
                    .then(()=>{
                        navigate('/')
                    })
                })
            })
            .catch((err) => setAlertData({type:'error',showen:true,msg:err.message}))
        }
    }

    const handleChange = e => {
        if(e.target.name === 'initiateBalance'){
            const lastChar = parseFloat(e.target.value[e.target.value.length-1])
            if(e.target.value === ''){
                setFormData(prev => ({...prev,[e.target.name]:''}))
            } else if(Number.isNaN(lastChar)){
                if(e.target.value[e.target.value.length-1] === '.') {
                    setFormData(prev => ({...prev,[e.target.name]:e.target.value}))
                }
            }else if(typeof lastChar == 'number'){
                setFormData(prev => ({...prev,[e.target.name]:e.target.value}))
            }
        }else if(e.target.name === 'startDate'){
            if(new Date(e.target.value) < new Date('6/1/2022')){
                setAlertData({type:'warrning',showen:true,msg:"you can't choose date before this: (1/6/2022)"})
            } else if(new Date(e.target.value) >= new Date(new Date().getTime() - (24 * 60 * 60 * 1000))){
                setAlertData({type:'warrning',showen:true,msg:"you can't choose a future date"})
            } else {
                setFormData({
                    ...formData, 
                    [e.target.name]: e.target.value,
                })
            }
        }else {
            setFormData({
                ...formData, 
                [e.target.name]: e.target.value,
            })
        }
    }
    return (
        <form onSubmit={(e)=>handleSubmit(e)}>
            <label htmlFor="">start date</label>
            <input 
                type="date" 
                autoComplete='off'
                id='startDate'
                name='startDate'
                value={startDate}
                onChange={handleChange}
                />
            <label htmlFor="">initiate balance (USD)</label>
            <input 
                type="text" 
                placeholder='initiate balance' 
                autoComplete='off'
                id='initiateBalance'
                name='initiateBalance'
                value={initiateBalance}
                onChange={handleChange}
                />
            <label htmlFor="">username</label>
            <input 
                type="text" 
                placeholder='username' 
                autoComplete='off'
                id='username'
                name='username'
                value={username}
                onChange={handleChange}
                />
            <label htmlFor="">Email</label>
            <input 
                type="text" 
                autoComplete='off'
                id='email'
                name='email'
                placeholder='name@example.com'
                value={email}
                onChange={handleChange}
            />
            <label htmlFor="">password</label>
            <input 
                type='password'
                autoComplete='off'
                id='password'
                name='password'
                placeholder='****************'
                value={password}
                onChange={handleChange}
            />
            <label htmlFor="">confirm password</label>
            <input 
                type='password'
                autoComplete='off'
                id='confirm'
                name='passwordConf'
                placeholder='****************'
                value={passwordConf}
                onChange={handleChange}
            />
            <button className='Btn'>
                create account
            </button>
            <p>
                already have an account? <Link to='/'><span> login</span></Link> 
            </p>
        </form>
    )
}

export default SignUp