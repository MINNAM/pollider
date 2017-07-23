import React from 'react';
import Heading from './components/heading.js';
import {SITE} from '../../../client/global.js';

class Hyperlink extends React.Component {

    constructor ( props ) {
        super( props );

        this.state = {
            mouseOver : false
        }

    }

    render () {

        const { name, hyperlink, index, current,onMouseEnter } = this.props;
        const { mouseOver } = this.state;

        return (

            <span
                style = {{
                    position : 'relative',
                    display : 'inline-block',
                    borderBottom   : '2px solid rgb(76, 211, 173)',
                }}
                onMouseEnter = { () => {

                    onMouseEnter();

                    this.setState({
                        mouseOver : true
                    })

                }}
                onMouseLeave = { () => {

                    this.setState({
                        mouseOver : false
                    })

                }}
            >
                <a
                    href = { SITE.url + hyperlink }
                    style = {{
                        textDecoration : 'none',
                        border : 'none',
                        color : current ? ( mouseOver ? 'rgb(120,120,120)' : 'rgb(60,60,60)' ) : ( mouseOver ? 'rgb(60,60,60)' : 'rgb(160,160,160)' ),
                        transition : '.1s ease all',
                        fontWeight : current ? 400 : 300
                    }}
                >
                    <span
                        style = {{
                            height : 21,

                        }}
                    >
                        { name }
                    </span>
                    <svg
                        style = {{
                            marginTop : 7,
                            width : 17,
                            height : 21,
                            marginRight : 5,
                            marginLeft : 5,
                            display : current ? 'none' : 'inline',
                            float : 'right'
                        }}
                    >
                        <line
                            x1="10"
                            y1="6"
                            x2="5.5"
                            y2="9.5"
                            strokeWidth="1"
                            stroke="rgb(160,160,160)"
                            style = {{
                                transition : '.25s ease all'
                            }}
                        />
                        <line
                            x1="5"
                            y1="9.5"
                            x2="10"
                            y2="13.5"
                            strokeWidth="1"
                            stroke="rgb(160,160,160)"
                            style = {{
                                transition : '.25s ease all'
                            }}
                        />
                    </svg>
                </a>
            </span>

        );

    }

}

const Directory = ( props ) => {

    const { model } = props;

    let hyperlinks = [];

    model ? model.map( ( element, key ) => {

        let hyperlink = '';

        for ( let i = 0; i < key; i++ ) {

            hyperlink += model[ i ].hyperlink ? `/${model[ i ].hyperlink}` : '';

        }



        hyperlink += `/${element.hyperlink}`;

        console.log( 'from dir', hyperlink);

        hyperlinks.push(

            <Hyperlink
                key       = { key }
                index     = { key }
                name      = { element.name }
                hyperlink = { hyperlink }
                current   = { key == model.length - 1 }
                onMouseEnter = { props.onMouseEnter }
            />

        );

    }) : '';

    return (
        <Heading
            textColor = { 'rgb(100,100,100)' }
            content   = { hyperlinks  }
            fontSize  = { 14 }
        />
    )

}

export default Directory;
