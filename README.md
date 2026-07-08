# BS Ambulanter Pflegedienst – Neue Startseite

Moderne, warme und vertrauensvolle Startseite für den ambulanten Pflegedienst
BS Pflege in Karlsruhe. Statische Website (HTML/CSS/JS), ohne Build-Schritt.

## Vorschau

Einfach `index.html` im Browser öffnen – oder lokal servieren:

```bash
# Python
python -m http.server 8080
# dann http://localhost:8080 öffnen
```

## Projektstruktur

```
BSPflege/
├── index.html            # Komplette Startseite (12 Sektionen)
├── assets/
│   ├── css/style.css     # Design-System (warm, modern, responsive)
│   ├── js/main.js        # Sticky-Header, Mobile-Menü, Scroll-Reveal, Scroll-Spy
│   └── img/              # Logo & optimierte Bilder von bs-pflege-ka.de
└── README.md
```

## Design

| Rolle             | Farbe     |
|-------------------|-----------|
| Primär            | `#508396` |
| Sekundär (warm)   | `#AF9E88` |
| Warmer Hintergrund| `#F3ECE4` |
| Text (Blau-Grau)  | `#2B3A40` |

- **Headlines:** Inter (mit Playfair-Display-Akzenten) · **Fließtext:** Google Sans Flex
- Weiche Rundungen, organische Bildformen, dezente Schatten, viel Weißraum
- Sanfte Scroll-Animationen (respektiert `prefers-reduced-motion`)
- Mobile-first, responsiv für Desktop / Tablet / Mobile
- Fixer „Anrufen“-Button auf Mobilgeräten für maximale Conversion

## Sektionen

1. Header/Navigation (sticky, Telefon-Topbar, Mobile-Burger)
2. Hero mit organischem Bild + Badges
3. Vertrauensleiste (4 Karten)
4. Intro-Story mit Werte-Karten
5. Leistungen (4 Karten)
6. Bereich für Angehörige (3 Schritte)
7. Gründerstory / Über BS
8. Warum BS Pflege (6 Vorteile)
9. Testimonials
10. Karriere-Teaser
11. Kontakt-CTA
12. Footer

## SEO

- Genau **eine H1** (Hero), **H2** je Hauptsektion, **H3** für Karten
- Lokale Keywords (Karlsruhe) natürlich eingebettet, kein Keyword-Stuffing
- `MedicalBusiness`-Schema (JSON-LD) mit Adresse, Telefon, Öffnungszeiten
- Open-Graph-Tags, Canonical, sprechende Alt-Texte

### Meta-Daten

- **Title:** `Ambulanter Pflegedienst Karlsruhe | BS Pflege mit Herz`
- **Description:** `BS Ambulanter Pflegedienst in Karlsruhe bietet individuelle Pflege,
  Betreuung, 24h-Pflege und betreute Wohngemeinschaften mit Herz und Erfahrung.`

## Hinweise

- Bilder & Logo wurden von der bestehenden Website übernommen und für schnelle
  Ladezeiten verkleinert/komprimiert.
- Menü-, Impressum- und Datenschutz-Links verweisen auf die bestehende Domain und
  können bei Bedarf auf interne Seiten umgestellt werden.
- Die Buttons „Beratung anfragen“ etc. verlinken aktuell zum Kontaktbereich; ein
  echtes Formular kann dort ergänzt werden.
