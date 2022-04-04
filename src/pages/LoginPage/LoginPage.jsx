import React, { useState } from 'react';
import './LoginPage.css';
import { useHistory, Link } from 'react-router-dom';

import { Button, Form, Grid, Segment, Header } from 'semantic-ui-react';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import userService from '../../utils/userService';


export default function LoginPage(props){
    
    const [invalidForm, setValidForm] = useState(false);
    const [error, setError ] = useState('')
    const [state, setState] = useState({
        email: '',
        password: '',
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
          await userService.login(state);
          // Route to wherever you want!
          props.handleSignUpOrLogin()

          //Redirect to Dashboard!
          history.push('/dashboard');
          
        } catch (err) {
          // Invalid user data (probably duplicate email)
          setError(err.message)
        }
    }

    return (
             <Grid centered style={{ height: '100vh'}} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }} textAlign='center'>
                    <Header as='h2'>Personal Task Manager</Header>
                        <Form id='login-form'  autoComplete="off"  onSubmit={handleSubmit}>
                            <Segment stacked>

                                <Form.Input
                                    type="email"
                                    name="email"
                                    placeholder="email"
                                    value={ state.email}
                                    onChange={handleChange}
                                    required
                                />

                                <Form.Input
                                    name="password"
                                    type="password"
                                    placeholder="password"
                                    value={ state.password}
                                    onChange={handleChange}
                                    required
                                />

                                <Button
                                color='blue'
                                fluid size='large'
                                type="submit"
                                id='login-form-submit-btn'
                                disabled={invalidForm}
                                >
                                Sign In
                                </Button>
                            </Segment>
                        </Form>
                        <br />
                        {error ? <ErrorMessage error={error} /> : null}

                    </Grid.Column>
             </Grid>
    
      
      );
}

