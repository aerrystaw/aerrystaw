
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = process.cwd();

function loadJson(relativePath, fallback) {
  const p = path.join(root, relativePath);
  if (!fs.existsSync(p)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    console.error('Error parsing', p, e);
    return fallback;
  }
}

const config = loadJson('data/config.json', {
  username: 'aerrystaw',
  name: '',
  short_bio: 'Crafting elegant code and delightful developer experiences.',
  website: 'https://your-website.example.com',
  email: 'hello@your-email.com',
  twitter: 'your_twitter_handle',
  linkedin: 'your-linkedin'
});

const projects = loadJson('data/projects.json', [
  {
    name: 'Project One',
    description: 'A sleek web app that simplifies X; built with Next.js + GraphQL.',
    url: 'https://github.com/aerrystaw/project-one',
    tech: 'Next.js · TypeScript'
  },
  {
    name: 'Project Two',
    description: 'Tiny library that does Y with zero dependencies.',
    url: 'https://github.com/aerrystaw/project-two',
    tech: 'TypeScript'
  }
]);

function generateProjectsMd(projectsArr) {
  return projectsArr.map(p => `- [${p.name}](${p.url}) — ${p.description}  \n  Tech: ${p.tech}`).join('\n\n');
}

const readme = `# Hi — I'm ${config.name || config.username} 👋

> ${config.short_bio}

[![Website](https://img.shields.io/badge/Website-Portfolio-informational?style=for-the-badge&logo=google-chrome)](${config.website})
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](${config.linkedin})
[![Twitter Follow](https://img.shields.io/twitter/follow/${config.twitter}?style=for-the-badge&logo=twitter)](https://twitter.com/${config.twitter})
[![Email](https://img.shields.io/badge/Email-${encodeURIComponent(config.email)}-green?style=for-the-badge&logo=minutemailer)](mailto:${config.email})

---

## ✨ About me
${config.short_bio}

- 🔭 Currently building: a creator-engagement analytics product
- 🌱 Learning: advanced TypeScript patterns, WebAssembly, and systems design
- 💬 Ask me about: React, Node.js, design systems, DX, CLI tools
- ⚡ Fun fact: I collect ergonomic keyboards and small productivity gadgets

---

## 🧰 Tech & Topics
TypeScript · React · Next.js · Node.js · Postgres · Docker · Design Systems · Developer Experience

---

## 🚀 Featured Projects
Below are a few highlighted projects — edit data/projects.json to update this list.

<!-- PROJECTS_LIST -->
${generateProjectsMd(projects)}

---

## 📊 GitHub Stats (dark theme)
<p align="left">
  <img alt="${config.username}'s GitHub stats" src="https://github-readme-stats.vercel.app/api?username=${config.username}&show_icons=true&theme=dark&count_private=true" />
  <img alt="Top Languages" src="https://github-readme-stats.vercel.app/api/top-langs/?username=${config.username}&layout=compact&theme=dark" />
</p>

---

## ✍️ Blog & Talks
- Add blog posts, talks or slides here.

---

## 📫 How to reach me
- Email: ${config.email}
- Website: ${config.website}
- LinkedIn: ${config.linkedin}
- Twitter: https://twitter.com/${config.twitter}

---

## ⚙️ How this README is maintained
This README is generated from the JSON data files in the repo (data/config.json and data/projects.json). A GitHub Actions workflow runs daily and will regenerate the README from those files; it commits if there are changes.

`;

const outPath = path.join(root, 'README.md');
fs.writeFileSync(outPath, readme, 'utf8');
console.log('README.md generated.');

// commit logic (if running in CI)
try {
  execSync('git add README.md', { stdio: 'inherit' });
  execSync('git commit -m "chore: regenerate README" || true', { stdio: 'inherit' });
  // The action runner typically has push permission with GITHUB_TOKEN via actions/checkout persist-credentials.
  execSync('git push', { stdio: 'inherit' });
} catch (e) {
  console.log('Commit/push step likely failed (maybe running locally). CI will handle push with proper permissions.');
}
