import React from 'react';
import {render} from 'react-dom';

import AppRouter from './router.js';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

render(<AppRouter/>, document.querySelector('#pollider'));
