import marked from 'marked';
import { sanitize } from 'dompurify';

const TAG_RE = /#(\w+)/g;

export function renderMarkdown(body) {
  let html = sanitize(marked(body));
  html = html.replace(TAG_RE, '<a class="tag" href="/tags/$1">#$1</a>');
  return html;
}
