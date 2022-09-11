import React, {useState} from 'react';
import './CategoryForm.css';
import { useHistory } from 'react-router-dom';

import { Button, Form, Grid, Segment, Header, Divider } from 'semantic-ui-react';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'

import * as tasksAPI from '../../utils/taskAPI';

export default function CategoyForm({handleSubmitCategory}){

    const [invalidForm, setValidForm] = useState(false);
    const [error, setError ] = useState('')
    const [state, setState] = useState({
        name: '',
        description: '',
    })

    const history = useHistory();
    
    function handleChange(e){
      setState({
        ...state,
        [e.target.name]: e.target.value
      })
    }
   
    async function handleSubmit(e){
      e.preventDefault()

        try {
            const data = await tasksAPI.createCategory(state);
            handleSubmitCategory(data.category)

            setState({
                name: '',
                description: '',
            })
        } catch (err) {
          setError(err.message)
        }
    }

    return(
        <>
        <div className='dashboard-medium-divider'></div>
        <Grid centered >
            <Grid.Column style={{ maxWidth: 650 }} textAlign='center'>
                <h2 className='dashboard-txt'>Add a Category</h2>
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
                            placeholder="Description"
                            value={ state.description}
                            onChange={handleChange}
                            required
                        />

                        <Button
                            fluid size='large'
                            type="submit"
                            id='login-form-submit-btn'
                            disabled={invalidForm}
                        >
                            Add Category
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