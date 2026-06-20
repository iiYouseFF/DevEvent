export interface Event {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
  description: string;
}

export const events: Event[] = [
  {
    slug: "nextjs-conf-2026",
    title: "Next.js Conf 2026",
    image: "/images/event1.png",
    location: "San Francisco, CA & Online",
    date: "October 24, 2026",
    time: "09:00 AM - 05:00 PM EST",
    description: "Join the Next.js community to learn about the future of the web, new framework features, and hands-on sessions with Next.js Core team members."
  },
  {
    slug: "react-summit-us",
    title: "React Summit US",
    image: "/images/event2.png",
    location: "New York, NY",
    date: "November 12, 2026",
    time: "10:00 AM - 06:00 PM EST",
    description: "The biggest React conference in the US bringing together authors, core contributors, and enthusiasts to discuss React Server Components, state management, and tooling."
  },
  {
    slug: "global-ai-hackathon",
    title: "Global AI Hackathon",
    image: "/images/event3.png",
    location: "London, UK & Hybrid",
    date: "December 05, 2026",
    time: "Starts at 08:00 AM UTC",
    description: "A 48-hour challenge bringing developers together to build next-generation applications using Large Language Models, generative agents, and vector databases."
  },
  {
    slug: "tailwind-design-workshop",
    title: "Tailwind CSS Design Patterns",
    image: "/images/event4.png",
    location: "Online (Zoom)",
    date: "July 18, 2026",
    time: "02:00 PM - 05:00 PM CEST",
    description: "Master Tailwind CSS v4 design workflows, fluid typography, theme variables, and crafting high-fidelity design systems directly within your CSS files."
  },
  {
    slug: "web3-builders-meetup",
    title: "Web3 Builders Meetup",
    image: "/images/event5.png",
    location: "Berlin, Germany",
    date: "September 08, 2026",
    time: "06:00 PM - 09:30 PM CET",
    description: "Connect with smart contract developers, blockchain architects, and decentralized app designers in an evening filled with technical lightning talks and networking."
  },
  {
    slug: "serverless-days-tokyo",
    title: "ServerlessDays Tokyo",
    image: "/images/event6.png",
    location: "Tokyo, Japan & Online",
    date: "August 15, 2026",
    time: "09:30 AM - 06:00 PM JST",
    description: "A developer-led conference focusing on real-world experiences with serverless architectures, edge computing, cold start optimizations, and cost-effective scaling."
  }
];
