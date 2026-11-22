# Comment mettre le site en ligne

Repo GitHub : https://github.com/clairesiko/latisanedejo-site — domaine : https://www.latisanedejo.com

## Nouveau site (20/11/2026) : première mise en ligne

1. Ouvrir https://github.com/clairesiko/latisanedejo-site
2. « Add file » → « Upload files »
3. Glisser-déposer depuis `Bureau/Tisane/4. Site` : tous les fichiers et dossiers **sauf `Archives`** (et sauf les .md).
   Dossiers à prendre : `assets`, `fonts`, `images`, `tisanes`. Fichiers : tous les `.html`, `CNAME`, `robots.txt`, `sitemap.xml`.
4. Message de commit : « Nouveau site » → « Commit changes »
5. Supprimer sur GitHub les anciennes images devenues inutiles (dossier `images/` sauf `images/site/`) : facultatif.
6. Attendre 2-3 minutes, ouvrir le site, vider le cache (Cmd+Maj+R).
7. Search Console : Sitemaps → renvoyer `sitemap.xml`.

## Mises à jour suivantes

Même méthode : « Upload files » avec seulement les fichiers modifiés (même chemin), puis Commit.
Pour voir une page avant de la mettre en ligne : double-cliquer sur le fichier `.html` (le panier Shopify et la lettre ne marchent qu'en ligne).

## Fichiers du site

| Fichier | Page |
|---|---|
| `index.html` | Accueil |
| `tisanes/index.html` | Nos tisanes |
| `tisanes/originale.html`, `tisanes/sirocco.html`, `tisanes/pochette-cadeau.html` | Fiches produit |
| `notre-univers.html` | Notre univers |
| `faq.html`, `contact.html`, `ou-nous-trouver.html` | FAQ, contact, où nous trouver |
| `retractation.html`, `retractation-confirmation.html` | Rétractation |
| `informations-legales.html` | Mentions légales, CGV, confidentialité |
| `404.html` | Page introuvable |
| `assets/site.css`, `assets/site.js` | Style et scripts communs (menu, panier Shopify) |
| `images/site/` | Visuels du site |

## Ne PAS mettre sur GitHub

Le dossier `Archives/` (anciennes versions et maquettes).
