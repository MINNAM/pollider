import { React, Action, TextEditor, CodeEditor } from './components/action/components/action.js';


import SelectField                                               from 'material-ui/SelectField';
import MenuItem                                                  from 'material-ui/MenuItem';


/*
* PostAction is a class that is responsible for populating requested dialog.
* Input creation/validation is done here.
*/
class AdminAction extends Action {

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

export default AdminAction;
