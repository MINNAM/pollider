import React from 'react';
import {render} from 'react-dom';
import Index from './index';

render( <Index {...window.__APP_INITIAL_STATE__} />, document.getElementById('pollider-public'));
