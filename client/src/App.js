import './App.css';
import {useState, useEffect } from 'react';
import {Route, Routes} from 'react-router-dom';
import Login from './Components/Authentication/Login';
import Signup from './Components/Authentication/Signup';
import Home from './Components/Home/Home';
import Profile from './Components/Profile/Profile';
import DocumentInfo from './Components/Documents/DocumentInfo';
import AboutUs from './Components/Pages/AboutUs';
import HowToUse from './Components/Pages/HowToUse';
import Tech from './Components/Pages/Tech';
import ProfileSettings from './Components/Profile/ProfileSettings';
import Profilen from './Components/Profile/ProfileAuth';

import AuthLoading from './Components/Authentication/AuthComponents/AuthLoading';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(() => 
    JSON.parse(localStorage.getItem("isLoggedIn")) ?? false
  );

  const [userInfo, setUserInfo] = useState(() => 
  {
    const temp = localStorage.getItem("userInfo");
    if(temp === null || temp === "")
    {
      return [];
    }
    return JSON.parse(temp);
  });
 

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn])
  
  useEffect(() => {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  }, [userInfo])

  

  

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home userInfo={userInfo} setUserInfo={setUserInfo} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}></Route>
        <Route path='/*' element={<Home userInfo={userInfo} setUserInfo={setUserInfo} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}></Route>
        <Route path='/Login' element={<Login userInfo={userInfo} setUserInfo={setUserInfo} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}></Route>
        <Route path='/Signup' element={<Signup userInfo={userInfo} isLoggedIn={isLoggedIn}/>}></Route>
        <Route path='/Profile' element={<Profile userInfo={userInfo} setUserInfo={setUserInfo} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}></Route>
        <Route path='/Document/:id' element={<DocumentInfo userInfo={userInfo} setUserInfo={setUserInfo} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}></Route>
        <Route path='/AboutUs' element={<AboutUs userInfo={userInfo} isLoggedIn={isLoggedIn}/>}></Route>
        <Route path='/Tech' element={<Tech userInfo={userInfo} isLoggedIn={isLoggedIn}/>}></Route>
        <Route path='/HowToVerifySignature' element={<HowToUse userInfo={userInfo} isLoggedIn={isLoggedIn}/>}></Route>
        <Route path='/ProfileSettings' element={<ProfileSettings userInfo={userInfo} isLoggedIn={isLoggedIn}/>}></Route>
        <Route path='/Auth' element={<Profilen />}></Route>
        <Route path='/AuthLoading' element={<AuthLoading setUserInfo={setUserInfo} setIsLoggedIn={setIsLoggedIn}/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
