const btn = document.getElementById("btn");
const results = document.getElementById("results");

btn.addEventListener("click", fetchData);

function fetchData() {
  const query = document.getElementById("search").value;

  if (!query) {
    results.innerHTML = "Please enter a search term";
    return;
  }

  // Loading state
  results.innerHTML = "Loading...";

  fetch(`https://api.github.com/search/repositories?q=${query}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      return response.json();
    })
    .then(data => {
      displayData(data.items);
    })
    .catch(error => {
      results.innerHTML = "Error fetching data";
      console.log(error);
    });
}

function displayData(repos) {
  results.innerHTML = "";

  if (repos.length === 0) {
    results.innerHTML = "No results found";
    return;
  }

  repos.map(repo => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${repo.name}</h3>
      <p>⭐ Stars: ${repo.stargazers_count}</p>
      <p>Language: ${repo.language || "N/A"}</p>
      <a href="${repo.html_url}" target="_blank">View Repo</a>
    `;

    results.appendChild(card);
  });
}
async function searchRepos() {
  const query = document.getElementById("repoSearch").value.trim();
  const container = document.getElementById("repoResults");

  if (!query) return;

  container.innerHTML = '<div class="gh-message">Searching battles...</div>';

  try {
    const res = await fetch(`https://api.github.com/search/repositories?q=${query}`);

    if (!res.ok) throw new Error("Failed to fetch repositories");

    const data = await res.json();

    displayRepos(data.items);

  } catch (err) {
    container.innerHTML = `<div class="gh-error">${err.message}</div>`;
  }
}
function displayRepos(repos) {
  const container = document.getElementById("repoResults");

  if (!repos.length) {
    container.innerHTML = "No battles found";
    return;
  }

  container.innerHTML = repos.map(repo => `
    <div class="repo-item">
      <a class="repo-name" href="${repo.html_url}" target="_blank">
        ${repo.name}
      </a>
      <span class="repo-stars">★ ${repo.stargazers_count}</span>
    </div>
  `).join("");
}
