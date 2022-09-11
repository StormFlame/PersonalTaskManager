import React, {useEffect, useLayoutEffect, useState} from 'react';
import './TasksAnalytics.css';

import { Button, Form, Grid, Segment, Header, Divider, GridColumn } from 'semantic-ui-react';

import * as tasksAPI from '../../utils/taskAPI'; 

export default function TaskAnalytics({tasks, user, categories, punchCards}){

    const [completedTasks, setCompletedTasks] = useState([])
    const [abandonedTasks, setAbandonedTasks] = useState([])

    const [sortedTasks, setSortedTasks] = useState([]);

    const [totalHours, setTotalHours] = useState(0);

    useEffect(()=>{
        sortTasks();
    }, [])

    useLayoutEffect(()=>{
        handleGetTotalHours();
    }, [])


    function sortTasks(){
        let sortedCompletedTasks = [];
        let sortedAbandonedTasks = [];

        for(let i = 0; i < tasks.length; i++){
            switch(tasks[i].status){
                case 'completed':
                    sortedCompletedTasks.push(tasks[i]);
                    break;
                case 'abandoned':
                    sortedAbandonedTasks.push(tasks[i])
                    break;
            }
        }

        setCompletedTasks(sortedCompletedTasks);
        setAbandonedTasks(sortedAbandonedTasks);
    }

    function handleGetTotalHours(){
        let total = 0;
        for(let i = 0; i < punchCards.length; i++){
            const add = (Math.abs(Number(punchCards[i].punchIn) - Number(punchCards[i].punchOut)) / 36e5);
            total += add;
        }

        const rounded = (Math.round((total+Number.EPSILON)*100)/100)
        setTotalHours(rounded);
    };

    function handleSortTasksByLevel(){
        let sorted = [];

        for(let i = 0; i < completedTasks.length; i++){
            const level = completedTasks[i].level;
            sorted[level] = sorted[level] ? [...sorted[level], completedTasks[i]] :[completedTasks[i]];
        }

        setSortedTasks(sorted);
    }

    function handleSortTasksByCategory(){
        let sorted = [];
        let cats = [];

        for(let j = 0; j < categories.length; j++){
            cats.push(categories[j].name)
        }

        for(let i = 0; i < completedTasks.length; i++){
            const categoryIndex = cats.indexOf(completedTasks[i].category);
            sorted[categoryIndex] = sorted[categoryIndex] ? [...sorted[categoryIndex], completedTasks[i]] :[completedTasks[i]];
        }

        setSortedTasks(sorted);
    }

    return(
        <>
            <h1 className='dashboard-txt'>Complete Tasks: {completedTasks.length}</h1>

            {totalHours >= 1 ?
                <p className='dashboard-txt'>Hours: {totalHours}</p>
            :
                <p className='dashboard-txt'>Minutes: {Math.round(totalHours*60)}</p>
            }

            <button onClick={handleSortTasksByLevel}>Sort by level</button>
            <button onClick={handleSortTasksByCategory}>Sort by category</button>

            <Divider hidden/>

            {sortedTasks && 
                sortedTasks.map((tasksArr, index) =>{
                    let sectionHours = 0;
                    return(
                        <>
                        {
                            tasksArr.map((task, index)=>{
                                sectionHours+=task.hours;
                                return(
                                    <p className='dashboard-txt'>{task.name}</p>
                                )
                            })
                        }
                        <p className='dashboard-txt'>Section {sectionHours < 1 ? 'minutes: ' + Math.round(sectionHours*60) : 'hours: ' + sectionHours}</p>
                        <Divider />
                        </>
                    )
                })}
        </>
    );
}