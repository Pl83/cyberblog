  const titre = document.getElementById("titre");
  const content = document.getElementById("content");
  const queryString = window.location.search;

  const urlParams = new URLSearchParams(queryString);
  const slug = urlParams.get('slug');

  // On cherche l'article correspondant au slug
  const article = articles.find(article => article[1] === slug);

  if (article) {
    titre.innerText = article[0];     // Titre de l'article
    content.innerHTML = article[2];   // Contenu HTML de l'article
  } else {
    // Si l'article n'existe pas
    titre.innerText = "Article introuvable";
    content.innerHTML = "<p>Désolé, cet article n'existe pas ou a été supprimé.</p>";
  }
