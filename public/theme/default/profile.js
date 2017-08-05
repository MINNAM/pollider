import React from 'react';
import {
    CloseButton,
    FontAwesomeButton,
    Input
} from './components/';

class Profile extends React.Component {

    state = {}

    render () {
        const {
            model,
            toggle,
            allowClose
        } = this.props;

        return (
            <div
                id = 'profile-parent'
            >
                <div
                    className = 'toggle-close-button'
                >
                    <CloseButton
                        color = 'rgba(244,67,54,0.5)'
                        style = {{
                            left: 0,
                            position: 'relative',
                            top: 0,
                            visibility: allowClose === false ? 'hidden' : '',
                        }}
                        hoverStyle  = {{
                            stroke: 'rgba(244,67,54,1)'
                        }}
                        size    = {17}
                        onClick = {() => {
                            toggle(null)
                        }}
                    />
                </div>
                <div
                    className = 'toggle-content'
                >
                    <h1
                        style = {{
                            color: 'rgb(40,40,40)',
                            display: 'inline-block',
                            fontFamily: 'hind',
                            fontSize: 44,
                            letterSpacing: '2px',
                            marginBottom: 12,
                            marginTop: 5,
                        }}
                    >
                        Hello!
                    </h1>
                    <div>
                        <p
                            style = {{
                                fontFamily: 'Hind',
                                fontSize: 18,
                                fontWeight: 300,
                                letterSpacing: '.85px',
                                lineHeight: '35px',
                            }}
                        >
                            <br/>
                            My name is <span style = {{ fontWeight: 500, fontSize : 25, paddingLeft: 10, paddingRight: 10 }}>{`Sung Min Nam`}.</span>
                            I am a web developer resides in Vancouver, Canada.
                            I love the world of coding where a grain of ideas can turn in to a rolling stone, something big!
                            <br/>
                            <br/>
                            If you are interested in collaborating, please {`contact me `}
                            <span
                                style = {{borderBottom: '2px solid rgb(76, 211, 173)', cursor: 'pointer'}}
                                onClick = {() => {
                                    toggle('contact');
                                }}
                            >
                                here
                            </span>
                            <br/>
                        </p>
                    </div>


                </div>
            </div>
        );
    }



}

export default Profile;
