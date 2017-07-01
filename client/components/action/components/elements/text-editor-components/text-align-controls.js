import React from 'react';

import SelectField from 'material-ui/SelectField';
import MenuItem    from 'material-ui/MenuItem';

const TextAlignControls = () => {

    const entity = props.contentState.getEntity(
        props.block.getEntityAt(0)
    );

    const type = entity.getType();

    let media;

    if (type === 'left') {

        media = <div style = {{ textAlign: 'left' }} />;

    } else if (type === 'center') {
        media = <div style = {{ textAlign: 'center' }} />;

    } else if (type === 'right') {
        media = <div style = {{ textAlign: 'right' }} />;

    }

  return media;

};

export { TextAlignControls };
