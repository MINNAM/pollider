import React, {Component, PropTypes} from 'react';
/* Material UI */
import _Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const STYLES = {
    actions: {
        bottom : 0,
        display: 'table',
        height: 50,
        marginTop: 5,
        paddingTop: 6.5,
        position: 'fixed',
        width : 'calc( 100% - 30px )',
        borderTop : '1px solid rgb(240,240,240)'
    },
    dialog: {
        height: '100%',
        left: 0,
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 100,
    },
    contentWrapper: {
        background: 'rgba(50,50,50,0.4)',
        height: '100%',
        padding: '5%',
        position: 'absolute',
        width: '100%',
    },
    content: {
        background: 'white',
        boxShadow: '1px 1px 10px rgba(50,50,50,0.5)',
        left: '50%',
        padding: '15px 15px 65px 15px',
        position: 'absolute',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
    }
};

class Dialog extends React.Component {

    static propTypes = {
        /**
        *   children contains contents of dialog
        */
        children: PropTypes.array,
        /**
        *   style for content
        */
        contentStyle: PropTypes.object,
        /**
        *   style for wrapper element
        */
        dialogStyle: PropTypes.object,
        /**
        *   Callback to close dialog when clicking background
        */
        onRequestClose: PropTypes.func,
        /**
        *   state in 'Action' to rather display dialog or not
        */
        isOpen: PropTypes.bool.isRequired,
    };

    state = {
        marginTop: 100,
        opacity: 0
    }

    constructor (props) {
        super(props);
        this.onKeyDown = this.onKeyDown.bind( this );
    }

    componentWillReceiveProps (newProps) {
        const {
            onRequestClose
        } = this.props;

        if (newProps.isOpen == false) {

            this.setState({
                marginTop: 100,
                opacity: 0
            });

            setTimeout(() => {
                this.setState({
                    display: 'none'
                });
            },500);
        }

    }

    componentDidMount () {
        document.body.addEventListener('keydown', this.onKeyDown);

        this.setState({
            marginTop: 0,
            opacity: 1,
            display: 'inline'
        })
    }

    componentWillUnmount () {
        document.body.removeEventListener('keydown', this.onKeyDown);
    }

    onKeyDown ( event ) {
        const {
            onRequestClose,
            onExecute,
            options = {
                executeOnEnter : true,
            }
        } = this.props;

        switch (event.keyCode) {

            case 27:
                if (options.onRequestClose !== false) {
                    this.setState({
                        marginTop: 100,
                        opacity: 0
                    })
                    setTimeout(() => {
                        onRequestClose();
                    },300);
                }
                break;


            case 13:
                if (options.executeOnEnter) {
                    if (options.onRequestClose != false) {
                        this.setState({
                            marginTop: 0,
                            opacity: 1
                        })
                        setTimeout(() => {
                            onExecute();
                        },300);

                    } else {
                        onExecute();
                    }

                }
                break;
        }
    }

    render () {

        const {
            children,
            style = {},
            options = {},
            onExecute,
            onRequestClose,
            isOpen,
            error,
        } = this.props;
        const {
            marginTop,
            opacity
        } = this.state;

        const actions = [
            <FlatButton
                label = {options.cancel ? options.cancel.label : 'Cancel'}
                primary = {true}
                style = {{
                    float: 'left',
                    display: options.cancel ? (options.cancel.hidden ? 'none' : '') : ''
                }}
                onTouchTap = {() => {
                    this.setState({
                        marginTop: 100,
                        opacity: 0
                    })
                    setTimeout(() => {
                        onRequestClose();
                    },300);
                }}
            />,
            <FlatButton
                disabled = {error}
                label = {options.submit ? options.submit.label : 'OK'}
                style = {{
                    float: 'right',
                    display: options.submit ? (options.submit.hidden ? 'none' : '') : ''
                }}
                primary = {true}
                onTouchTap = {() => {
                    if (options.onRequestClose !== false) {
                        this.setState({
                            marginTop: 100,
                            opacity: 0
                        })
                        setTimeout(() => {
                            onExecute();
                        },300);
                    } else {
                        onExecute();
                    }
                }}
            />
        ];

        return (
            <div
                style = {{
                    ...STYLES.dialog,
                    ...style.dialog,
                    display: this.state.display,
                    opacity,
                    transition: '.3s all'
                }}
                onTouchTap = {(event) => {
                    event.stopPropagation();

                    if (options.onRequestClose !== false) {
                        this.setState({
                            marginTop: 100,
                            opacity: 0
                        })
                        setTimeout(() => {
                            onRequestClose();
                        },300);
                    }
                }}
            >
                <div
                    style = {STYLES.contentWrapper}
                >
                    <div
                        style = {{
                            ...STYLES.content,
                            ...style.content,
                            marginTop,
                            transition: '.3s all'
                        }}
                        onTouchTap = {(event) => {
                            event.stopPropagation();
                        }}
                    >
                        <div
                            style = {{
                                position: 'relative',
                                height: '100%',                                
                            }}
                        >
                            {children}
                        </div>
                        <div
                            style = {STYLES.actions}
                        >
                            {
                                actions.map((action, key) => {
                                    return (
                                        <span
                                            key = {key}
                                            style = {{
                                                display: 'table-cell'
                                            }}
                                        >
                                            {action}
                                        </span>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default Dialog;
