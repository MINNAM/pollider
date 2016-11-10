import React from 'react';

const Link = ( props ) => {

    const { url } = props.contentState.getEntity( props.entityKey ).getData();
    return (

        <a href ={ url } style = { styles.link }>
            { props.children }
        </a>

    );

};

Link.propTypes = {

    contentState : React.PropTypes.object.isRequired

};

export default Link;
