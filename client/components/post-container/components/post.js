import $ from 'jquery';
import React             from 'react';

/* Material UI */
import Avatar            from 'material-ui/Avatar';
import KeyboardArrowUp   from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import Check             from 'material-ui/svg-icons/navigation/check';
import CircularProgress  from 'material-ui/CircularProgress';
import LinearProgress    from 'material-ui/LinearProgress';
import TouchRipple from '../../../../node_modules/material-ui/internal/TouchRipple';

/* Pollider */
import M        from '../../../models/m.js';
import { formatDate } from '../models/utility.js';
import CONFIG   from '../../../models/m-config.js';
import PostIcon from './post-icon';


class Post extends React.Component {

    constructor ( props ) {

        super ( props );

        this.state = {

            style : {},
            displayChildren : true,

        };

        this.isUploading  = false;
        this.dragRefernce = 0;

    }

    onClick ( event ) {

        event.stopPropagation();

        this.props.setSelected( this.props.model );

    }

    onMouseDown ( event ) {

        event.stopPropagation();

        this.props.setSelected( this.props.model );
        this.props.setUpdatePreview( false );

    }


    onMouseUp ( event ) {

        event.stopPropagation();

        this.props.model.update();
        this.props.setUpdatePreview( true );

    }

    onDrag ( event ) {



    }

    onMouseLeave ( event ) {

        this.setState({
            style : {
                background : ''
            }
        });

    }

    onMouseEnter () {

        this.setState({
            style : {
                background : 'rgb(245,245,245)'
            }
        });

    }

    /**
    *   Set currently dragged element as a selected element
    */
    onDragStart ( event ) {

        this.dragRefernce = 0;

        var img = document.createElement( 'img' );
        img.src = CONFIG.backendUrl + "../img/blank.png";

        event.dataTransfer.setData( "text/html", "" );
        event.dataTransfer.setDragImage( img, 0, 0);

        this.props.setUpdatePreview( false );

        if ( Object.prototype.toString.call( this.props.selected ) === '[object Array]'  ) {

            var selected = false;

            for ( var i = 0; i < this.props.selected.length; i++ ) {

                if ( this.props.selected[ i ].id == this.props.model.id ) {

                    selected = true;
                    break;

                }

            }

            if ( !selected ) {

                this.props.setSelected( this.props.model );

            }

        } else {

            if ( this.props.selected != this.props.model.id ) {

                this.props.setSelected( this.props.model );

            } else {

                this.props.setSelected( this.props.model );

            }

        }

    }

    onDragOver ( event ) {

        event.preventDefault();

        this.setState({

            style : {

                background : 'rgb(245,245,245)'

            }

        });

        return false;

    }

    onDragEnter () {

        this.dragRefernce = Math.min( this.dragRefernce + 1, 1 ) ;

        this.setState({
            style : {
                background : 'rgb(245,245,245)'
            }
        })

    }

    onDragLeave () {

        this.setState({

            style : {

                background : ''

            }

        });

    }

    /**
    *   Call reallocateModel to set dragged element's new parent and reset background color.
    */
    onDragEnd ( event ) {

        this.props.reallocateModel( this.props.model.parent_id, this.props.model.id, this.props.model.name, this.props.model.hyperlink );
        this.setState({ style : { background : '' }});


        $( '#selected-item' ).css({

            // display : 'none',
            left :  event.pageX + 20 + 'px',
            top :  ( event.pageY - document.body.scrollTop ) + 'px'

        });

        this.props.setUpdatePreview( true );

    }

    /**
    *   Set currently dropped element as a destination element
    */
    onDrop ( event ) {

        const {
            container,
            id,
            parent_id,
            displayChildren
        } = this.props.model;

        event.preventDefault();

        this.setState({ style : { background : '' } });

        if ( container > 0 ) {

            this.props.setDestination( id );

            if( !displayChildren ) {

                this.setState({ displayChildren : true });
            }

        } else {

            this.props.setDestination( parent_id );

        }

        if ( event.dataTransfer.types[ 0 ] ) {

          this.props.setSelected( this.props.model );

          const files = event.dataTransfer.files; // Array of all files

          for ( let i = 0; i < files.length; i++ ) {

            if ( files[ i ].type ) {

                const dataTypeName = files[ i ].type.split( '/' )[ 0 ];
                const dataType     = this.props.postDataTypes[ dataTypeName ];

                if ( this.props.postType.support.indexOf( dataTypeName ) > -1 ) {

                    if ( dataType ) {

                        this.props.insertPost( this.props.model, files[ i ], dataType );

                        console.log( 'jiji', this.props.model );

                    } else {

                        this.props.insertPost( this.props.model, files[ i ], 9 );

                    }

                } else {

                    // Not Supported Type

                }


            } else {

                if ( this.props.postType.support.indexOf( 'other' ) > -1 ) {

                    this.props.insertPost( this.props.model, files[ i ], 9 );

                } else {

                    // Not Supported Type

                }

            }

          }

        }

    }

    handleDropdown () {

        this.setState({

            displayChildren : !this.state.displayChildren

        });

    }

    displayDropdownButton () {

        if ( this.props.model.children ) {

            if( Object.keys( this.props.model.children ).length > 0 ) {


                // Possibly SVG Icon below is producing keyboardOnFocus error.
                return (

                    <span style = {{right: 10, top: 9, position: 'absolute'}} onClick = { this.handleDropdown.bind( this ) }>
                        { this.state.displayChildren ? <KeyboardArrowUp style = {{ marginTop: 4 }} viewBox = { '0 0 18 18'}/> : <KeyboardArrowDown style = {{ marginTop: 4 }} viewBox = { '0 0 18 18'}/> }
                    </span>

                );

            }

        }

    }

    checkFileToUpload () {

      if ( !this.isUploading ) {

        if ( this.props.model.fileToUpload ) {

          this.isUploading = true;

          this.props.upload( this.props.model.parent_id, this.props.model.id, function ( uploadStatus ) {

            this.setState({ uploadStatus });

          }.bind ( this ));

        }

      }

    }

    render () {

        let style;
        let textStyle;

        if ( Object.prototype.toString.call( this.props.selected ) === '[object Array]'  ) {

            var selected = false;

            for ( var i = 0; i < this.props.selected.length; i++ ) {

                if ( this.props.selected[ i ].id == this.props.model.id ) {

                    selected = true;
                    break;

                }

            }

            if ( selected ) {

                style = { 'background' : 'rgb(230,230,230)' };

            } else {

                style = this.state.style;

            }

        } else {

            if ( this.props.selected ) {

                if ( this.props.selected.id == this.props.model.id ) {

                    style     = { 'background' : 'rgb(200,200,200)' };
                    textStyle = { 'color' : 'white' };

                } else {

                    style     = this.state.style;
                    textStyle = { 'color' : '' };

                }

            } else {

                style = this.state.style;

            }

        }

        return (

            <div >

                    <div
                        className    = { 'folder-inner-container' }
                        style = {{
                            ...style,
                            position : 'relative',
                            overflow : 'hidden',
                            cursor   : 'pointer'
                        }}
                        draggable    = { true }

                        onMouseUp = { this.onMouseUp.bind( this ) }
                        onMouseDown = { this.onMouseDown.bind( this ) }
                        onMouseLeave = { this.onMouseLeave.bind( this ) }
                        onMouseEnter = { this.onMouseEnter.bind( this ) }

                        onDragStart  = { this.onDragStart.bind( this ) }
                        onDrop       = { this.onDrop.bind( this ) }
                        onDragEnd    = { this.onDragEnd.bind( this ) }
                        onDragEnter  = { this.onDragEnter.bind( this ) }
                        onDragLeave  = { this.onDragLeave.bind( this ) }
                        onDragOver   = { this.onDragOver.bind( this ) }
                    >
                        <TouchRipple>
                            <PostIcon
                                model = { this.props.model }
                                style = {{
                                    width : 35,
                                    height : 35
                                }}

                            />
                            <span
                                style = {{
                                    display : 'inline-block',
                                    marginTop : 0,
                                    marginLeft : 7.5
                                }}
                            >
                                <span className = { 'file-name' } style = { textStyle }>{ this.props.model.name }</span>
                                <span className = { 'file-date' } style = { textStyle }>{ formatDate( this.props.model.created_date ) }</span>
                            </span>
                             { this.checkFileToUpload() }

                             { this.state.uploadStatus > -1 ?

                               (this.state.uploadStatus == 100 ?
                                 <Avatar style = {{ position: 'absolute', right: 0, top: 10, background: 'none' }} color = {'#00BCD4'} icon = { <Check /> } />
                                : <CircularProgress mode="determinate" value = { this.state.uploadStatus } size = {0.5} style = {{ float: 'right', marginTop: -4}}/>)

                                : ''

                              }

                             { this.displayDropdownButton() }
                         </TouchRipple>
                    </div>

                    <div style = {{ paddingLeft: 20, display : this.state.displayChildren ? '' : 'none' }}>
                        {

                            this.props.children ? this.props.children.map( function ( element, key ) {

                                return element;

                            }) : ''
                        }

                    </div>

            </div>

        );

    }

}

export default Post;
