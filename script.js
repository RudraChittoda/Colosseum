const ghInput = document.getElementById('ghInput');
const resultEl = document.getElementById('ghResult');
const reposSection = document.getElementById('reposSection');

ghInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    searchGitHub();
  }
});


async function searchGitHub() {
  const username = ghInput.value.trim();
  if (!username) return;

  showLoading();

  try {
    const res = await fetch(`https://api.github.com/users/${username}`);

    if (!res.ok) {
      if (res.status === 404) throw new Error("User not found");
      throw new Error("Something went wrong");
    }

    const user = await res.json();

    renderUserCard(user);
    renderUserStats(user);

    fetchRepos(username);

  } catch (error) {
    showError(error.message);
  }
}

function showLoading() {
  resultEl.innerHTML = `<div class="gh-message">Loading...</div>`;
  reposSection.style.display = "none";
}

function showError(message) {
  resultEl.innerHTML = `<div class="gh-error">${message}</div>`;
}


function renderUserCard(user) {
  resultEl.innerHTML = `
    <a class="gh-card" href="${user.html_url}" target="_blank">
      <img class="gh-avatar-sm" src="${user.avatar_url}" />
      <div class="gh-info">
        <div class="gh-name-sm">${user.name || user.login}</div>
        <div class="gh-meta-sm">@${user.login}</div>
      </div>
      <div class="gh-repos-sm">${user.public_repos} repos</div>
    </a>
  `;
}


function renderUserStats(user) {
  document.getElementById('ghPlaceholder').style.display = "none";
  document.getElementById('ghStats').style.display = "block";

  document.getElementById('ghAvatar').src = user.avatar_url;
  document.getElementById('ghName').textContent = user.name || user.login;
  document.getElementById('ghBio').textContent = user.bio || "";
  document.getElementById('ghProfileLink').href = user.html_url;

  document.getElementById('ghRepos').textContent = user.public_repos;
  document.getElementById('ghFollowers').textContent = user.followers;
  document.getElementById('ghGists').textContent = user.public_gists || 0;

  const power = user.public_repos + user.followers;
  document.getElementById('ghPower').textContent = power;
}

async function fetchRepos(username) {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos`
    );

    const repos = await res.json();


    const topRepos = repos
      .filter(repo => !repo.fork) 
      .sort((a, b) => b.stargazers_count - a.stargazers_count) 
      .slice(0, 5);

    renderRepos(topRepos);

  } catch (error) {
    console.log(error);
  }
}

function renderRepos(repos) {
  reposSection.style.display = "block";

  const reposList = document.getElementById('reposList');

  reposList.innerHTML = repos.map(repo => `
    <div class="repo-item">
      <a class="repo-name" href="${repo.html_url}" target="_blank">
        ${repo.name}
      </a>
      <span class="repo-stars">★ ${repo.stargazers_count}</span>
    </div>
  `).join("");
}
