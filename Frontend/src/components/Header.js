import React, { Component, useEffect, useState }  from 'react';
import './Header.css';


const  Header = (props) =>{
    const [isNavExpanded, setIsNavExpanded] = useState(false)

    const handleCoSyClick =()=>{
        window.open('https://cosylab.iiitd.edu.in/')
    }
    const handleHomeClick =()=>{
        window.open('/recipe-voice-bot/')
    }
    const handleContactClick =()=>{
        window.open('/recipe-voice-bot/contact/')
    }
    function handleHamburger(){
        const element = document.querySelector(".main")
        if(element!=null){
            if( element.style.filter=="blur(5px)"){
                element.style.filter="none";
            }
            else{
                element.style.filter = "blur(5px)";
            }
        }
        const element2 = document.querySelector(".tablestyle")
        if(element2!=null){
            if( element2.style.filter=="blur(5px)"){
                element2.style.filter="none";
            }
            else{
                element2.style.filter = "blur(5px)";
            }
        }
    }
    return (
    <nav className='headerStyles'>
       
        <ul>
            <img src = {require('./RecipeDBLogoRed.png')} ></img>
            {/* <p>RecipeDB </p> */}
           <p> RecipeDB</p>
            <button className="hamburger" onClick={handleHamburger} onMouseOut={()=>
            {if(document.querySelector(".main")!=null){
            document.querySelector(".main").style.filter="none"}
            if(document.querySelector(".tablestyle")!=null){
            document.querySelector(".tablestyle").style.filter="none"}}
            }>
            {/* icon from heroicons.com */}
            <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="white"
            >
            <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                clipRule="evenodd"
            />
            </svg>
            </button>
            <div className="navigation-menu">
                <li onClick={handleHomeClick}>Home</li>
                <hr style={{width:'80%',marginTop:'2.5%',marginBottom:'2px'}}></hr>
                <li onClick={handleCoSyClick}>CoSyLab</li>
                <hr style={{width:'80%',marginTop:'2.5%',marginBottom:'2px'}}></hr>
                <li onClick = {handleContactClick}>Contact</li>
            </div>
            
        </ul>
    </nav>
    );
}

export default Header;