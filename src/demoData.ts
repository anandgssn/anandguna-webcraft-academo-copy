export type DemoCategory = "All" | "Engineering" | "Flashcards" | "Maths" | "Music" | "Physics";

export type RoutedCategory = Exclude<DemoCategory, "All">;

export type DemoItem = {
  title: string;
  slug: string;
  category: RoutedCategory;
  tags: string[];
  description: string;
  thumbnail: string;
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
    title: "3D Vector Plotter",
    slug: "3d-vector-plotter",
    category: "Maths",
    tags: ["vectors", "geometry", "graphing"],
    description: "An interactive plot of 3D vectors. See how two vectors are related to their resultant, difference and cross product.",
    thumbnail: "/assets/demos/3d-vector-plotter.png"
  },
  {
    title: "Logic Gate Simulator",
    slug: "logic-gate-simulator",
    category: "Engineering",
    tags: ["electronics", "computing", "circuits"],
    description: "A free, simple, online logic gate simulator. Investigate the behaviour of AND, OR, NOT, NAND, NOR and XOR gates. Select gates from the dropdown list and click \"Add Node\" to add more gates. Drag from the hollow circles to the solid circles to make connections. See below for more detailed instructions.",
    thumbnail: "/assets/demos/logic-gate-simulator.png"
  },
  {
    title: "19 TET Keyboard",
    slug: "19-tet-keyboard",
    category: "Music",
    tags: ["pitch", "keyboard", "tuning"],
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
  }
];

export function getCategoryPath(category: RoutedCategory) {
  return categoryRoutes.find((route) => route.label === category)?.path ?? "/demos";
}
