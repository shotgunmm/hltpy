import { RMWCProvider } from '@rmwc/provider';
import { ThemeProvider } from '@rmwc/theme';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import LuxonUtils from 'material-ui-pickers/utils/luxon-utils';
import { Provider } from 'mobx-react';
import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.scss';
import themeOptions from './components/theme';
import Routes from './routes';
import store from './store';
class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <MuiPickersUtilsProvider utils={LuxonUtils}>
          <RMWCProvider>
            <ThemeProvider options={themeOptions}>
              <BrowserRouter basename="/dashboard">
                <Routes />
              </BrowserRouter>
            </ThemeProvider>
          </RMWCProvider>
        </MuiPickersUtilsProvider>
      </Provider>
    );
  }
}

export default App;
