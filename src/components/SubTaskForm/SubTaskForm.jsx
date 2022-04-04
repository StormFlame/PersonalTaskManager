import React, {useState, useEffect} from 'react';
import './SubTaskForm.css';
import { useHistory } from 'react-router-dom';

import { Button, Form, Grid, Segment, Header, Divider } from 'semantic-ui-react';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'

import * as tasksAPI from '../../utils/taskAPI';

export default function SubTaskForm({task, handleSubmitSubTask}){

    const [invalidForm, setValidForm] = useState(false);
    const [error, setError ] = useState('')
    const [state, setState] = useState({
        name: '',
        description: '',
        predictedHours: 1,
        due: new Date().toISOString().split('T')[0],
    })

    const history = useHistory();
    
    function handleChange(e){

            if(e.target.name == 'hours'){
                if(e.target.value < 0){
                    return;
                }
            }
            
            setState({
                ...state,
                [e.target.name]: e.target.value
            })
    }
   
    async function handleSubmit(e){
      e.preventDefault()

        try {
            console.log(task, 'SUBMIT SUBTASK FORM TASK')
            const formData = {...state,
                              subtask: true,
                              parent: task._id,
                              user: task.user,
                              status: 'current',
                              level: task.level+1,
                              category: task.category,
    }
      
            const data = await tasksAPI.createTask(formData);
            handleSubmitSubTask(data.task, task.level === 0 ? true : false);

            setState({
                name: '',
                description: '',
                category: '',
                predictedHours: 1,
                due: new Date().toISOString().split('T')[0],
            })
        } catch (err) {
          // Invalid user data (probably duplicate email)
          setError(err.message)
        }
    }

    return(
        <>
        <div className='dashboard-medium-divider'></div>
        <Grid centered>
            <Grid.Column style={{ maxWidth: 650 }} textAlign='center'>
                <h2 className='dashboard-txt'>Add a Sub Task</h2>
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

                        <Form.Input
                            type="number"
                            name="hours"
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
                            Add Sub Task
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