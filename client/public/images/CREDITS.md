# Image credits

Every photo in this folder except `logo-festari.png` (the app's own brand mark,
from the Figma file) was re-sourced from free, openly-licensed image
libraries — Wikimedia Commons and Openverse (which aggregates Wikimedia,
`rawpixel`, and `stocksnap`) — replacing the originals that shipped with the
Figma export. Rationale: several of the Figma-exported assets turned out to
be broken placeholders (fake app-mockup screenshots instead of real photos —
see git history / PR discussion for the `BrightFix`, `Builders GH`, and
`Dee Interiors` findings), and the rest were prototyping-grade crops the team
asked to be upgraded across the board.

**Second pass:** added multi-story support (three rail users — Ama Serwaa,
Builders GH, Dee Interiors — now post 2 stories each instead of 1) and
swapped four blurry ~1024px `rawpixel` post/property photos for true
4K-class (3840px) Wikimedia Commons originals: `post-house-thumb-1`,
`post-house-main`, `property-trending-2`, plus all 6 new story-only images.
Those 9 are saved as `.jpg`, not `.png` — lossless PNG at 3840px runs
15–29MB per photo for this much fine detail, while `mozjpeg` at quality 87
holds the same resolution to well under 2MB with no visible loss. The
pre-existing `.png` files were left alone (already reasonably sized at
their lower resolution).

Everything below is **CC0** (no attribution legally required) **except the
ones marked CC BY / CC BY 3.0 / CC BY 4.0, which do require it** — kept here
so that requirement travels with the file if this app ever ships.

| File | Source | Creator | License |
|---|---|---|---|
| `avatar-ama-serwaa-story.png`, `avatar-ama-serwaa-post.png` | stocksnap.io | Kristin Hardwick | CC0 |
| `avatar-brightfix-story.png`, `avatar-brightfix-post.png`, `avatar-brightfix-provider.png` | stocksnap.io | (uncredited) | CC0 |
| `avatar-builders-gh-story.png`, `avatar-builders-gh-follow.png` | stocksnap.io | (uncredited) | CC0 |
| `avatar-dee-interiors-story.png`, `avatar-dee-interiors-follow.png` | stocksnap.io | Kristin Hardwick | CC0 |
| `avatar-kojo-mensah-story.png`, `avatar-kojo-mensah-follow.png` | stocksnap.io | Burst | CC0 |
| `avatar-kwame-composer.png`, `avatar-kwame-topnav.png` | stocksnap.io | Kristin Hardwick | CC0 |
| `avatar-luxury-stays-story.png` | rawpixel.com | (uncredited) | CC0 |
| `concierge-portrait.png` | rawpixel.com | (uncredited) | CC0 |
| `post-house-thumb-2.png` | **Wikimedia Commons** — [File:Modern luxury living room with kitchen interior.jpg](https://commons.wikimedia.org/wiki/File:Modern_luxury_living_room_with_kitchen_interior.jpg) | **Shixart1985** | **CC BY 2.0** — attribution required |
| `post-electrician.png` | rawpixel.com | (uncredited) | CC0 |
| `property-trending-1.png` | **Wikimedia Commons** — [File:3D Rendering of Modern Luxury Villa Exterior with Pool.jpg](https://commons.wikimedia.org/w/index.php?curid=186341859) | **Tuantranseo** | **CC BY 4.0** — attribution required. Note: this is a labeled 3D architectural render, not a photograph — common practice for luxury/pre-construction listings, disclosed here for transparency. |
| `post-house-thumb-1.jpg` | **Wikimedia Commons** — [File:Modern living room with stylish furniture and a view of the outdoors in a cozy apartment setting.jpg](https://commons.wikimedia.org/wiki/File:Modern_living_room_with_stylish_furniture_and_a_view_of_the_outdoors_in_a_cozy_apartment_setting.jpg) | **Shixart1985** | **CC BY 2.0** — attribution required |
| `post-house-main.jpg` | **Wikimedia Commons** — [File:Modern house exterior with red roof and landscaped garden under clear blue sky.jpg](https://commons.wikimedia.org/wiki/File:Modern_house_exterior_with_red_roof_and_landscaped_garden_under_clear_blue_sky.jpg) | **Shixart1985** | **CC BY 2.0** — attribution required |
| `property-trending-2.jpg` | **Wikimedia Commons** — [File:New residential buildings with balconies above the shops of the shopping center Oostpoort in the district Amsterdam-Oost.tif](https://commons.wikimedia.org/wiki/File:New_residential_buildings_with_balconies_above_the_shops_of_the_shopping_center_Oostpoort_in_the_district_Amsterdam-Oost%3B_free_architecture_photo_by_Fons_Heijnsbroek,_January_2014.tif) | Fons Heijnsbroek | CC0 |
| `story-ama-serwaa-1.jpg` | **Wikimedia Commons** — [File:Cozy cabin living room with wooden interior.jpg](https://commons.wikimedia.org/wiki/File:Cozy_cabin_living_room_with_wooden_interior.jpg) | **Shixart1985** | **CC BY 2.0** — attribution required |
| `story-ama-serwaa-2.jpg` | **Wikimedia Commons** — [File:White modern kitchen.jpg](https://commons.wikimedia.org/wiki/File:White_modern_kitchen.jpg) | **Shixart1985** | **CC BY 2.0** — attribution required |
| `story-builders-gh-1.jpg` | **Wikimedia Commons** — [File:Steel Frame Commercial Building Under Construction, Ann Arbor Township, Michigan.JPG](https://commons.wikimedia.org/wiki/File:Steel_Frame_Commercial_Building_Under_Construction,_Ann_Arbor_Township,_Michigan.JPG) | **Dwight Burdette** | **CC BY 3.0** — attribution required |
| `story-builders-gh-2.jpg` | **Wikimedia Commons** — [File:Workers at building under construction.jpg](https://commons.wikimedia.org/wiki/File:Workers_at_building_under_construction.jpg) | **Pauloleong2002** | **CC BY 4.0** — attribution required. Depicts anonymous, incidental construction workers in a wide documentary-style site photo (not a posed portrait used as anyone's likeness) — same category of use as a news or stock construction photo. |
| `story-dee-interiors-1.jpg` | **Wikimedia Commons** — [File:Modern bedroom design in a stylish hotel room featuring geometric patterns and soft linens.jpg](https://commons.wikimedia.org/wiki/File:Modern_bedroom_design_in_a_stylish_hotel_room_featuring_geometric_patterns_and_soft_linens.jpg) | **Shixart1985** | **CC BY 2.0** — attribution required |
| `story-dee-interiors-2.jpg` | **Wikimedia Commons** — [File:Modern dining area with stylish table and chairs in cozy interior design.jpg](https://commons.wikimedia.org/wiki/File:Modern_dining_area_with_stylish_table_and_chairs_in_cozy_interior_design.jpg) | **Shixart1985** | **CC BY 2.0** — attribution required |

## A note on the avatar photos specifically

These stand in for fictional people/businesses (Ama Serwaa, Kwame, Kojo
Mensah, etc.) in the mock data. They're real photos of real people who
licensed them CC0 for exactly this kind of reuse — but that's a different
kind of use than a stock library explicitly licensed for anonymous mockup
placeholders. If this app moves toward production with real user-facing
identities, these should be replaced with either a proper stock-photo
license, an illustrated/generated avatar system, or actual user-uploaded
photos — not left as a permanent stand-in for named characters.
