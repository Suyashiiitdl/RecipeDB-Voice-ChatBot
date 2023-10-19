import React from "react";
import Home from "./pages/Home";
import RecipeList from "./pages/RecipeList";
import RecipeInfo from "./pages/RecipeInfo";
import Contact from "./pages/Contact";
import { BrowserRouter as Router, Route, Link, Routes } 
       from "react-router-dom";

const App = () => {
  return (
    <Router>  
    <div className="App">  
    <Routes>  
      <Route exact path='/'  element={<Home />}  />
          <Route  path='/recipe-voice-bot/' element={<Home />}></Route>  
          <Route  path='/recipe-voice-bot/search_recipe' element={<RecipeList />}></Route>  
          <Route  path='/recipe-voice-bot/recipe_info' element={<RecipeInfo />}></Route>  
          <Route  path='/recipe-voice-bot/contact' element={<Contact />}></Route> 
   </Routes>
    {/* <Routes>  
          <Route exact path='/recipe-voice-bot/' element={<Home />}></Route>  
          <Route exact path='/recipe-voice-bot/search_recipe' element={<RecipeList />}></Route>  
          <Route exact path='/recipe-voice-bot/recipe_info' element={<RecipeInfo />}></Route>  
          <Route exact path='/recipe-voice-bot/contact' element={<Contact />}></Route> 
   </Routes>   */}
   </div>  
</Router>  
  );
};

export default App;