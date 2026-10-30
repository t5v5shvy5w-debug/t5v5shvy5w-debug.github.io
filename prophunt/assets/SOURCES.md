# Prop Hunt demo — asset sources

Every third-party asset in `assets/` is free to use. CC0/public-domain items need no
attribution; CC-BY items are credited below (attribution lives here, not in-game).

## Textures (ambientCG — CC0 1.0, no attribution required)

- `grass_color.jpg` — Grass 004, color map (1024×1024)
  https://ambientcg.com/view?id=Grass004
- `asphalt_color.jpg` — Road 013 A, color map (1024×1024)
  https://ambientcg.com/view?id=Road013A
- `siding_color.jpg` — Wood Siding 007, color map (1024×1024)
  https://ambientcg.com/view?id=WoodSiding007
- `roof_color.jpg` — Roofing Tiles 001, color map (1024×1024)
  https://ambientcg.com/view?id=RoofingTiles001
- `plaster_color.jpg` — Plaster 002, color map (1024×1024)
  https://ambientcg.com/view?id=Plaster002

ambientCG publishes all materials under CC0 1.0 Universal. Only the color maps are
vendored (roughness/normal/displacement maps from the same packs were not needed;
the game drives wetness through code instead).

## Sky (ambientCG — CC0 1.0, no attribution required)

- `sky_2k.exr` — Day Sky HDRI 066 A, 2K OpenEXR source panorama (2048×1024)
  https://ambientcg.com/view?id=DaySkyHDRI066A
- `sky_tonemapped.jpg` — the vendor's own tonemapped JPG from the same pack
  (2048×1024). This is what the game loads: Three.js r147 cannot decode EXR in a
  non-module build, so the runtime sky/environment uses the tonemapped JPG and the
  EXR is kept as the source asset. The EXR is NOT cached for offline play (it is
  never loaded at runtime).

## Sounds (Wikimedia Commons)

- `gunshot.ogg` — "Gunshots 8.ogg" — Public domain (no attribution required)
  https://commons.wikimedia.org/wiki/File:Gunshots_8.ogg
- `rain.ogg` — "Rain (1).ogg" — Public domain (no attribution required)
  https://commons.wikimedia.org/wiki/File:Rain_(1).ogg
- `thunder.ogg` — "Nosferatu thunderclap" by Richard Humphries — CC BY 4.0
  (transcoded from the source WAV to Ogg Vorbis for size; attribution: Richard
  Humphries, CC BY 4.0)
  https://commons.wikimedia.org/wiki/File:Nosferatu_thunderclap_-_Richard_Humphries.wav
- `footstep.mp3` — "Footstep on Gravel" by Gravity Sound — CC BY 4.0
  (attribution: Gravity Sound, CC BY 4.0)
  https://commons.wikimedia.org/wiki/File:Footstep_on_Gravel_(Gravity_Sound).mp3

Sounds that had only CC-BY-SA recordings available were NOT used (the brief allows
CC0 and CC-BY only). Taunts, sonar pings and UI sounds remain WebAudio synth.

## Not used (deliberate gaps)

- 3D models (soldier/rifle/props): kept procedural. Loading external glTF models
  would need the examples GLTFLoader, which is module-only in modern Three.js and
  a poor fit for this single-file non-module build. The rifle and props are built
  from primitives in code.
- Poly Haven: its API/CDN returned Cloudflare 5xx errors from this machine during
  sourcing, so all textures/sky came from ambientCG instead (same CC0 terms).

## Sizes

Total `assets/` size: ~15 MB (textures ~5 MB, sky EXR 7.5 MB + JPG 1.6 MB,
sounds ~1.1 MB). Runtime loads only the JPGs + sounds (~7 MB); the EXR is source
only. This keeps the demo well under the ~50 MB GitHub Pages comfort budget.
