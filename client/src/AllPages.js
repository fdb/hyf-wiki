import React from 'react';
import { Link } from 'react-router-dom';

const PAGE_STATE_LOADING = 'loading';
const PAGE_STATE_OK = 'ok';
const PAGE_STATE_ERROR = 'error';

export default class AllPages extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pageState: PAGE_STATE_LOADING, pages: [] };
  }

  async componentDidMount() {
    const res = await fetch('/api/pages/all');
    const json = await res.json();
    if (json.status && json.status === 'ok') {
      const pages = json.pages;
      this.setState({ pageState: PAGE_STATE_OK, pages });
    } else {
      this.setState({
        pageState: PAGE_STATE_ERROR,
        errorMessage: 'Error when loading pages'
      });
    }
  }

  render() {
    const { pageState, pages, errorMessage } = this.state;

    return (
      <div className="container page">
        {pageState === PAGE_STATE_OK && (
          <div className="page__body">
            <h1> All Pages</h1>
            <ul>
              {pages.map(page => (
                <li>
                  <Link to={`/wiki/${page}`}>{page}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {pageState === PAGE_STATE_ERROR && <p className="page__error">{errorMessage}</p>}
      </div>
    );
  }
}
