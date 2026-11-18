(() => {
  'use strict';
  const user = 'alihkz1';
  const snapshot = JSON.parse(document.querySelector('#github-repo-data').textContent);
  let repositories = snapshot.repositories;
  const grid = document.querySelector('#repo-grid');
  const search = document.querySelector('#repo-search');
  const language = document.querySelector('#repo-language');
  const sort = document.querySelector('#repo-sort');
  const summary = document.querySelector('#repo-summary');
  const notice = document.querySelector('#repo-notice');
  const refresh = document.querySelector('#repo-refresh');
  refresh.hidden = false;
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function card(repo) {
    const article = element('article', 'repo-card');
    const top = element('div', 'repo-top');
    const icon = element('span', 'repo-icon', '</>');
    icon.setAttribute('aria-hidden', 'true');
    top.append(icon, element('span', 'repo-kind', repo.archived ? 'Archived' : repo.fork ? 'Fork' : 'Repository'));
    const heading = element('h3');
    const link = element('a', '', repo.name);
    // URLs are constructed from the known owner and encoded repository name.
    link.href = `https://github.com/${user}/${encodeURIComponent(repo.name)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    const arrow = element('span', '', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    link.append(' ', arrow);
    heading.append(link);
    const description = element('p', 'repo-description', repo.description || 'Explore the source code and project details on GitHub.');
    description.dir = 'auto';
    const bottom = element('div', 'repo-card-bottom');
    const lang = element('span', 'repo-language');
    lang.dataset.language = repo.language || 'Other';
    const dot = element('i');
    dot.setAttribute('aria-hidden', 'true');
    lang.append(dot, repo.language || 'Other');
    const counts = element('span', 'repo-counts');
    const stars = element('span', '', `☆ ${repo.stargazers_count || 0}`);
    stars.setAttribute('aria-label', `${repo.stargazers_count || 0} stars`);
    counts.append(stars, element('span', '', `Forks ${repo.forks_count || 0}`));
    bottom.append(lang, counts);
    article.append(top, heading, description, bottom);
    return article;
  }
  function render() {
    const term = search.value.trim().toLowerCase();
    const matches = repositories.filter(repo =>
      (language.value === 'all' || (repo.language || 'Other') === language.value) &&
      [repo.name, repo.description || '', repo.language || '', ...(repo.topics || [])].join(' ').toLowerCase().includes(term),
    ).sort((a, b) => sort.value === 'name' ? a.name.localeCompare(b.name) : sort.value === 'stars' ? b.stargazers_count - a.stargazers_count || a.name.localeCompare(b.name) : Date.parse(b.updated_at) - Date.parse(a.updated_at));
    grid.replaceChildren(...matches.map(card));
    summary.textContent = matches.length === repositories.length ? `${repositories.length} public repositories` : `${matches.length} of ${repositories.length} repositories`;
    document.querySelector('#repo-empty').hidden = matches.length !== 0;
  }
  function populateLanguages() {
    const previous = language.value;
    language.replaceChildren(new Option('All languages', 'all'), ...[...new Set(repositories.map(repo => repo.language || 'Other'))].sort().map(value => new Option(value, value)));
    language.value = [...language.options].some(option => option.value === previous) ? previous : 'all';
  }
  async function sync() {
    refresh.disabled = true;
    refresh.textContent = 'Updating…';
    notice.textContent = 'Checking GitHub for the latest public repositories…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const all = [];
      let page = 1;
      while (true) {
        const response = await fetch(`https://api.github.com/users/${user}/repos?type=owner&sort=updated&per_page=100&page=${page}`, {
          headers: { Accept: 'application/vnd.github+json' }, signal: controller.signal,
        });
        if (!response.ok) throw new Error(response.status === 403 || response.status === 429 ? 'rate-limit' : 'unavailable');
        const batch = await response.json();
        if (!Array.isArray(batch)) throw new Error('invalid-response');
        all.push(...batch.filter(repo => !repo.private && repo.owner?.login?.toLowerCase() === user && typeof repo.name === 'string'));
        if (batch.length < 100) break;
        page++;
      }
      repositories = [...new Map(all.map(repo => [repo.name, repo])).values()];
      populateLanguages();
      render();
      notice.textContent = 'Up to date with GitHub. All public repositories, including forks and archived projects.';
    } catch (error) {
      const detail = error.message === 'rate-limit' ? 'GitHub’s public request limit was reached.' : 'GitHub could not be reached.';
      notice.textContent = `${detail} Showing the last available collection. You can still browse projects or try Refresh.`;
    } finally {
      clearTimeout(timeout);
      refresh.disabled = false;
      refresh.textContent = 'Refresh';
    }
  }
  search.addEventListener('input', render);
  language.addEventListener('change', render);
  sort.addEventListener('change', render);
  refresh.addEventListener('click', sync);
  document.querySelector('#repo-reset').addEventListener('click', () => { search.value = ''; language.value = 'all'; render(); search.focus(); });
  render();
  void sync();
})();
