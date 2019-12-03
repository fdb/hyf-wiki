import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

import ViewPage from './ViewPage';
import EditPage from './EditPage';
import AllPages from './AllPages';
import AllTagsPage from './AllTagsPage';
import TagPage from './TagPage';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Router>
        <header>
          <div className="container header__container">
            <h1 className="header__title">
              <a href="/wiki/home">Wiki</a>
            </h1>
            <nav className="header__nav">
              <Link to="/wiki/home">Home</Link>
              <Link to="/wiki/about">About</Link>
            </nav>
          </div>
        </header>
        <main>
          <Switch>
            <Route path="/wiki/:slug" component={ViewPage} />
            <Route path="/edit/:slug" component={EditPage} />
            <Route path="/all" component={AllPages} />
            <Route path="/tags/:tag" component={TagPage} />
            <Route path="/tags" component={AllTagsPage} />
            <Route path="/">
              <Redirect to="/wiki/home" />
            </Route>
          </Switch>
        </main>
        <footer>
          <div className="container footer__container">
            <Link to="/wiki/home">Home</Link>
            <Link to="/wiki/about">About</Link>
            <Link to="/all">All Pages</Link>
            <Link to="/tags">All Tags</Link>
          </div>
        </footer>
      </Router>
    );
  }
}

export default App;
