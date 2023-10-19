import React, { Component, useEffect, useState }  from 'react';
import Header from '../components/Header';
import './Contact.css';
import Footer from '../components/Footer';


const  Contact = (props) =>{
    return (
        <div>
            <Header/>
            <div className='contactStyle'>
                  <h1>GET IN TOUCH</h1>
                  <hr style={{width:'80%'}}></hr>
                   <p style={{margin:'2rem'}}> 
                    <b>Prof. Ganesh Bagler</b>
                    </p>
                    <p>
                    Infosys Center for Artificial Intelligence</p>
                    <p>Department of Computational Biology, IIIT-Delhi, New Delhi</p> 
                    <a href="mailto: bagler+voice@iiitd.ac.in"><b>bagler+voice@iiitd.ac.in</b></a>  
            </div>
            <hr style={{width:'80%'}}></hr>
            <div >
                <iframe className='googleMap'
                        src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJHazaZOXjDDkRVsV7DjQuWCw&amp;key=AIzaSyBRBQG98E5YdUoooyAk2wd-_olpWmL5ACE"
                        >
                </iframe>
                    </div>
            <Footer></Footer>
        </div>
    );
}

export default Contact;