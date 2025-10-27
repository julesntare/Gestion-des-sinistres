import {BrowserRouter, Routes, Route} from "react-router-dom"
import Register from "./components/Registration.tsx"
import Login from "./components/Login.tsx"
import Home from "./components/home.tsx"
import HomeExpert from "./components/homeexpert.tsx"
import HomeClient from "./components/homeclient.tsx"
import User from "./components/users.tsx"
import Sinistres from "./components/Sinistres.tsx"
import Sinistre from "./components/sinistre.tsx"
import Claims from "./components/claims.tsx"
import Documents from "./components/Documents.tsx"
import Document from "./components/Document.tsx"
import Expertises from "./components/Expertises.tsx"
import Expertise from "./components/Expertise.tsx"
import Paiements from "./components/Paiements.tsx"
import Experts from "./components/Experts.tsx"
import Polices from "./components/Polices.tsx"
import Roles from "./components/Roles.tsx"
import './App.css'
import ProtectedRoute from "./components/protectedroute.tsx"
import ProtectedRouteE from "./components/protectedrouteE.tsx"
import PublicRoute from "./components/publicroute.tsx"

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<PublicRoute><Login /></PublicRoute>} />
      <Route path='/register' element={<PublicRoute><Register /></PublicRoute>} />
      <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path='/homeexpert' element={<ProtectedRouteE><HomeExpert /></ProtectedRouteE>} />
      <Route path='/homeclient' element={<HomeClient />} />
      <Route path='/users' element={<ProtectedRoute><User /></ProtectedRoute>} />
      <Route path='/sinistres' element={<ProtectedRouteE><Sinistres /></ProtectedRouteE>} />
      <Route path='/sinistre' element={<ProtectedRouteE><Sinistre /></ProtectedRouteE>} />
      <Route path='/claims' element={<Claims />} />
      <Route path='/documents' element={<ProtectedRouteE><Documents /></ProtectedRouteE>} />
      <Route path='/document' element={<ProtectedRouteE><Document /></ProtectedRouteE>} />
      <Route path='/paiements' element={<ProtectedRouteE><Paiements /></ProtectedRouteE>} />
      <Route path='/expertises' element={<ProtectedRouteE><Expertises /></ProtectedRouteE>} />
      <Route path='/expertise' element={<ProtectedRouteE><Expertise /></ProtectedRouteE>} />
      <Route path='/experts' element={<ProtectedRoute><Experts /></ProtectedRoute>} />
      <Route path='/polices' element={<ProtectedRoute><Polices /></ProtectedRoute>} />
      <Route path='/roles' element={<ProtectedRoute><Roles /></ProtectedRoute>} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App