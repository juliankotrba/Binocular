import { combineReducers } from 'redux';
import activeVisualization from './activeVisualization.jsx';
import visualizations from './visualizations.jsx';
import config from './config.jsx';
import { reducer as formReducer } from 'redux-form';
import { handleAction } from 'redux-actions';

const app = combineReducers( {
  activeVisualization,
  visualizations,
  config,
  form: formReducer.plugin( {
    configForm: handleAction( 'RECEIVE_CONFIGURATION', function( state, action ) {
      const config = action.payload;
      return _.merge( {}, state, {
        values: {
          gitlabUrl: config.gitlabUrl,
          arangoHost: _.get( config, 'arango.host' ),
          arangoPort: _.get( config, 'arango.port' ),
          arangoUser: _.get( config, 'arango.user' ),
          arangoPassword: _.get( config, 'arango.password' )
        }
      } );
    }, {} )
  } )
} );

export default app;
