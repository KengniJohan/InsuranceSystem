import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './feature/gestion_devis/component/Header';

const Layout: React.FunctionComponent = () => {

  return (
    <div className='w-full h-screen relative'>
        <div className='w-full fixed top-0 left z-2'>
             <Header/> 
        </div>
        <div className='w-full z-0'>
            <Outlet/>
        </div>
    </div>
  )
}

export default Layout