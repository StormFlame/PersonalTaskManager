import React, {useEffect, useState} from 'react';
import './Dashboard.css'

import { Button, Form, Grid, Segment, Header, Divider } from 'semantic-ui-react';
import DashboardHeader from '../../components/DashboardHeader/DashboardHeader'
import TaskStats from '../../components/TaskStats/TaskStats';
import TaskForm from '../../components/TaskForm/TaskForm';
import CategoryForm from '../../components/CategoryForm/CategoryForm';
import TaskViewer from '../../components/TaskViewer/TaskViewer';
import TasksAnalytics from '../../components/TasksAnalytics/TasksAnalytics';

import * as tasksAPI from '../../utils/taskAPI'; 

export default function Dashboard({user}){

    const [taskTab, setTaskTab] = useState(true);
    const [mainTab, setMainTab] = useState(0); 

    const [tasksTree, setTasksTree] = useState([])
    const [unsortedTasks, setUnsortedTasks] = useState([]);
    const [categories, setCategories] = useState([])
    const [punchCards, setPunchCards] = useState([])

    useEffect(()=>{
        getTasks();
        getCategories();
        getPunchCards();
    }, [])

    async function getTasks(){
        try{
            const tasksArr = await handleGetTasksByUser(user._id);
            setTasksTree([...tasksArr])
        }catch(err){console.log(err, 'ERROR GET TASKS')}
    }

    async function getCategories(){
        try{
            const data = await tasksAPI.indexCategory();
            setCategories([...data.categories]);
        }catch(err){console.log(err, 'ERROR')}
    }

    async function getPunchCards(){
        const data = await tasksAPI.indexPunchCardsByUser(user._id)
        setPunchCards([...data.punchCards])
    }

    function handleSetTab(state){
        setTaskTab(state);
    }

    function handleSetMainTab(state){
        setMainTab(state);
    }

    function handleSubmitCategory(category){
        setCategories([...categories, category])
    }

    function handleSubmitTask(task){
        setTasksTree([...tasksTree, [task, []]])
        setUnsortedTasks([...unsortedTasks, task])
    }

    function handlePunchIn(punchCard){
        setPunchCards([...punchCards, punchCard])
    }

    function handlePunchOut(punchCard){
        let newPunchCards = punchCards;

        for(let i = 0; i < newPunchCards.length; i++){
            if(punchCard._id === newPunchCards[i]._id){
                newPunchCards.splice(i, 1, punchCard)
                setPunchCards([...newPunchCards]);
                return;
            }
        }
    }

    async function handleUpdateTasks(newUnsortedTasks){
        setUnsortedTasks([...newUnsortedTasks]);
        const tasksArr = await assembleTasksTree(user._id, newUnsortedTasks)
        setTasksTree([...tasksArr])
    }

    async function handleGetTasksByUser(userID){
        try{
            const data = await tasksAPI.indexByUser(userID);
            setUnsortedTasks(data.tasks);
            const tasksTree = await assembleTasksTree(userID, data.tasks)
            return tasksTree
        }catch(err){console.log(err, 'ERROR')}
    }

    async function assembleTasksTree(parentID, tasks){
        try{    

            const tasksArr = await getTasksByParentID(parentID, tasks)

            if(tasksArr.length == 0){
                return undefined;
            }
    
            const returnArr = [];
    
            for(let i = 0; i < tasksArr.length; i++){
                const nextLvl = await assembleTasksTree(tasksArr[i]._id, tasks)
    
                if(nextLvl){
                    returnArr.push([tasksArr[i], nextLvl]);
                }else
                {
                    returnArr.push(tasksArr[i].level === 0 ? [tasksArr[i]] : tasksArr[i])
                }
            }
    
            return returnArr;
    
        }catch(err){
            console.log(err, 'ERROR FROM ASSEMBLE')
        }
    }

    function getTasksByParentID(parentID, tasks){
        const returnTasks = [];

        for(let i = 0; i < tasks.length; i++){
            if(tasks[i].parent === parentID){
                returnTasks.push(tasks[i])
            }
        }

        return returnTasks;
    }

    return(
        <>
            <DashboardHeader handleSetMainTab={handleSetMainTab}/>


            {mainTab == 0 && 
            <>
                {tasksTree.length > 0 && <TaskStats key={tasksTree} tasks={tasksTree}/>}

                <Divider />

                <div id='dashboard-tab-selection-container'>
                    <button onClick={()=>handleSetTab(true)} className='dashboard-tab-selection-btn dashboard-btn'>Tasks</button>
                    <button onClick={()=>handleSetTab(false)} className='dashboard-tab-selection-btn dashboard-btn'>Categories</button>
                </div>

                {taskTab ?
                    categories.length > 0 ?
                        <TaskForm user={user} categories={categories} handleSubmitTask={handleSubmitTask}/> 
                    :
                        <h2 className='dashboard-txt'>Please add at least one category before creating a task</h2>
                : 
                    <CategoryForm handleSubmitCategory={handleSubmitCategory} />
                }

            </>
            }

            {mainTab == 1 && 
                <TaskViewer tasks={tasksTree} unsorted={unsortedTasks} assembleTasksTree={assembleTasksTree} user={user} handleUpdateTasks={handleUpdateTasks} punchCards={punchCards} handlePunchInDB={handlePunchIn} handlePunchOutDB={handlePunchOut}/>
            }

            {mainTab == 2 && 
                <TasksAnalytics tasks={unsortedTasks} user={user} categories={categories} punchCards={punchCards} />
            }

            
        </>    
    );
}