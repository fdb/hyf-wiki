import React from 'react';
import { Link } from 'react-router-dom';

const PAGE_STATE_LOADING = 'loading';
const PAGE_STATE_OK = 'ok';
const PAGE_STATE_ERROR = 'error';

export default class AllTagsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pageState: PAGE_STATE_LOADING, tags: [] };
  }

  async componentDidMount() {
    const res = await fetch('/api/tags/all');
    const json = await res.json();
    if (json.status && json.status === 'ok') {
      const tags = json.tags;
      this.setState({ pageState: PAGE_STATE_OK, tags });
    } else {
      this.setState({
        pageState: PAGE_STATE_ERROR,
        errorMessage: 'Error when loading tags'
      });
    }
  }

  render() {
    const { pageState, tags, errorMessage } = this.state;

    return (
      <div className="container page">
        {pageState === PAGE_STATE_OK && (
          <div className="page__body">
            <h1>All Tags</h1>
            <ul>
              {tags.map(tag => (
                <li>
                  <Link to={`/tags/${tag}`}>#{tag}</Link>
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
