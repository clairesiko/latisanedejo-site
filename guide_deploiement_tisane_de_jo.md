# Guide de déploiement — La Tisane de Jo

## Vue d'ensemble

Le site sera hébergé gratuitement sur **GitHub Pages** avec un nom de domaine personnalisé, et intégré à **Shopify** pour les achats via le Buy Button.

---

## Étape 1 : Acheter un nom de domaine

**Recommandé : OVH ou Gandi** (registrars français, ~10-15€/an pour un .fr)

1. Aller sur [ovh.com/fr/domaines](https://www.ovh.com/fr/domaines/) ou [gandi.net](https://www.gandi.net)
2. Chercher le nom souhaité (ex: `latisanedejo.fr`, `tisanedejo.fr`, `latisanedejo.com`)
3. Acheter le domaine (choisir renouvellement automatique)
4. Garder les identifiants de connexion au panneau DNS

**Conseil** : Prendre le `.fr` ET le `.com` si disponibles, rediriger le `.com` vers le `.fr`.

---

## Étape 2 : Créer un compte GitHub et un dépôt

1. Aller sur [github.com](https://github.com) → **Sign up**
2. Créer un compte (ex: `latisanedejo`)
3. Cliquer sur **New repository** (bouton vert "+")
4. Nom du dépôt : `latisanedejo.github.io`
5. Cocher **Public**
6. Cocher **Add a README file**
7. Cliquer **Create repository**

---

## Étape 3 : Uploader le site sur GitHub

### Option A : Via l'interface web (plus simple)

1. Ouvrir le dépôt `latisanedejo.github.io`
2. Cliquer **Add file** → **Upload files**
3. Renommer `mockup_tisane_de_jo.html` en `index.html`
4. Glisser-déposer le fichier `index.html`
5. En bas, écrire "Initial site upload" et cliquer **Commit changes**

### Option B : Via GitHub Desktop (plus pratique pour les mises à jour)

1. Télécharger [GitHub Desktop](https://desktop.github.com)
2. Se connecter avec le compte GitHub
3. Cloner le dépôt `latisanedejo.github.io`
4. Copier `index.html` dans le dossier cloné
5. Dans GitHub Desktop : écrire un message de commit → **Commit** → **Push origin**

---

## Étape 4 : Activer GitHub Pages

1. Dans le dépôt, aller dans **Settings** → **Pages** (menu de gauche)
2. Source : **Deploy from a branch**
3. Branch : **main** / dossier **/ (root)**
4. Cliquer **Save**
5. Attendre 2-3 minutes, le site sera accessible à `https://latisanedejo.github.io`

---

## Étape 5 : Connecter le nom de domaine

### Côté GitHub :

1. **Settings** → **Pages** → **Custom domain**
2. Entrer : `www.latisanedejo.fr`
3. Cliquer **Save**
4. Cocher **Enforce HTTPS** (peut prendre quelques minutes à apparaître)

### Côté OVH/Gandi (panneau DNS) :

Ajouter ces enregistrements DNS :

**Pour `www.latisanedejo.fr`** (CNAME) :
- Type : `CNAME`
- Nom : `www`
- Valeur : `latisanedejo.github.io.`

**Pour `latisanedejo.fr`** (redirection apex, 4 enregistrements A) :
- Type : `A` → `185.199.108.153`
- Type : `A` → `185.199.109.153`
- Type : `A` → `185.199.110.153`
- Type : `A` → `185.199.111.153`

La propagation DNS peut prendre de 10 minutes à 48 heures.

---

## Étape 6 : Intégrer Shopify Buy Button

### Dans Shopify :

1. Se connecter à [latisanedejo.myshopify.com](https://latisanedejo.myshopify.com)
2. Aller dans **Sales Channels** → Vérifier que **Buy Button** est installé (sinon : **Sales Channels** → **+** → chercher "Buy Button")
3. Aller dans **Buy Button** → **Create a Buy Button**
4. Sélectionner le produit (ex: L'Originale)
5. Personnaliser le style du bouton :
   - Couleur : `#6B5194` (violet de la marque)
   - Police : Cormorant Garamond
   - Style : adapter au design du site
6. Cliquer **Generate code** → **Copy code**

### Dans le code du site :

1. Le code Shopify génère un `<script>` et un `<div>`.
2. Remplacer chaque bouton `<button class="btn">Acheter</button>` par le code Shopify correspondant.
3. Répéter pour chaque produit.

**Exemple de remplacement :**
```html
<!-- AVANT -->
<button class="btn">Acheter</button>

<!-- APRÈS -->
<div id="product-component-originale"></div>
<script type="text/javascript">
  // Code Shopify généré pour L'Originale
  // (coller le code copié depuis Shopify ici)
</script>
```

---

## Étape 7 : Vérifications finales

1. Tester le site sur mobile et desktop
2. Vérifier que le HTTPS fonctionne (cadenas vert dans la barre d'adresse)
3. Tester un achat avec le mode test de Shopify (Settings → Payments → Shopify Payments → Enable test mode)
4. Vérifier les emails de confirmation de commande

---

## Mises à jour du site

Pour mettre à jour le site après des modifications :

1. Modifier le fichier `index.html`
2. L'uploader à nouveau sur GitHub (même procédure qu'à l'étape 3)
3. Le site se met à jour automatiquement en 2-3 minutes

---

## Résumé des coûts

| Service | Coût |
|---------|------|
| GitHub Pages (hébergement) | Gratuit |
| Nom de domaine .fr | ~10-12€/an |
| Shopify (plan existant) | Déjà en place |
| **Total** | **~10-12€/an** |
