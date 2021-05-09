import React from 'react';

const Box = (props) => {
    return (
        <button disabled={props.value != null}
        className="square"
        onClick={()=> {props.onClick()}}
        >
        {props.value}
      </button>
    )
}

export default Box;