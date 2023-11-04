import React, { Component, useEffect, useState }  from 'react';
import './Home.css';
import axios from 'axios'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCoffee } from '@fortawesome/free-solid-svg-icons'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { text } from '@fortawesome/fontawesome-svg-core';
import { Navigate } from 'react-router-dom';
import {  useNavigate } from 'react-router-dom';

const Home = (props) =>{
    const {
        transcript,
        listening,
        browserSupportsSpeechRecognition,
        isMicrophoneAvailable
    } = useSpeechRecognition();
    const navigate = useNavigate();
    const [userTranscript, setUserTranscipt]  = useState("")
    const [isDropDownExpanded, setDropDownExpanded] = useState("none")
    
    
    useEffect(()=>{
        setUserTranscipt(transcript)
    },[transcript])

    if (!browserSupportsSpeechRecognition || !isMicrophoneAvailable) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    function handleChange(event){
        setUserTranscipt(event.target.value)
    }
    function changeDisplay(event){
        const parent = event.target
        if(parent.tagName=='A'){
            const div = (parent.getElementsByTagName("div"));
            if(isDropDownExpanded=="none"){
                setDropDownExpanded("block")
                div[0].style.display="block";
            }
            else{
                setDropDownExpanded("none")
                div[0].style.display="none";
            }
        }
    }

    // input.addEventListener("keypress", function (event) {
    //     if (event.keyCode == 13) {
    //        // enter pressed
    //     }
    //  });

    function handleSubmit(event){
        console.log("user wants to say : ",userTranscript)
        if(userTranscript.trim().length > 0){
            window.open('/recipe-voice-bot/search_recipe')
            localStorage.setItem('userTranscript',userTranscript);
        }
        setUserTranscipt("")
        
    }


    const [selectedItem, setSelectedItem]= useState('');

    function resetTranscript(){
        SpeechRecognition.stopListening()
        setUserTranscipt("");
    }


    function handleSubmit(event){
        console.log("user wants to say : ",userTranscript)
        if(userTranscript.trim().length > 0){
            navigate('/recipe-voice-bot/search_recipe')
            localStorage.setItem('userTranscript',userTranscript);
        }
        setUserTranscipt("")
        
    }
    function handleDropdownClick(text){ // this function is used to set the transcript to the text of the dropdown  
        
        setUserTranscipt(text)
        setDropDownExpanded("block");
        setSelectedItem(text);

    }
    
    return (

        <div>
            <Header></Header>
            <div className='main'>
                {/* <hr className='tophr' style={{width:'90%',marginTop:'2.5%',borderTop: '1px solid black'}}></hr> */}
                <p className='helpStyle'><span className='ask'>Ask for Recipes by</span> 
                <span>
                <a className='dropdown' id='a1' onClick={changeDisplay} style={{textDecoration:'None',color:'black'}}>&nbsp;&nbsp; &nbsp; &nbsp; Cuisine(Country) <FontAwesomeIcon onClick={changeDisplay} className='fa' icon={faCaretDown} ></FontAwesomeIcon><div class="dropdown-content">
                    <p className={selectedItem === "Show me Indian recipes." ? "selected" : ""} onClick={() => handleDropdownClick("Show me Indian recipes.")}>Show me Indian recipes.</p>
                    <p className={selectedItem === "Suggest Thai recipes for me to prepare at home?" ? "selected" : ""} onClick={() => handleDropdownClick("Suggest Thai recipes for me to prepare at home?")}>Suggest Thai recipes for me to prepare at home?</p>
                    <p className={selectedItem === "Recommend some indigenous Korean  recipes" ? "selected" : ""} onClick={() => handleDropdownClick("Recommend some indigenous Korean  recipes")}>Recommend some indigenous Korean  recipes</p>
                    <p className={selectedItem === "Give a list of some Australian recipes" ? "selected" : ""} onClick={() => handleDropdownClick("Give a list of some Australian recipes")}>Give a list of some Australian recipes</p>
                    <p className={selectedItem === "Show me some Belgian dishes involving Chocolate." ? "selected" : ""} onClick={() => handleDropdownClick("Show me some Belgian dishes involving Chocolate.")}>Show me some Belgian dishes involving Chocolate.</p>
                </div></a>
                &nbsp;&nbsp; &nbsp; &nbsp;<a className='dropdown' id='a2' onClick={changeDisplay} style={{textDecoration:'None',color:'black'}}> Ingredients <FontAwesomeIcon className='fa' icon={faCaretDown} ></FontAwesomeIcon>
                    <div class="dropdown-content2">
                    
                    <p className={selectedItem === "Recommend dishes with chicken, broccoli, and garlic for tonight's dinner." ? "selected" : ""} onClick={() => handleDropdownClick("Recommend dishes with chicken, broccoli, and garlic for tonight's dinner.")}>Recommend dishes with chicken, broccoli, and garlic for tonight's dinner.</p>
                    <p className={selectedItem === "Show me some French recipes involving Cheese" ? "selected" : ""} onClick={() => handleDropdownClick("Show me some French recipes involving Cheese")}>Show me some French recipes involving Cheese</p>
                    <p className={selectedItem === "Provide Italian recipes that have wine as one the ingredients" ? "selected" : ""} onClick={() => handleDropdownClick("Provide Italian recipes that have wine as one the ingredients")}>Provide Italian recipes that have wine as one the ingredients</p>
                    <p className={selectedItem === "Show me a diet having chicken" ? "selected" : ""} onClick={() => handleDropdownClick("Show me a diet having chicken")}>Show me a diet having chicken</p>
                    <p className={selectedItem === "Show some desserts to make at home from cream" ? "selected" : ""} onClick={() => handleDropdownClick("Show some desserts to make at home from cream")}>Show some desserts to make at home from cream</p>
                </div>
                </a>
                &nbsp;&nbsp; &nbsp; &nbsp;<a className='dropdown' id='a3' onClick={changeDisplay} style={{textDecoration:'None',color:'black'}}> Ingredient Category <FontAwesomeIcon className='fa' icon={faCaretDown} ></FontAwesomeIcon> 
                    <div className='dropdown-content3'>
                        <p className={selectedItem === "Show vegetable and fruit recipes" ? "selected" : ""} onClick={() => handleDropdownClick("Show vegetable and fruit recipes")}>Show vegetable and fruit recipes.</p>
                        <p className={selectedItem === "Suggest chicken based recipes" ? "selected" : ""} onClick={() => handleDropdownClick("Suggest chicken based recipes")}>Suggest chicken based recipes</p>
                        <p className={selectedItem === "Show seafood recipes for a delectable ocean-inspired dining experience." ? "selected" : ""} onClick={() => handleDropdownClick("Show seafood recipes for a delectable ocean-inspired dining experience.")}>Show seafood recipes for a delectable ocean-inspired dining experience.</p>
                        <p className={selectedItem === "Recommend bakery style recipes." ? "selected" : ""} onClick={() => handleDropdownClick("Recommend bakery style recipes.")}>Recommend bakery style recipes.</p>
                        <p className={selectedItem === "Suggest berry infused recipes." ? "selected" : ""} onClick={() => handleDropdownClick("Suggest berry infused recipes.")}>Suggest berry infused recipes.</p>
                    </div>
                    </a>
                &nbsp;&nbsp; &nbsp; &nbsp;<a className='dropdown' id='a4' onClick={changeDisplay} style={{textDecoration:'None',color:'black'}}> Cooking Process <FontAwesomeIcon className='fa' icon={faCaretDown} ></FontAwesomeIcon>
                    <div className="dropdown-content4">
                        {/* <p className={selectedItem === "Can you recommend some dishes for lunch which do not require refrigeration." ? "selected" : ""} onClick={() => handleDropdownClick("Can you recommend some dishes for lunch which do not require refrigeration.")}>Can you recommend some dishes for lunch which do not require refrigeration.</p> */}
                        <p className={selectedItem === "Show me recipes using drain method" ? "selected" : ""} onClick={() => handleDropdownClick("Show me recipes using drain method")}>Show me recipes using drain method</p>
                        <p className={selectedItem === "Could you give dishes which involve seasoning with cilantro and lime" ? "selected" : ""} onClick={() => handleDropdownClick("Could you give dishes which involve seasoning with cilantro and lime")}>Could you give dishes which involve seasoning with cilantro and lime</p>
                        
                    </div>
                    </a>
                
                &nbsp;&nbsp; &nbsp; &nbsp;<a className='dropdown' id='a5' onClick={changeDisplay} style={{textDecoration:'None',color:'black'}}>  Utensils <FontAwesomeIcon className='fa' icon={faCaretDown} ></FontAwesomeIcon>
                    <div className='dropdown-content5'>
                        <p className={selectedItem === "Can you give me some recipes which require cooking in a microwave?" ? "selected" : ""} onClick={() => handleDropdownClick("Can you give me some recipes which require cooking in a microwave?")}>Can you give me some recipes which require cooking in a microwave?</p>
                        <p className={selectedItem === "Show me some recipes which don't need a oven." ? "selected" : ""} onClick={() => handleDropdownClick("Show me some recipes which don't need a oven.")}>Show me some recipes which don't need a oven</p>
                        <p className={selectedItem === "Can you recommend some recipes which don't need refrigeration" ? "selected" : ""} onClick={() => handleDropdownClick("Can you recommend some recipes which don't need refrigeration")}>Can you recommend some recipes which don't need refrigeration</p>
                    </div>
                    </a>
                </span>
                </p>
                {/* <hr style={{width:'90%',borderTop: '1px solid black'}}></hr> */}

                {/* <button className='buttonstyle buttonmargin1' onClick={SpeechRecognition.startListening}>SPEAK</button>
                <button className='buttonstyle buttonmargin1' onClick={resetTranscript}>CLEAR</button> */}
                
                {/* <div className="recipe-logo"></div><img src = {require('./RecipeDBLogoText.png')} ></img> */}
                
                {/* <div className='image-text-container'> <div className="chatbot-heading"><h2>Voice ChatBot</h2> </div> <img src = {require('./RecipeDBLogoText.png')} alt="Your Image" className="custom-image"></img></div> */}
                <div className="image-and-text-container">
      <img
        src={require('./RecipeDBLogoRed.png')}
        alt="Your Image"
        className="custom-image"
      />
      <p className="chatbot-heading">
        <h2>Voice ChatBot</h2>
      </p>
    </div>
                
                <h2 className='left-margin'>{listening ? 'Listening...' : ''}</h2>
                
                <form onSubmit={handleSubmit} className='centerdiv'>
                    <label >
                    <textarea type="text" value={userTranscript} onChange={handleChange}  onRateChange ={handleSubmit} onKeyPress={(event) => {if (event.key === 'Enter') {handleSubmit(event);}}}placeholder="Click SPEAK Button to ask queries to RecipeDB..." className='textareastyle'/>
                    </label>
                </form>
                
                <button className='rounded-button' onClick={SpeechRecognition.startListening}>SPEAK</button>
                <button className='rounded-button1' onClick={resetTranscript}>CLEAR</button>

                
                <button className='rounded-button2' onClick= {handleSubmit} >SUBMIT</button> 
        
            </div>
            <Footer></Footer>
       
        </div>
        
  );
  
    
}
export default Home;