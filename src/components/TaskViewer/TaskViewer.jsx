import React, {useEffect, useLayoutEffect, useState} from 'react';
import './TaskViewer.css';

import { Button, Form, Grid, Segment, Header, Divider, Icon } from 'semantic-ui-react';
import SubTaskForm from '../SubTaskForm/SubTaskForm';

import * as tasksAPI from '../../utils/taskAPI'; 

export default function TaskViewer({tasks, unsorted, assembleTasksTree, user, handleUpdateTasks, punchCards, handlePunchInDB, handlePunchOutDB}){

    const [height, setHeight] = useState(0);

    const [tasksTree, setTasksTree] = useState([]);
    const [unsortedTasks, setUnsortedTasks] = useState([]);

    const [selectedTask, setSelectedTask] = useState(undefined);
    const [subTasksComplete, setSubTasksComplete] = useState(false);
    const [subTasks, setSubTasks] = useState([]);
    const [selectedSubTask, setSelectedSubTask] = useState(undefined);

    const [prevSelected, setPrevSelected] = useState(undefined)

    const [subTaskHistory, setSubTaskHistory] = useState([]);
    const[punchMessage, setPunchMessage] = useState(undefined);


    useLayoutEffect(()=>{
        handleCalcHeight();
    },[])

    useEffect(()=>{
        setUnsortedTasks([...unsorted]);
        handleSetTaskTree(tasks)
        handleCheckPunchedIn();
    }, [])

    function handleCalcHeight(){
        const elHeight = document.getElementById('dashboard-header-container').getBoundingClientRect().height;
        const windHieght = window.innerHeight;

        setHeight(windHieght-elHeight);
    }

    function handleCheckPunchedIn(){

        let punchedIn = [];

        for(let i=0; i < punchCards.length; i++){
            if(punchCards[i].punchOut === 'none'){
                punchedIn.push(punchCards[i])
            }
        }

        if(punchedIn.length > 0){
            let cardTask;
            for(let j = 0; j < unsorted.length; j++){
                for(let l = 0; l < punchedIn.length; l++){
                    if(punchedIn[l].task == unsorted[j]._id){
                        cardTask = unsorted[j];

                        cardTask.clockedIn = true;

                        const topParent = findTopParent(cardTask, true);
                        topParent.childClockedIn = true;
                    }
                }
            }
        }
    }

    function handleResetPunchedIn(){
        unsorted.forEach(task =>{
            task.clockedIn = false;
            task.childClockedIn = false;
        })

        handleCheckPunchedIn();
    }

    function findTopParent(task, first = false){
        
        let newTask;

        if(task.level > 0){

            if(!first) task.childClockedIn = true;

            for(let i = 0; i < unsorted.length; i++){
                if(task.parent == unsorted[i]._id){
                    newTask = findTopParent(unsorted[i])
                }
            }
        }else{
            return task
        }

        return newTask
    }

    function handleSetTaskTree(tasks){
        if(!tasks) return;
        setTasksTree([...tasks]);
    }

    function handleCheckSubTasksAllCompleted(tasks){

        let isSubTasksComplete = true;

        if(tasks.length < 1) {
            setSubTasksComplete(true);
            return;
        }

        const tasksToCheck = selectedSubTask ? tasks[0] : tasks

        if(tasksToCheck.length){
            for(let i = 0; i<tasksToCheck.length; i++){

                if(tasksToCheck[i].status === undefined){
                    if(tasksToCheck[i][0].status === 'current'){
                        isSubTasksComplete = false;
                        break;
                    }

                }else{
                    if(tasksToCheck[i].status === 'current'){
                        isSubTasksComplete = false;
                        break;
                    }
                }
            }
        }else{
            if(tasksToCheck.status === 'current'){
                isSubTasksComplete = false
            }
        }

        if(isSubTasksComplete){
            setSubTasksComplete(true);
        }else{
            setSubTasksComplete(false);
        }
    }

    function handleSetSelectedTask(task, e){


        if(task === selectedTask) return;

        //give the button a highlight when selected
        e.target.classList.add('task-viewer-task-selected')

        if(prevSelected != undefined){
            prevSelected.classList.remove('task-viewer-task-selected')
        }

        setPrevSelected(e.target);

        //set the currently selected task
        setSelectedTask(task);
        setSelectedSubTask(undefined);
        setSubTasks(task[1] ? task[1] : []);

        //check for set all tasks completed
        handleCheckSubTasksAllCompleted(task[1] ? task[1] : []);
    }

    function handleSelectSubTask(task, history = true){
        if(history) {
            setSubTaskHistory([task, ...subTaskHistory]);
        }

        if(task[0])
        {
            setSelectedSubTask(task[0])
            setSubTasks(task[1])
            handleCheckSubTasksAllCompleted(task[1]);

        }else{
            setSelectedSubTask(task);
            setSubTasks([])
            setSubTasksComplete(true);
        }
    }

    async function handleSubmitSubTask(subTask, isLvlOne = false){
    
        //submit subtask to dashboard
        // submitSubTask(subTask);
        
        const newUnsortedTasks = [...unsortedTasks, subTask]
        setUnsortedTasks([...newUnsortedTasks]);
        const assembledTaskTree = await assembleTasksTree(user._id, newUnsortedTasks);

        const selectedIndex = tasksTree.indexOf(selectedTask);

        //set state in dashboard
        handleUpdateTasks(newUnsortedTasks);

        handleSetTaskTree(assembledTaskTree);
        setSelectedTask(assembledTaskTree[selectedIndex])
        
        if(isLvlOne){
            setSubTasks(assembledTaskTree[selectedIndex][1])

        }else{
            //edit history
            const newTask = [selectedSubTask, subTaskHistory[0][1] ? [...subTaskHistory[0][1], subTask] : [subTask]]

            const newHistory = subTaskHistory;
            const index = subTaskHistory.indexOf(selectedSubTask);
            newHistory.splice(index, 1, newTask)

            setSubTaskHistory(newHistory);
            setSubTasks([...newTask[1]])
        }
    }

    async function handleRemoveSubTask(){

        console.log(subTaskHistory[0], 'HISTORY')

        //Remove subtask from unsorted list and set unsorted list in state
        const newUnsortedTasks = [...unsortedTasks];
        newUnsortedTasks.splice(newUnsortedTasks.indexOf(selectedSubTask), 1);
        setUnsortedTasks([...newUnsortedTasks]);

        //assmble the task tree from new unsorted list
        const assembledTaskTree = await assembleTasksTree(user._id, newUnsortedTasks);

        //get the selected task index so that the task can be seleceted again after the state reset
        const selectedIndex = tasksTree.indexOf(selectedTask);

        //set state in dashboard
        handleUpdateTasks(newUnsortedTasks);

        handleSetTaskTree(assembledTaskTree);
        //use the saved selected task index to set selected task
        setSelectedTask(assembledTaskTree[selectedIndex]);

        //---------------------------------------------------------YOU NEED TO REMOVE ALL LOWER LEVEL TASKS BEFORE REMOVING CURRENT TASK

        //set selected sub task to the parent sub task from history

        // let newSelectedSubTask = subTaskHistory[0];

        // if(subTaskHistory[1]){
        //     newSelectedSubTask = subTaskHistory[1][0] ? subTaskHistory[1][0] : subTaskHistory[1];
        // }

        // setSelectedSubTask(newSelectedSubTask);

    }

    async function handleEditTaskStatus(status){

        // create a copy of unsorted tasks for editing
        const newUnsortedTasks = [...unsortedTasks];
        let updatedTask = {id: '',
                           status: status}

        //check if task is a subtask
        if(selectedSubTask){
            //create a copy of the selected task for editing
            const newTask = selectedSubTask;
            //set status to new status
            newTask.status = status;
            
            //replace task with new task
            newUnsortedTasks.splice(newUnsortedTasks.indexOf(selectedSubTask), 1, newTask);
            handleUpdateTasks(newUnsortedTasks);

            //Set udpatedTask ID for AJAX call
            updatedTask.id = newTask._id;

            // handleNavBackSubTask();
        }else{

            //Edit the level 0 task and send to dashboard before removing
            const index = newUnsortedTasks.indexOf(selectedTask[0]);
            newUnsortedTasks[index].status = status;
            handleUpdateTasks(newUnsortedTasks);

            //Task is level 0. Remove it from the taskTree
            newUnsortedTasks.splice(index, 1);

            //Set udpatedTask ID for AJAX call
            updatedTask.id = selectedTask[0]._id;
        }

        //reset the taskstree using the new unsorted tasks list
        const assembledTaskTree = await assembleTasksTree(user._id, newUnsortedTasks);

        const selectedIndex = tasksTree.indexOf(selectedTask);

        handleSetTaskTree(assembledTaskTree);
        setSelectedTask(selectedSubTask ? assembledTaskTree[selectedIndex] : undefined)

        // Call taskAPI
        await tasksAPI.updateTask({id: updatedTask.id, 
                                   task: {status: updatedTask.status}
                                   });
    }

    function handleNavBackSubTask(){
        if(subTaskHistory.length > 0){

            const subTaskLevel = subTaskHistory[0][0] ? subTaskHistory[0][0].level : subTaskHistory[0].level
            if(subTaskLevel == 1){
                setSelectedSubTask(undefined);
                setSubTasks(selectedTask[1]);
                handleCheckSubTasksAllCompleted(selectedTask[1])
            }else{
                handleSelectSubTask(subTaskHistory[1], false)
            }

            const spliced = subTaskHistory;
            spliced.splice(0,1)
            setSubTaskHistory(spliced)
        }
    }

    async function handlePunchIn(){

        try{

            const task = selectedSubTask ? selectedSubTask : selectedTask[0]
            const checkData = await tasksAPI.indexPunchCardsByTask(task._id);
            
            for(let i = 0; i < checkData.punchCards.length; i++){
                if(checkData.punchCards[i].punchOut === 'none'){
                    throw('you must clock out before clocking in again')
                }
            }

            const punchCardData = {user: user._id, task: task._id, punchIn: Date.now(), punchOut: 'none'}
            const data = await tasksAPI.createPunchCard(punchCardData);

            //find top parent
            task.clockedIn = true;
            const topParent = findTopParent(task, true);
            topParent.childClockedIn = true;

            setPunchMessage(data.message);
            handlePunchInDB(data.punchCard);
        }catch(err){
            console.log(err, 'ERROR');
            setPunchMessage(err);
        }
    }

    async function handlePunchOut(){
        try{
            const task = selectedSubTask ? selectedSubTask : selectedTask[0];

            const punchOut = Date.now();
            const punchCardData = {taskID: task._id, punchCard: {punchOut}}

            const data = await tasksAPI.updatePunchCard(punchCardData);
            const newPunchCard = data.punchCard;
            newPunchCard.punchOut = punchOut;
            const hours = (Math.abs(newPunchCard.punchIn - punchOut) / 36e5);
            await tasksAPI.updateTask({id: task._id, task: {hours: task.hours + hours}})

            handlePunchOutDB(newPunchCard);
            handleResetPunchedIn();

            const newUnsortedTasks = [...unsortedTasks];
            const newTask = task;
            newTask.hours = task.hours + hours;
            
            //replace task with new task
            newUnsortedTasks.splice(newUnsortedTasks.indexOf(task), 1, newTask);
            handleUpdateTasks(newUnsortedTasks);

            //reset the taskstree using the new unsorted tasks list
            const assembledTaskTree = await assembleTasksTree(user._id, newUnsortedTasks);

            const selectedIndex = tasksTree.indexOf(selectedTask);

            handleSetTaskTree(assembledTaskTree);
            setSelectedTask(assembledTaskTree[selectedIndex])

            const message = hours < 1 ? (hours*60).toFixed(2) + "m" : hours.toFixed(2) + 'h'
            setPunchMessage('Clocked:' + message)

        }catch(err){
            console.log(err, 'ERROR')
            setPunchMessage(err)
        }
    }

    return(
        <div id='task-viewer-container-main' style={{height: height}}>
            <div id='task-viewer-container-left'>
                {tasksTree.map((task, index) => {
                    return(
                    <>
                        {task[0].status === 'current' &&
                            task[0].level === 0 && 
                            <button key={task[0]}
                                onClick={(e)=>handleSetSelectedTask(task, e)}
                                className='task-viewer-task dashboard-btn'>
                                    {task[0].childClockedIn && <Icon name='dot circle outline' color='blue' />}
                                    {task[0].clockedIn && <Icon name='dot circle' color='blue' /> }
                                    {task[0].name}
                            </button>
                        }
                    </>
                    )
                })}
            </div>

            <div id='task-viewer-container-middle'>
                {selectedTask ?
                <>
                    <div id='task-viewer-middle-top-container'>
                        <h1 className='dashboard-txt'>{selectedTask[0].name}</h1>
                        <h2 className='dashboard-txt'>{selectedTask[0].category}</h2>
                        <h3 className='dashboard-txt'>{String(selectedTask[0].createdAt).slice(0,10)}</h3>
                        <h5 className='dashboard-txt'>Due: {String(selectedTask[0].due).slice(0,10)}</h5>
                    </div>

                    <div id='task-viewer-middle-center-container'>
                        <div id='task-viewer-middle-center-top-container'>
                            {selectedSubTask ? 
                            <>
                                <h3 className='dashboard-txt'>
                                    {selectedSubTask.clockedIn && <Icon name='dot circle' color='blue' /> }
                                    {selectedSubTask ? selectedSubTask.name : 'sub task header'}
                                </h3>
                                <h4 className='dashboard-txt'>{selectedSubTask ? selectedSubTask.description : 'sub task header'}</h4>
                                <h5 className='dashboard-txt'>{selectedSubTask ? selectedSubTask.category : 'sub task header'}</h5>
                                <h6 className='dashboard-txt'>{selectedSubTask ? selectedSubTask.status : 'sub task status'}</h6>
                                <button id='task-viewer-subtask-bck-btn' onClick={handleNavBackSubTask}>Back</button>
                            </>
                            :
                            <>
                                <h4 className='dashboard-txt'>No Selected Sub Task</h4>
                            </>
                            }
                        </div>



                        {subTasks.length > 0 &&
                        <>
                            <div id='task-viewer-middle-center-center-container'>
                                <h4 className='dashboard-txt'>Task to complete</h4>

                                {subTasks.map((subtask, index)=>{
                                    const subTask = subtask[0] ? subtask[0]: subtask
                                    return(
                                        <button key={subtask+index}
                                            onClick={()=>handleSelectSubTask(subtask)}
                                            className='dashboard-btn task-viewer-task'>
                                            {subTask.childClockedIn && <Icon name='dot circle outline' color='blue' />}
                                            {subTask.clockedIn && <Icon name='dot circle' color='blue' /> }
                                            {subTask.name}: {subTask.status}
                                        </button>
                                     )
                                })}
                            </div>
                        </>
                        }

                        <div key={subTasksComplete} id='task-viewer-middle-center-bottom-container'>
                                {subTasksComplete === true && <button onClick={()=>handleEditTaskStatus('completed')}>Complete Task</button>}
                        </div>

                    </div>
                </>
                :
                    <h1 className='dashboard-txt'>No Selected Task</h1> }
            </div>

            {selectedTask &&
                <div id='task-viewer-container-right'>
                    <SubTaskForm task={selectedSubTask ? selectedSubTask : selectedTask[0]} handleSubmitSubTask={handleSubmitSubTask}/>

                    <Divider />

                    <button onClick={handlePunchIn}>Punch In</button>

                    <button onClick={handlePunchOut}>Punch Out</button>

                    <Divider hidden/>

                    {punchMessage && 
                        <p className='dashboard-txt'>{punchMessage}</p>
                    }

                    <Divider />

                    {selectedSubTask ? 
                    <button onClick={handleRemoveSubTask}>Remove SubTask</button>
                    :
                    <button onClick={handleRemoveSubTask}>Remove Task</button>
                    }

                </div>
            }
        </div>
    );
}