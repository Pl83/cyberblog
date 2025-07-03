const ul = document.getElementById('list-articles');

// Regrouper les articles par tag
const articlesByTag = {};
articles.forEach(([title, slug, _, tag]) => {
  if (!articlesByTag[tag]) {
    articlesByTag[tag] = [];
  }
  articlesByTag[tag].push({ title, slug });
});

// Pour chaque tag, créer un sous-titre et les articles associés
for (const tag in articlesByTag) {
  // Titre du tag
  const tagTitle = document.createElement('h2');
  tagTitle.textContent = `📂 ${tag}`;
  ul.appendChild(tagTitle);

  // Liste des articles sous ce tag
  const tagUl = document.createElement('ul');
  tagUl.style.marginBottom = '30px';

  // Trier les articles par titre (ordre alphabétique)
  const sortedArticles = articlesByTag[tag].sort((a, b) => 
    a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' })
  );

  // Créer les éléments de la liste
  sortedArticles.forEach(({ title, slug }) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `article.html?slug=${slug}`;
    a.textContent = title;
    li.appendChild(a);
    tagUl.appendChild(li);
  });

  ul.appendChild(tagUl);
}