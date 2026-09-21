export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type Film = {
  src: string;
  width: number;
  height: number;
  label: string;
};

export type Category = "editorial" | "commercial";

export type Project = {
  slug: string;
  title: string;
  category: Category;
  photos: Photo[];
  films?: Film[];
};

export const categoryLabels: Record<Category, string> = {
  editorial: "Editorial",
  commercial: "Commercial",
};

type PhotoSpec = [width: number, height: number, alt: string];

function gallery(slug: string, specs: PhotoSpec[]): Photo[] {
  return specs.map(([width, height, alt], index) => ({
    src: `/media/${slug}/${slug}-${String(index + 1).padStart(2, "0")}.jpg`,
    width,
    height,
    alt,
  }));
}

function film(slug: string, number: number, label: string): Film {
  return {
    src: `/media/${slug}/${slug}-film-${String(number).padStart(2, "0")}.mp4`,
    width: 720,
    height: 1280,
    label,
  };
}

export const projects: Project[] = [
  {
    slug: "glass-man-summer-26",
    title: "Glass Man, Summer 26",
    category: "editorial",
    photos: gallery("glass-man-summer-26", [
      [1540, 2012, "Glass Man cover with three models against an orange backdrop"],
      [2575, 3360, "Two models in dark suits and an embroidered shirt"],
      [2575, 3344, "Model in a cream suit holding a baby against a pink backdrop"],
      [2575, 3344, "Model in pale trousers and a red sash against a pink backdrop"],
    ]),
  },
  {
    slug: "cero",
    title: "Cero Magazine",
    category: "editorial",
    photos: gallery("cero", [
      [1200, 1500, "Cero cover of a model with cropped red hair"],
      [1200, 1500, "Black and white hand pressed towards the lens"],
      [1200, 1500, "Black and white portrait in a buckled jacket"],
      [1200, 1500, "Black and white model leaning against a pale wall"],
      [1056, 1403, "Model with red hair in a tan suit against a beige wall"],
      [3296, 4096, "Black and white spread of a raised hand and a crouching model"],
    ]),
  },
  {
    slug: "glass-magazine",
    title: "Glass Magazine",
    category: "editorial",
    photos: gallery("glass-magazine", [
      [1592, 2045, "Model in a pink coat sitting beside a dolls house"],
      [1272, 1634, "Model in a yellow coat standing by a tall window"],
      [1080, 1382, "Empty teal room with a checkered floor"],
      [1600, 2055, "Model reclining inside a wooden wardrobe"],
      [1080, 1382, "Dolls house on a wooden floor in the dark"],
      [1592, 2074, "Model in a pink jacket standing in a doorway"],
      [1594, 2077, "Figure wearing a model house over their head on a lawn"],
      [1594, 2077, "Model lying on a bed in green gloves"],
      [1288, 1665, "Man in a teal ruffled shirt holding a wine glass"],
      [2610, 3374, "Man in a yellow shirt and dark trousers in a red room"],
      [1292, 1670, "Model with a fishbowl over their head sitting on a counter"],
      [1280, 1655, "Model in a floral dress in a green kitchen"],
    ]),
  },
  {
    slug: "nylon",
    title: "Nylon",
    category: "editorial",
    photos: gallery("nylon", [
      [1440, 1800, "Little Simz in a white jacket as a cut-out against yellow"],
      [1440, 1800, "Little Simz in a white jacket and leather trousers"],
      [970, 1212, "Nylon cover of Little Simz in a green coat holding two bags"],
      [1440, 1800, "Collage portrait of Little Simz with cut-out lettering"],
    ]),
  },
  {
    slug: "arlo-parks",
    title: "Arlo Parks",
    category: "commercial",
    photos: gallery("arlo-parks", [
      [1440, 1440, "Arlo Parks seated in a red car interior"],
      [1440, 1440, "Two figures lit in green and orange light"],
      [1440, 1440, "Arlo Parks in a dark jacket on a red leather seat"],
      [1080, 1350, "Arlo Parks Sonic Exploration tour poster with synthesizers"],
      [1080, 1350, "Arlo Parks in a pink heart top standing in a hedge maze"],
      [1206, 1507, "Arlo Parks from behind in a heart-print T-shirt on a city street"],
      [1440, 1800, "Arlo Parks from behind overlooking a city skyline at night"],
    ]),
  },
  {
    slug: "guardian-saturday",
    title: "Guardian Saturday",
    category: "editorial",
    photos: gallery("guardian-saturday", [
      [814, 1024, "Guardian Saturday cover of Riz Ahmed mid-stride"],
      [1440, 1811, "Riz Ahmed in a quilted jacket and pink tie"],
      [1440, 1876, "Riz Ahmed in a blue leather coat against blue"],
      [1440, 1876, "Riz Ahmed in a floral embroidered coat"],
    ]),
  },
  {
    slug: "british-gq",
    title: "British GQ",
    category: "editorial",
    photos: gallery("british-gq", [
      [1440, 1920, "Riz Ahmed crouching on grass against a pink wall holding a flower"],
      [1440, 1920, "Riz Ahmed among white lilies in a green jacket"],
      [1440, 1800, "British GQ Hype cover of Riz Ahmed"],
      [1440, 1800, "Riz Ahmed seated in a patchwork jacket holding red flowers"],
      [1440, 1699, "Riz Ahmed in a floral jacket on grass against a blue backdrop"],
      [1440, 1699, "Riz Ahmed in a white puffer jacket with pink flowers against orange"],
    ]),
  },
  {
    slug: "barbour-paul-smith-ss26",
    title: "Barbour × Paul Smith SS26",
    category: "commercial",
    photos: gallery("barbour-paul-smith-ss26", [
      [1440, 1845, "Two models with a picnic set on a wooden jetty"],
      [1440, 1843, "Model in a checked jacket resting their chin on a hand"],
      [1440, 1843, "Woman holding two pies over her eyes"],
      [1440, 1843, "Close-up of a smile above a gingham collar"],
    ]),
    films: [
      film("barbour-paul-smith-ss26", 1, "Barbour × Paul Smith SS26 campaign film"),
      film("barbour-paul-smith-ss26", 2, "Barbour × Paul Smith SS26 campaign film, short cut"),
    ],
  },
  {
    slug: "glass-man-winter",
    title: "Glass Man, Winter Issue",
    category: "editorial",
    photos: gallery("glass-man-winter", [
      [1440, 1919, "Model in a dark suit posing in shadow"],
      [1440, 1919, "Model in a beaded black vest under blue light"],
      [1440, 1919, "Model in a tie and dark coat with a white flower corsage"],
      [1206, 1608, "Model in a red cropped jacket and striped socks against a green grid"],
      [1440, 1920, "Close-up of a red leather jacket and bare torso"],
      [1440, 1919, "Model in sculptural inflated trousers against a pale backdrop"],
      [1440, 1920, "Two models in red fringed and floral jackets"],
      [1206, 1459, "Model in a dark suit with a striped sash"],
      [1440, 1742, "Model in a black suit with white ruffles mid-stride"],
      [1440, 1742, "Model in a checked cap and leather coat with a white corsage"],
      [1440, 1742, "Model in a black leather coat against a deep red backdrop"],
    ]),
  },
];

export type MediaItem = ({ kind: "photo" } & Photo) | ({ kind: "film" } & Film);

export function projectMedia(project: Project): MediaItem[] {
  return [
    ...project.photos.map((photo) => ({ kind: "photo" as const, ...photo })),
    ...(project.films ?? []).map((film) => ({ kind: "film" as const, ...film })),
  ];
}

export function projectHref(project: Project) {
  return `/projects/${project.slug}`;
}

export function findProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function neighbours(project: Project) {
  const index = projects.indexOf(project);
  return {
    previous: projects[(index - 1 + projects.length) % projects.length],
    next: projects[(index + 1) % projects.length],
  };
}
