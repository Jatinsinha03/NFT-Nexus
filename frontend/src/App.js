import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import LandingPage from './Pages/LandingPage/LandingPage';
import Login from './Pages/Login/Login';
import SignUp from './Pages/SignUp/SignUp';
import Main from './Pages/Main/Main';
import NFTPage from './Pages/NFT/NFTPage';
import Favorites from './Pages/Favorites/Favorites';

function App() {
  return (
    <>
    <Router>
    <Routes>
    
          <Route exact path='/' element={<LandingPage/>}/>
          <Route exact path='/login' element={<Login/>}/>
          <Route exact path='/signup' element={<SignUp/>}/>
          <Route exact path='/main' element={<Main/>}/>
          <Route exact path='/favorite' element={<Favorites/>}/>
          <Route path="/nft/:contractAddress" element={<NFTPage />} />
        </Routes>
      
    </Router>
    </>
  );
}

export default App;
