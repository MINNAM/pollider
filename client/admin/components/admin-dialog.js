import React from 'react';
/* Material UI */
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
/* Pollider */
import { DialogHelper } from '../../dialog/';
import {
    TextEditor,
    CodeEditor
} from '../../ui-components/';

/*
* PostAction is a class that is responsible for populating requested dialog.
* Input creation/validation is done here.
*/
class AdminDialog extends DialogHelper {

    constructor ( props ) {

        super( props );

        this.render  = super.render;
        this.display = super.display;
        this.state   = {

            selectedPostType : 0,
            displayPostInfo : true

        };

        this.components = {};

    }

}

export default AdminDialog;
