'use strict';

import { AppRegistry, YellowBox } from 'react-native';
import SourceViewBible from './js/SourceViewBible';

YellowBox.ignoreWarnings(['Warning: isMounted', 'RCTBridge required', 'Class RCTC', 'Module', 'Sending', 'Native TextInput']);
AppRegistry.registerComponent('SourceViewBible', () => SourceViewBible);
