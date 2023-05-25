import React, { useState } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';

const Asset = ({setCurrentAsset,currentAsset,index}) => {
    function handleClick(){
        if(currentAsset === index){
            setCurrentAsset(null)
        }else {
            setCurrentAsset(index)
        }
    }
    return (
        <li className={`${index === currentAsset && 'showen'}`}>
            <div className='top'>
                <h2>Tesla</h2>
                <span className='green'>
                    +28%
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
                        <span className='title'>Start Date</span>
                        <span className='data'>2013-03-20</span>
                    </p>
                    <p>
                        <span className='title'>percentage</span>
                        <span className='data'>12%</span>
                    </p>
                    <p>
                        <span className='title'>begin balance</span>
                        <span className='data'>$32500</span>
                    </p>
                    <p>
                        <span className='title'>Current balance</span>
                        <span className='data'>$47500</span>
                    </p>
                </div>
                <article className='chart'>
                </article>
            </div>
        </li>
    )
}

export default Asset