import React from 'react';
import Heading from './components/heading.js';
import {formatDate} from '../../../client/global.js';

const PostHeader = (props) => {
    const {
        model,
        children,
        display
    } = props;

    console.log(model);
    const date = model.public_date ? new Date(model.public_date): new Date(model.public_date);

    return (

        <div
            id = 'post-header'
            style = {{
                paddingBottom: display ? 5 : 0
            }}
        >
            { children }
            <div
                style = {{
                    display: display ? 'inline' : 'none'
                }}
            >

                <Heading
                    textColor = { 'rgb(120,120,120)' }
                    fontSize = { 18 }
                    content = {
                        model.data ?
                            (
                                model.data[ 'Subtitle' ] ?
                                    <span>
                                        <i
                                            className="fa fa-lock"
                                            style = {{
                                                color:'rgb(100,100,100)',
                                                marginRight: 10,
                                                fontSize: 14,
                                                display: model.status != 'public' ? 'inline': 'none'
                                            }}
                                        />
                                        { model.data[ 'Subtitle' ].content }
                                    </span>
                                    : ''
                            )   :
                            <i
                                className="fa fa-lock"
                                style = {{
                                    color:'rgb(120,120,120)',
                                    marginRight: 10,
                                    fontSize: 14,
                                    display: model.status != 'public' ? 'inline': 'none'
                                }}
                            />
                        }
                />

                <h1
                    style = {{
                        color: 'rgb(40,40,40)',
                        fontFamily: 'hind',
                        fontSize: 45,
                        letterSpacing: 1.2,
                        marginBottom: 12,
                        marginTop: 14,
                    }}
                >
                    {model ? model.name : ''}
                </h1>
                <Heading
                    fontSize = {13}
                    textColor = {'rgb(60,60,60)'}
                    bold = {true}
                    content = {
                        <span>
                            {'by '}
                            <span
                                style = {{
                                    fontWeight: 'bold'
                                }}
                            >
                                {`${model.first_name} ${model.last_name}`}
                            </span>
                            <span
                                style = {{
                                    marginRight: 3
                                }}
                            >
                                {`, ${formatDate(date,false)}` }
                            </span>
                        </span>
                    }
                />
            </div>
        </div>

   );

};

export default PostHeader;
