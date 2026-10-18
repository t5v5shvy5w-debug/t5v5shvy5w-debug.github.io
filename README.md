# MW Games

Browser games hosted on GitHub Pages.

- FONT FIGHT ARENA: ./font-fight/
- DEADZONE: ./deadzone/
- LAST LIGHT: ./last-light/
- GUN SHOWCASE: ./gun-showcase/

## The hub page

`index.html` is the front page: one self-contained file (inline CSS and JS, no build step).

- Fonts come from Google Fonts: Big Shoulders Display and Barlow for the page, plus the
  Font Fight fighters' own fonts (capital letters only) for the roster wall.
- `shots/` holds the hub's screenshots of Font Fight Arena (WebP with JPEG fallbacks).
- `icons/mw*` is the MW mark (the W is the M turned upside down). The 180 px home-screen
  icon is also inlined in `index.html` as a data URL, so iOS shows it straight away.
- The roster list in the script at the bottom of `index.html` is copied from
  `font-fight/index.html`. If fighters change there, update it here too.

Preview locally from this folder:

    python3 -m http.server 8797

then open http://localhost:8797/
