import React from 'react';
import CloseButton from './components/ui/buttons/close-button.js';
import Input from './components/input.js';

const LANGUAGES = [
    'Android',
    'C++',
    'Javascript',
    'MYSQL',
    'MongoDB',
    'Node.js',
    'PHP',
    'SuperCollider',
]

const APPLICATIONS = [

    'Illustrator',
    'Photoshop',
    'Protools',

]



class Profile extends React.Component {


    constructor ( props ) {

        super( props );

        this.state = {};

    }

    render () {
        const { display, toggle } = this.props;

        return (

            <div
                style = {{
                    background : 'rgba(0,0,0,0.2)',
                    display    : display ? 'inline-block' : 'none',
                    height     : '100%',
                    left       : 0,
                    position   : 'fixed',
                    top        : 0,
                    width      : '100%',
                    zIndex     : 30,
                }}

                onClick = {(  event )=>{
                    toggle();
                }}
            >
                <div
                    style = {{
                        boxShadow     : '1px 1px 1px 1px rgba(0,0,0,0.1)',
                        left          : '50%',
                        position      : 'absolute',
                        top           : '50%',
                        transform     : 'translate(-50%,-50%)',
                        width         : 450
                    }}
                    onClick = {(  event )=>{

                        event.stopPropagation();

                    }}
                >
                    <CloseButton
                        color   = 'rgb(220,220,220)'
                        hoverStyle  = {{ stroke : 'rgb(160,160,160)' }}
                        size    = { 17 }
                        onClick = { toggle }
                    />
                    <div
                        style = {{
                            background : 'white',
                            padding    : '50px 15px 60px 15px',
                        }}
                    >
                        <span
                            style = {{
                                fontSize: 18,
                                marginTop: 0,
                                letterSpacing: 1,
                                fontFamily: 'hind',
                                fontWeight: 300,
                                lineHeight: '35px',
                                color: 'rgb(120,120,120)',
                                marginBottom: 0,
                                display : 'block'
                            }}
                        >
                            Software Developer
                        </span>
                        <span
                            style = {{
                                fontWeight: 500,
                                fontSize: 25
                            }}
                        >
                            Sung Min Nam
                        </span>

                        <div
                            style = {{
                                marginTop : 20
                            }}
                        >
                            <span
                                style = {{
                                    fontSize: 15,
                                    marginTop: 0,
                                    letterSpacing: 1,
                                    fontFamily: 'hind',
                                    fontWeight: 300,
                                    lineHeight: '35px',
                                    color: 'rgb(120,120,120)',
                                    marginBottom: 0,
                                    display : 'block'
                                }}
                            >
                                <span style = {{ fontWeight : 600 }}>BCIT</span>, Computer Science, Diploma
                            </span>
                            <span
                                style = {{
                                    fontSize: 15,
                                    marginTop: 0,
                                    letterSpacing: 1,
                                    fontFamily: 'hind',
                                    fontWeight: 300,
                                    lineHeight: '35px',
                                    color: 'rgb(120,120,120)',
                                    marginBottom: 0,
                                    display : 'block'
                                }}
                            >
                                <span style = {{ fontWeight : 600 }}>BCIT</span>, Human Computer Interface, B.S (current)
                            </span>
                        </div>

                        <button
                            style = {{
                                background : `rgba(76, 211, 173,${this.state.downloadMouseEnter ? 1 : 0.9  })`,
                                border : 'none',
                                color : 'white',
                                float : 'right',
                                fontWeight : 500,
                                height : 40,
                                letterSpacing : '1px',
                                lineHeight : '40px',
                                outline : 'none',
                                width : '100%',
                                position : 'absolute',
                                bottom : 0,
                                left : 0,
                                transition : '.25s all'
                            }}

                            onMouseEnter = { () => {
                                this.setState({
                                    downloadMouseEnter : true
                                })
                            }}

                            onMouseLeave = { () => {
                                this.setState({
                                    downloadMouseEnter : false
                                })
                            }}


                            onClick = {() => {

                            }}
                        >
                            Download CV
                        </button>
                    </div>
                </div>
            </div>

        )
    }



}

export default Profile;
