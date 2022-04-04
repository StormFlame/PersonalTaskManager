import React from 'react';
import './DashboardHeader.css';

export default function DashboardHeader({handleSetMainTab}){
    return(
        <div id='dashboard-header-container'>
            <button onClick={()=>handleSetMainTab(0)} className='dashboard-header-side-text dashboard-btn unselectable'>Dashboard</button>
            <button onClick={()=>handleSetMainTab(1)} id='dashboard-header-main-text' className='dashboard-btn unselectable'>Task</button>
            <button onClick={()=>handleSetMainTab(2)} className='dashboard-header-side-text dashboard-btn unselectable'>Finished</button>
        </div>
    );
}