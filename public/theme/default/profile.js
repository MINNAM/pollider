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
            allowClose,
            title
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
                    <span
                        className = 'greeting'
                        style = {{
                            color: 'rgb(40,40,40)',
                            display: 'inline-block',
                            fontFamily: 'hind',
                            letterSpacing: '2px',
                            marginBottom: 12,
                            marginTop: 5,
                        }}
                    >
                        {title}
                    </span>
                    <div>
                        <p
                            style = {{
                                fontFamily: 'Hind',
                                fontWeight: 300,
                                letterSpacing: '.85px',
                                lineHeight: '35px',
                            }}
                        >
                            <br/>
                                <span
                                    className = 'desktop-only'
                                >
                                    My name is <span className = 'user-name' style = {{ fontWeight: 500, paddingLeft: 10, paddingRight: 10 }}>{`Min Nam`}.</span>
                                    I am a web developer resides in Vancouver, Canada.
                                    I love the world of coding where a grain of ideas can turn in to a rolling stone, something big!
                                </span>
                                <span
                                    className = 'mobile-only'
                                >
                                    My name is <span className = 'user-name' style = {{ fontWeight: 500, paddingLeft: 10, paddingRight: 10 }}>{`Min Nam`}.</span>
                                    I am a web developer resides in Vancouver, Canada.                                    
                                </span>
                            <br/>
                            <br/>
                            If you are interested in collaborating, please {`contact me `}
                            <span
                                className = 'desktop-only'
                                style = {{borderBottom: '2px solid rgb(76, 211, 173)', cursor: 'pointer'}}
                                onClick = {() => {
                                    toggle('contact');
                                }}
                            >
                                {`here`}
                            </span>
                            <span
                                className = 'mobile-only'
                            >
                                {`at `}
                                <span
                                    style = {{borderBottom: '2px solid rgb(76, 211, 173)', cursor: 'pointer'}}
                                    onClick = {() => {
                                        window.location.href = "mailto:hi@minnam.io";
                                    }}
                                >
                                    {`hi@minnam.io`}
                                </span>
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

}



export default Profile;
