import React from 'react';

export default function ErrorMessage(props){
    return <span className={"error"} style={{color: 'red'}}>{props.error}</span>
}