import { BrowserRouter,Routes,Route } from 'react-router-dom'

import Dashboard from './Dashboard'
import Volunteers from './Volunteers'
import Events from './Events'
import Reports from './Reports'
import Settings from './Settings'
import WorkingHours from './WorkingHours'
import Profile from './Profile'
import Nav from '../components/Nav'
import Header from './Header'
import './Com.css'

const Com = () => {
  return(
    <div className='Com'>
        
        <div className="leftMenu">
        <Nav/>
        </div>

        <div className="rightPage">
            <Header/>

        <Routes>
        <Route index element={<Dashboard/>}></Route>
        <Route path='/dashboard' element={<Dashboard/>}></Route>
        <Route path='/volunteers' element={<Volunteers/>}></Route>
        <Route path='/events' element={<Events/>}></Route>
        <Route path='/reports' element={<Reports/>}></Route>
        <Route path='/workingHours' element={<WorkingHours/>}></Route>
        <Route path='/profile' element={<Profile/>}></Route>
        <Route path='/settings' element={<Settings/>}></Route>
      </Routes>

        </div>
        
      

      
      
    </div>
  )
}

export default Com
