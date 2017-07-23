import React from 'react';

const StepperMenuItem = ( props ) => {

    return (

        <span
            style = {{

                lineHeight : '50px',
                marginLeft : 7.5,
                float      : 'left',
                color      : props.selected ? 'rgb(48,48,48)' : 'rgb(220,220,220)'

            }}
            onClick = { () => {

                props.onClick( props.index );

            }}
        >
            { props.label }
        </span>
    );

};

class StepperMenu extends React.Component {

    render () {

        return (

            <div
                style = {{
                    display : 'inline-block',
                    float : 'right',
                    height : '100%'
                }}
            >

                {

                    this.props.items.map( ( element, key ) => {


                        return (
                            <span key = { key }>
                                <StepperMenuItem
                                    index = { key }
                                    label = { element  }
                                    selected = {key == this.props.index  }
                                />
                                {
                                    key % 1 == 0 && key != this.props.items.length - 1 ? <i
                                        className="material-icons"
                                        style = {{

                                            lineHeight: '50px',
                                            marginLeft: 7.5,
                                            fontSize: 13,
                                            float: 'left',
                                            color : 'rgb(220,220,220)'

                                        }}
                                    >
                                        remove
                                    </i> : ''
                                }
                            </span>
                        );

                    })

                }

            </div>

        );

    }

}

const StepperContent = ( props ) => {

    return (

        <div
            style = {{
                display : props.selected ? 'block' : 'none'
            }}
        >
            { props.children  }
        </div>

    );

};

const StepperContentContainer = ( props ) => {

    const style = Object.assign( {}, props.style );

    return (

        <div
            style = { style }
        >
            {
                props.children.map( ( element, key ) => {

                    return React.cloneElement( element, {
                        key : key,
                        selected : key == props.selected

                    });

                })

            }
        </div>

    );

};

export { StepperContent, StepperContentContainer, StepperMenu,  StepperMenuItem };
