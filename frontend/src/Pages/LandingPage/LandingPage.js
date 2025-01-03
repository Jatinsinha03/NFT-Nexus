import React from 'react'
import {
    Link
    
} from "react-router-dom";

export default function LandingPage() {
  return (
    <div>
      <h1>This is the landing page</h1>
      <Link to="/login"><button>Login</button></Link>
      <Link to="/signup"><button>SignUp</button></Link>
    </div>
  )
}
