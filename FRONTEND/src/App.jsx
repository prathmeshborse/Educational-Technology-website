import { Route, Routes } from "react-router-dom";
import OpenRoute from "./components/core/Auth/OpenRoute";

import Navbar from "./components/common/Navbar";
import Home from "./pages/Home";
// import Login from "./pages/Login";

function App() {
  return (
      <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">

        <Navbar/>

        <Routes>

          <Route path="/" element={<Home/>} />

          {/* <Route path="signup" element={ <OpenRoute> <Signup />  </OpenRoute> } /> */}
          {/* <Route path="login" element={ <OpenRoute> <Login />  </OpenRoute> } /> */}

        </Routes>
      </div>
  );
}

export default App;