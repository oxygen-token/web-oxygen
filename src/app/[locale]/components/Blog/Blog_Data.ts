export interface Blog_Post_Data {
  id: string;
  image: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  views: number;
  comments: number;
  likes: number;
  slug: string;
}

export const blog_Posts: Blog_Post_Data[] = [
  {
    id: "1",
    image: "/assets/images/forest.jpg",
    title: "Lorem Ipsum Dolor Sit Amet",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    author: "Admin",
    date: "May 16, 2023",
    readTime: "1 min read",
    views: 0,
    comments: 0,
    likes: 1,
    slug: "lorem-ipsum-dolor-sit-amet",
  },
  {
    id: "2",
    image: "/assets/images/forestHD.jpg",
    title: "Consectetur Adipiscing Elit",
    excerpt: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    author: "Admin",
    date: "May 16, 2023",
    readTime: "1 min read",
    views: 0,
    comments: 0,
    likes: 0,
    slug: "consectetur-adipiscing-elit",
  },
  {
    id: "3",
    image: "/assets/images/imgTrees.jpg",
    title: "Sed Do Eiusmod Tempor Incididunt",
    excerpt: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    author: "Oxygen Team",
    date: "December 15, 2024",
    readTime: "3 min read",
    views: 1250,
    comments: 8,
    likes: 45,
    slug: "sed-do-eiusmod-tempor-incididunt",
  },
  {
    id: "4",
    image: "/assets/images/tierra.png",
    title: "Ut Enim Ad Minim Veniam",
    excerpt: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    author: "Oxygen Team",
    date: "December 10, 2024",
    readTime: "5 min read",
    views: 2100,
    comments: 12,
    likes: 67,
    slug: "ut-enim-ad-minim-veniam",
  },
];
