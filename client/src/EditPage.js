import React from 'react';
import { Link } from 'react-router-dom';
import { renderMarkdown } from './util';

const PAGE_STATE_LOADING = 'loading';
const PAGE_STATE_OK = 'ok';
const PAGE_STATE_ERROR = 'error';

const NEW_PAGE_TEXT = '# Your New Page\n\nWrite whatever you like here.';

export default class EditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pageState: PAGE_STATE_LOADING };
    this._onChange = this._onChange.bind(this);
    this._onSave = this._onSave.bind(this);
  }

  async componentDidMount() {
    const { slug } = this.props.match.params;
    const res = await fetch(`/api/page/${slug}`);
    const json = await res.json();
    if (json.status && json.status === 'ok') {
      const body = json.body;
      const html = renderMarkdown(body);
      this.setState({ pageState: PAGE_STATE_OK, body, html });
    } else {
      // const errorMessage = json.message && json.message;
      const body = NEW_PAGE_TEXT;
      const html = renderMarkdown(body);
      this.setState({ pageState: PAGE_STATE_OK, body, html });
    }
  }

  _onChange(body) {
    const html = renderMarkdown(body);
    this.setState({ body, html });
  }

  async _onSave() {
    const { slug } = this.props.match.params;
    const { body } = this.state;
    const res = await fetch(`/api/page/${slug}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ body })
    });
    const json = await res.json();
    if (json.status && json.status === 'ok') {
      // Redirect
      this.props.history.push(`/wiki/${slug}`);
    } else {
      // Show an error.
    }
  }

  render() {
    const { slug } = this.props.match.params;
    const { pageState, body, html, errorMessage } = this.state;
    return (
      <div className="page">
        {pageState === PAGE_STATE_LOADING && (
          <div className="container page__loading">Loading...</div>
        )}
        {pageState === PAGE_STATE_OK && (
          <div className="container">
            <div className="editor">
              <textarea
                className="editor__textarea"
                value={body}
                onChange={e => this._onChange(e.target.value)}
              />
              <div className="editor__preview" dangerouslySetInnerHTML={{ __html: html }} />
            </div>
            <div className="page__actions">
              <button className="btn" onClick={this._onSave}>
                Save
              </button>
              or &nbsp; <Link to={`/wiki/${slug}`}>Cancel</Link>
            </div>
          </div>
        )}
        {pageState === PAGE_STATE_ERROR && (
          <div className="container page__error">{errorMessage}</div>
        )}
      </div>
    );
  }
}
