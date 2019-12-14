import React from 'react';
import { Link } from 'react-router-dom';

const PAGE_STATE_LOADING = 'loading';
const PAGE_STATE_OK = 'ok';
const PAGE_STATE_ERROR = 'error';

export default class TagPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pageState: PAGE_STATE_LOADING, tag: null, pages: [] };
  }

  async componentDidMount() {
    const { tag } = this.props.match.params;
    const res = await fetch(`/api/tags/${tag}`);
    const json = await res.json();
    if (json.status && json.status === 'ok') {
      const pages = json.pages;
      console.log(json);
      this.setState({ pageState: PAGE_STATE_OK, tag, pages });
    } else {
      this.setState({
        pageState: PAGE_STATE_ERROR,
        errorMessage: 'Error when loading tags'
      });
    }
  }

  render() {
    const { pageState, tag, pages, errorMessage } = this.state;
    console.log(this.state);
    return (
      <div className="container page">
        {pageState === PAGE_STATE_OK && (
          <div className="page__body">
            <h1>All pages with #{tag}</h1>
            <ul>
              {pages.map(slug => (
                <li>
                  <Link to={`/wiki/${slug}`}>{slug}</Link>
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
