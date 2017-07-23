import React from 'react';

import Heading from './components/heading.js';

const PostHeader = ( props ) => {

    const { model, children, display } = props;

    const date = model.modified_date ? new Date( model.modified_date ) : new Date( model.created_date );

    return (

        <div
            id = 'post-header'
            style = {{
                paddingBottom : display ? 5 : 0
            }}
        >
            { children }
            <div
                style = {{
                    display : display ? 'inline' : 'none'
                }}
            >

                <Heading
                    textColor = { 'rgb(120,120,120)' }
                    fontSize = { 18 }
                    content = {
                        model.data ?
                            (
                                model.data[ 'Description' ] ?
                                    <span>
                                        <i
                                            className="fa fa-lock"
                                            style = {{
                                                color:'rgb(100,100,100)',
                                                marginRight : 10,
                                                fontSize : 14,
                                                display : model.status != 'public' ? 'inline' : 'none'
                                            }}
                                        />
                                        { model.data[ 'Description' ].content }
                                    </span>
                                : ''
                            )
                        :
                            <i className="fa fa-lock" style = {{color:'rgb(120,120,120)', marginRight : 10, fontSize : 14, display : model.status != 'public' ? 'inline' : 'none' }}/>
                        }
                />

                <h1 style = {{
                    fontFamily : 'hind',
                    letterSpacing : 1.2,
                    fontSize : 45,
                    color : 'rgb(40,40,40)',
                    marginTop : 14,
                    marginBottom: 12
                }}>{ model ? model.name : '' }</h1>
                <Heading
                    fontSize = { 13 }
                    textColor = { 'rgb(60,60,60)' }
                    bold      = { true }
                    content = {
                        <span>
                            {'by '}
                            <span style = {{ fontWeight : 'bold' }}>{ `${model.first_name} ${model.last_name}` }</span>
                            <span style = {{ marginRight : 3 }}>{`, Jan 28 2012 ${date.getHours() >= 12 ? 'PM' : 'AM' }` }</span>
                        </span>
                    }
                />
            </div>
        </div>

    );


}

export default PostHeader;
