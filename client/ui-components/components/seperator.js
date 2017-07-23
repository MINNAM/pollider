import React from 'react';

const Seperator = ( props ) => {

    const style = {
        float : 'right',
        height: 26,
        marginTop: 0,
        marginRight : 7.5,
        marginLeft : 7.5,
        display : 'inline-block',
        borderLeft : '1px solid rgb(235,235,235)',
        borderRight : '1px solid rgb(235,235,235)',
        ...props.style
    }

    return <span
        style = { style }
    />

}

export default Seperator;
