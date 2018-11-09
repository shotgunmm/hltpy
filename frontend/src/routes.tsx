import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import ContactEdit from './pages/contacts/ContactEdit';
import ContactScreen from './pages/contacts/ContactScreen';
import OpenHouseEdit from './pages/openhouses/OpenHouseEdit';
import OpenHouseScreen from './pages/openhouses/OpenHouseScreen';

export default () => <Switch>
  <Route exact path="/contacts" component={ContactScreen} />
  <Route exact path="/contacts/new" component={ContactEdit} />
  <Route exact path="/contacts/:id" component={ContactEdit} />
  <Route exact path="/openhouses" component={OpenHouseScreen} />
  <Route exact path="/openhouses/new" component={OpenHouseEdit} />
  <Route exact path="/openhouses/:id" component={OpenHouseEdit} />
</Switch>