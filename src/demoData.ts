export type DemoCategory = "All" | "Engineering" | "Flashcards" | "Geography" | "Maths" | "Music" | "Physics";

export type RoutedCategory = Exclude<DemoCategory, "All">;

export type DemoItem = {
  title: string;
  slug: string;
  category: RoutedCategory;
  tags: string[];
  description: string;
  thumbnail: string;
  additionalCategories?: RoutedCategory[];
  engineeringSubcategories?: Array<"Computing" | "Electronics" | "Signals">;
};

export type CategoryRoute = {
  label: RoutedCategory;
  path: string;
  title?: string;
  description: string;
};

export const categoryRoutes: CategoryRoute[] = [
  {
    label: "Engineering",
    path: "/engineering",
    description: "Engineering is a brand new topic on Academo. We have a number of demos in the pipeline, and our initial engineering demos are classified as belonging to electronics, computing and signals categories."
  },
  {
    label: "Geography",
    path: "/geography",
    description: "Geography is the study of places and the relationships between people and their environments."
  },
  {
    label: "Maths",
    path: "/maths",
    description: "Maths is the study of numbers and space."
  },
  {
    label: "Music",
    path: "/music",
    description: "We are excited to announce Music is the latest category to be added to the Academo website. New demos are always being worked on and we hope to have a growing number of musical demos in the near future."
  },
  {
    label: "Physics",
    path: "/physics",
    description: "From sub atomic particles to clusters of galaxies--and everything in between--Physics is the study of energy and matter through time and space."
  },
  {
    label: "Flashcards",
    path: "/flashcards",
    title: "All flashcards",
    description: "Below is a list of all the flashcards currently available on academo.org, arranged in alphabetical order. We are always adding new flashcards, so please check back often to see the latest updates."
  }
];

export const categories: DemoCategory[] = [
  "All",
  ...categoryRoutes.map((category) => category.label)
];

export const demos: DemoItem[] = [
  {
    title: "Virtual Oscilloscope",
    slug: "virtual-oscilloscope",
    category: "Physics",
    tags: ["sound", "audio", "waves"],
    description: "This online virtual oscilloscope allows you to visualise live sound input and get to grips with how to adjust the display.",
    thumbnail: "/assets/demos/virtual-oscilloscope.png"
  },
  {
    title: "Azimuth Calculator",
    slug: "azimuth-calculator",
    category: "Physics",
    additionalCategories: ["Geography"],
    tags: ["astronomy", "maps", "azimuth", "night sky"],
    description: "Use this tool to establish which direction you need to look in, when trying to locate objects in the night sky.",
    thumbnail: "/assets/demos/azimuth-calculator.png"
  },
  {
    title: "Colour-Temperature Relationship",
    slug: "colour-temperature-relationship",
    category: "Physics",
    tags: ["light", "colour", "temperature", "rgb", "kelvin"],
    description: "A tool to convert a temperature in Kelvin into a RGB colour",
    thumbnail: "/assets/demos/colour-temperature-relationship.png"
  },
  {
    title: "Electric field line simulator",
    slug: "electric-field-line-simulator",
    category: "Physics",
    tags: ["electricity", "fields", "coulomb", "electric field", "charge"],
    description: "An interactive demo showing the behaviour of electric field lines around positive and negative point charges.",
    thumbnail: "/assets/demos/electric-field-line-simulator.png"
  },
  {
    title: "Simple pendulum",
    slug: "simple-pendulum",
    category: "Physics",
    tags: ["classical mechanics", "pendulum", "oscillation", "simple harmonic motion"],
    description: "An interactive demonstration of a simple pendulum",
    thumbnail: "/assets/demos/simple-pendulum.png"
  },
  {
    title: "Geodesics on the Earth",
    slug: "geodesics",
    category: "Maths",
    additionalCategories: ["Geography"],
    tags: ["geometry", "maps", "geodesic"],
    description: "Demonstrating how geodesics appear to curve on a 2D representation of 3D space",
    thumbnail: "/assets/demos/geodesics.png"
  },
  {
    title: "Capital Cities Map",
    slug: "capital-cities-map",
    category: "Geography",
    tags: ["maps", "human geography", "cities", "capitals"],
    description: "An interactive map of capital cities around the world.",
    thumbnail: "/assets/demos/capital-cities-map.png"
  },
  {
    title: "3D Vector Plotter",
    slug: "3d-vector-plotter",
    category: "Maths",
    tags: ["vectors", "geometry", "graphing"],
    description: "An interactive plot of 3D vectors. See how two vectors are related to their resultant, difference and cross product.",
    thumbnail: "/assets/demos/3d-vector-plotter.png"
  },
  {
    title: "Hypocycloid animation",
    slug: "hypocycloid",
    category: "Maths",
    tags: ["geometry", "circle", "animation", "curves"],
    description: "Interactive demo of a smaller circle rolling inside of larger circle to create a hypocycloid",
    thumbnail: "/assets/demos/hypocycloid.png"
  },
  {
    title: "Estimating Pi using the Monte Carlo Method",
    slug: "estimating-pi-monte-carlo",
    category: "Maths",
    tags: ["numbers", "statistics", "pi", "probability", "monte carlo"],
    description: "How to estimate a value of Pi using the Monte Carlo method - generate a large number of random points and see how many fall in the circle enclosed by the unit square.",
    thumbnail: "/assets/demos/estimating-pi-monte-carlo.png"
  },
  {
    title: "Amplitude Modulation",
    slug: "amplitude-modulation",
    category: "Engineering",
    tags: ["signals", "waves", "sound", "modulation"],
    description: "An interactive demo which enables you to both see and hear the result of multiplying a sine wave with a cosine amplitude envelope.",
    thumbnail: "/assets/demos/amplitude-modulation.png",
    additionalCategories: ["Music", "Physics"],
    engineeringSubcategories: ["Signals"]
  },
  {
    title: "ROT-13 Encrypter/decrypter",
    slug: "rot-13-cipher",
    category: "Engineering",
    tags: ["computing", "cryptography", "cipher", "encryption"],
    description: "An online, interactive ROT-13 encrypter/decrypter",
    thumbnail: "/assets/demos/rot-13-cipher.png",
    engineeringSubcategories: ["Computing"]
  },
  {
    title: "Logic Gate Simulator",
    slug: "logic-gate-simulator",
    category: "Engineering",
    tags: ["electronics", "computing", "circuits"],
    description: "A free, simple, online logic gate simulator. Investigate the behaviour of AND, OR, NOT, NAND, NOR and XOR gates. Select gates from the dropdown list and click \"Add Node\" to add more gates. Drag from the hollow circles to the solid circles to make connections. See below for more detailed instructions.",
    thumbnail: "/assets/demos/logic-gate-simulator.png",
    engineeringSubcategories: ["Electronics"]
  },
  {
    title: "19 TET Keyboard",
    slug: "19-tet-keyboard",
    category: "Music",
    tags: ["pitch", "keyboard", "tuning", "temperament", "audio"],
    description: "An online interactive and playable 19 tone equal temperament keyboard.",
    thumbnail: "/assets/demos/19-tet-keyboard.png"
  },
  {
    title: "Flags of Europe",
    slug: "flags-of-europe",
    category: "Flashcards",
    tags: ["flags", "europe", "flashcards"],
    description: "Learn the flags of Europe with these flashcards.",
    thumbnail: "/assets/demos/flags-of-europe.png"
  },
  {
    title: "US States Map Flashcards",
    slug: "us-states",
    category: "Flashcards",
    tags: ["states", "maps", "usa", "flashcards"],
    description: "Learn the capitals of Europe with these flashcards.",
    thumbnail: "/assets/demos/us-states-map.png"
  }
];

export function getCategoryPath(category: RoutedCategory) {
  return categoryRoutes.find((route) => route.label === category)?.path ?? "/demos";
}

export function isDemoInCategory(demo: DemoItem, category: RoutedCategory) {
  return demo.category === category || demo.additionalCategories?.includes(category) === true;
}
