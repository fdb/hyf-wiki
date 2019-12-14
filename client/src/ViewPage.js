import React from 'react';
import { Link } from 'react-router-dom';
import { renderMarkdown } from './util';

const PAGE_STATE_LOADING = 'loading';
const PAGE_STATE_OK = 'ok';
const PAGE_STATE_ERROR = 'error';

export default class ViewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pageState: PAGE_STATE_LOADING };
  }

  componentDidMount() {
    this._loadPage();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.slug !== this.props.match.params.slug) {
      this._loadPage();
    }
  }

  async _loadPage() {
    const { slug } = this.props.match.params;
    const res = await fetch(`/api/page/${slug}`);
    const json = await res.json();
    if (json.status && json.status === 'ok') {
      const body = json.body;
      const html = renderMarkdown(body);
      this.setState({ pageState: PAGE_STATE_OK, body, html });
    } else {
      const errorMessage = json.message && json.message;
      this.setState({ pageState: PAGE_STATE_ERROR, errorMessage });
    }
  }

  render() {
    const { slug } = this.props.match.params;
    const { pageState, html, errorMessage } = this.state;
    return (
      <div className="page">
        {pageState === PAGE_STATE_LOADING && (
          <div className="container page__loading">Loading...</div>
        )}
        {pageState === PAGE_STATE_OK && (
          <div className="container">
            <div className="page__body" dangerouslySetInnerHTML={{ __html: html }} />
            <div className="page__actions">
              <Link className="btn" to={`/edit/${slug}`}>
                Edit
              </Link>
            </div>
          </div>
        )}
        {pageState === PAGE_STATE_ERROR && (
          <div className="container">
            <p className="page__error">{errorMessage}</p>
            <div className="page__actions">
              <Link className="btn" to={`/edit/${slug}`}>
                Create
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }
}
