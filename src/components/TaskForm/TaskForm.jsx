import React, {useState, useEffect} from 'react';
import './TaskForm.css';
import { useHistory } from 'react-router-dom';

import { Button, Form, Grid, Segment, Header, Divider } from 'semantic-ui-react';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'

import * as tasksAPI from '../../utils/taskAPI';

export default function TaskForm({categories, user, handleSubmitTask}){

    const [invalidForm, setValidForm] = useState(false);
    const [error, setError ] = useState('')
    const [options, setOptions] = useState([]);
    const [state, setState] = useState({
        name: '',
        description: '',
        category: '',
        predictedHours: 1,
        due: new Date().toISOString().split('T')[0],
    })

    const history = useHistory();

    useEffect(()=>{
        formatOptions();
    },[])

    function formatOptions(){
        let optionsarr = [];

        for(let i = 0; i < categories.length; i++){
            const option = {key: categories[i].name+i, value: categories[i].name, text: categories[i].name}
    
            optionsarr.push(option);
        }

        setOptions(optionsarr); 
    }
    
    function handleChange(e){

        if(e.target){ 
            if(e.target.name == 'hours'){
                if(e.target.value < 0){
                    return;
                }
            }
            
            setState({
                ...state,
                [e.target.name]: e.target.value
            })
            
            return
        }
        
        setState({
            ...state,
            category: e
        })
    }
   
    async function handleSubmit(e){
      e.preventDefault()

        try {

            if(!state.category) throw({message:'You must select a category'})

            const formData = {...state,
                              subtask: false,
                              parent: user._id,
                              user: user._id,
                              status: 'current',
                              level: 0}
      
            const data = await tasksAPI.createTask(formData);
            handleSubmitTask(data.task);

            setState({
                name: '',
                description: '',
                category: '',
                predictedHours: 1,
                due: new Date().toISOString().split('T')[0],
            })

            setError('')
        } catch (err) {
          // Invalid user data (probably duplicate email)
          setError(err.message)
        }
    }

    return(
        <>
        <div className='dashboard-medium-divider'></div>
        <Grid centered style={{ height: '100vh'}}>
            <Grid.Column style={{ maxWidth: 650 }} textAlign='center'>
                <h2 className='dashboard-txt'>Create a Task</h2>
                <Form className='dashboard-form'  autoComplete="off"  onSubmit={handleSubmit}>
                    <Segment className='dashboard-form-segment' stacked>

                        <Form.Input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={state.name}
                            onChange={handleChange}
                            required
                        />

                        <Form.Input
                            name="description"
                            type="text"
                            placeholder="Description (Optional)"
                            value={ state.description}
                            onChange={handleChange}
                        />

                        <Form.Select                    
                            name="category"
                            placeholder="Select a Category"
                            value={state.category}
                            onChange={(e, { value }) => handleChange(value)}
                            options = {options}
                            required
                        />

                        <Form.Input
                            type="number"
                            name="predictedHours"
                            placeholder="Hours"
                            value={state.predictedHours}
                            onChange={handleChange}
                            required
                        />

                        <Form.Input
                            type="date"
                            name="due"
                            placeholder="Due Date"
                            value={state.due}
                            onChange={handleChange}
                            required
                        />

                        <Button
                            fluid size='large'
                            type="submit"
                            id='login-form-submit-btn'
                            disabled={invalidForm}
                        >
                            Add Task
                        </Button>
                    </Segment>
                </Form>

                <br />
                {error ? <ErrorMessage error={error} /> : null}

            </Grid.Column>
        </Grid>
        </>
    );
}