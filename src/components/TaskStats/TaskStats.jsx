import React, {useState, useEffect} from 'react';
import './TaskStats.css'

import { Button, Form, Grid, Segment, Header, Divider } from 'semantic-ui-react';

export default function TaskStats({tasks}){

    const [currentTasks, setCurrentTasks] = useState([])
    const [completedTasks, setCompletedTasks] = useState([])
    const [abandonedTasks, setAbandonedTasks] = useState([])

    useEffect(()=>{
        console.log(tasks, 'TASKS STATS')
        sortTasks();
    }, [])


    function sortTasks(){
        let sortedCurrentTasks = [];
        let sortedCompletedTasks = [];
        let sortedAbandonedTasks = [];

        for(let i = 0; i < tasks.length; i++){
            switch(tasks[i][0].status){
                case 'completed':
                    sortedCompletedTasks.push(tasks[i]);
                    break;
                case 'abandoned':
                    sortedAbandonedTasks.push(tasks[i])
                    break;
                default:
                    sortedCurrentTasks.push(tasks[i])

            }
        }

        setCurrentTasks(sortedCurrentTasks);
        setCompletedTasks(sortedCompletedTasks);
        setAbandonedTasks(sortedAbandonedTasks);
    }
    

    return(
        <>
            {tasks.length ?
            <>
                <div className='dashboard-large-divider'></div>
                <Grid>
                    <Grid.Row columns={3} divided>
                        <Grid.Column>
                            <h3 className='dashboard-txt'>Current Tasks: <span>{currentTasks.length}</span></h3>
                        </Grid.Column>
    
                        <Grid.Column>
                            <h3 id='task-stats-completed-tasks-text' className='dashboard-txt'>Completed Tasks: <span className={completedTasks.length ? 'tasks-stats-text-green' : ''}>{completedTasks.length}</span></h3>
                        </Grid.Column>
    
                        <Grid.Column>
                            <h3 id='task-stats-abandoned-tasks-text' className='dashboard-txt'>Abandoned Tasks: <span className={abandonedTasks.length ? 'tasks-stats-text-orange' : ''}>{abandonedTasks.length}</span></h3>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </>
                :
                    <h3 className='dashboard-txt'>No tasks</h3>
                    
                }
        </>
    );
}