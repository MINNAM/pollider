import React from 'react';

const Heading = ( props ) => {

    const { textColor, borderColor, content, bold, borderWidth, fontSize, float } = props;

    return (
        <div
            style = {{
                position : 'relative',
                display: 'inline-block'
            }}
        >
            <span
                style = {{
                    fontSize : fontSize ? fontSize : 16,
                    marginTop : 0,
                    letterSpacing : 1,
                    fontFamily : 'hind',
                    fontWeight : bold ? 500 : 300,
                    lineHeight : '35px',
                    color : textColor ? textColor : 'rgb(160,160,160)',
                    marginBottom : 0,
                    float : float ? float : ''

                }}
            >
                { content }
            </span>
            <span
                style = {{
                    width: borderWidth ? borderWidth : 20,
                    display : 'inline-block',
                    borderBottom : borderColor ? `1px solid ${borderColor}` : '',
                    position: 'absolute',
                    right : 0,
                    top : 'calc(50% - .25px)',
                    transform : 'translate(0, -50%)'
                }}
            />
        </div>
    )

}

export default Heading;
