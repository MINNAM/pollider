import React from 'react';

/* Pollider */
import Row from './row.js';
import Col from './col.js';

const COL_WIDTHS = [
    [ '12' ],
    [ '6','6' ],
    [ '4', '4'],
    [ '3', '3', '3', '3' ],
    [ '3', '9' ],
    [ '9', '3' ],
    [ '6', '3', '3' ],
    [ '3', '6', '3' ],
    [ '3', '3', '6' ],
    [ '4', '8' ],
    [ '8', '4' ],
];

class RowContainer extends React.Component {

    constructor ( props ) {

        super( props );

    }

    render () {


        return (

            <div
                className = { this.props.rowClassName }
                style = {{
                    width: '100%',
                    overflow: this.props.rowClassName == 'parent-row' ? 'auto' : 'hidden',
                    height: '100%',
                }}>
                {
                    this.props.model.rows.map( ( row, key ) => {

                        let content   = key;

                        return (

                            <Row
                                top                    = { this.props.top }
                                first                  = { key == 0}
                                last                   = { key == this.props.model.rows.length - 1}
                                className              = { this.props.rowClassName }
                                key                    = { key }
                                model                  = { row }
                                parentModel            = { this.props.model }
                                handleDialogModel      = { this.props.handleDialogModel }
                                addRowFromCol          = { this.props.addRowFromCol }
                            >
                                {
                                    row.cols.map( ( element, key ) => {

                                        return (

                                            <Col
                                                first                  = { key == 0 }
                                                last                   = { key == row.cols.length - 1 }
                                                display                = { this.props.display }
                                                key                    = { key }
                                                model                  = { element }
                                                dynamic                = { row.dynamic }
                                                width                  = { element.width }
                                                content                = { content }
                                                uploads                = { this.props.uploads }
                                                handleDialogModel     = { this.props.handleDialogModel }
                                                openDialog = { this.props.openDialog }
                                            />

                                        );

                                    })

                                }

                            </Row>

                        );

                    })
                }
            </div>

        );

    }

}

export default RowContainer;
