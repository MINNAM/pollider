import React from 'React';

const Seperator = ( props ) => {

    const style = {
        float : 'right',
        height: 20,
        marginTop: 8,
        marginRight : 7.5,
        marginLeft : 7.5,
        display : 'inline-block',
        borderLeft : '1px solid rgb(220,220,220)',
        borderRight : '1px solid rgb(220,220,220)',
        ...props.style
    }

    return <span
        style = { style }
    />

}

export default Seperator;
