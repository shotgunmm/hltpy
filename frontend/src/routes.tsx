import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import ContactEdit from './pages/contacts/ContactEdit';
import ContactScreen from './pages/contacts/ContactScreen';

export default () => <Switch>
  <Route exact path="/contacts" component={ContactScreen} />
  <Route exact path="/contacts/new" component={ContactEdit} />
  <Route exact path="/contacts/:id" component={ContactEdit} />
</Switch>