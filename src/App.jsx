import { Route, Routes, Navigate } from "react-router";
import Login from "./PAGES/login";
import Signup from "./PAGES/signup";
import ProblemMenu from "./PAGES/problemMenu";
import { checkAuth } from "./authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import AdminPanel from "./Components/adminpanel";
import ProblemPage from "./PAGES/ProblemPage";
import Admin from "./PAGES/admin";
import Profile from "./PAGES/profile";
import AdminDelete from "./Components/admindelete";
import AdminUpdate from "./Components/adminupdate";
import UpdatingForm from "./Components/UpdatingForm";
import AdminVideo from "./Components/adminvideo";
import AdminUpload from "./Components/adminupload";
import Home from "./PAGES/mainHomePage";

function App(){
  //took only {isAuthenticated} from user: null, isAuthenticated: false, loading: false, error: null
  const {isAuthenticated, loading, user, authChecked} = useSelector((state)=> state.auth);
  const dispatch = useDispatch();

  //we only wanted initial rendering ([] dependency is not good habit, so we put dispatch as it won't change)
  useEffect(()=>{
    dispatch(checkAuth());
  }, [dispatch])
  
  // Show spinner only if auth check is not complete or loading
   if (!authChecked || loading ) { //loading(isAuthenticted not fetched) or user not fetched(to check for admin)
    return (<div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner text-primary"></span>

    </div>);
  }
  
  return(
    <>
    <Routes>
      <Route path="/" element={isAuthenticated ?<Home></Home>:<Navigate to="/signup" />}></Route>
      <Route path="/login" element={isAuthenticated?<Navigate to="/" />:<Login></Login>}></Route>
      <Route path="/problemmenu"  element={isAuthenticated?<ProblemMenu/>:<Signup></Signup>} />

      <Route path="/signup" element={isAuthenticated?<Navigate to="/" />:<Signup></Signup>}></Route>
      <Route path="/admin" element={isAuthenticated&&user&&user.role === "admin" ? <Admin/> : <Navigate to="/" />}></Route>
      <Route path="/profile" element={isAuthenticated&&user ? <Profile/> : <Navigate to="/" />}></Route>
      <Route path="/admin/create" element={isAuthenticated&&user&&user.role === "admin" ? <AdminPanel/> : <Navigate to="/" />}></Route>
      <Route path="/admin/update" element={isAuthenticated&&user&&user.role === "admin" ? <AdminUpdate/> : <Navigate to="/" />}></Route>
      <Route path="/problem/update/:id" element={isAuthenticated&&user&&user.role === "admin" ? <UpdatingForm/> : <Navigate to="/" />}></Route>
      <Route path="/admin/delete" element={isAuthenticated&&user&&user.role === "admin" ? <AdminDelete/> : <Navigate to="/" />}></Route>
      <Route path="/admin/video" element={isAuthenticated&&user&&user.role === "admin" ? <AdminVideo/> : <Navigate to="/" />}></Route>
      <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/" />} />
      <Route path="/problem/:problemId" element={<ProblemPage></ProblemPage>}></Route>
    </Routes>
    </>
  )
}     

export default App;