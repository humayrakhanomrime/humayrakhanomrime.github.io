import type { Profile, ResearchInterest } from "@/types";

export const profile: Profile = {
  name: "Humayra Khanom Rime",
  subtitle: "Graduate Student @ MTSU",
  location: "Murfreesboro, TN",
  image: "/prof_pic.jpeg",
  summary:
    "Graduate student in Engineering Technology at MTSU with peer-reviewed publications in graph models, attention mechanisms, and intelligent fault diagnosis.",
  bio: `I am a Master's student in Engineering Technology at <a href="https://www.mtsu.edu/" target="_blank" rel="noopener noreferrer">Middle Tennessee State University (MTSU)</a>. My research focuses on graph models, attention mechanisms, and intelligent fault diagnosis, with peer-reviewed publications across these areas.<br/><br/>Previously, I worked as a Junior AI Engineer at <a href="https://www.infinitibit.com" target="_blank" rel="noopener noreferrer">InfinitiBit</a>, designing memory architectures for the <a href="https://github.com/InfinitiBit/graphbit" target="_blank" rel="noopener noreferrer">GraphBit</a> agentic AI framework. I completed my B.Sc. in Computer Science &amp; Engineering from the <a href="https://ru.ac.bd/" target="_blank" rel="noopener noreferrer">University of Rajshahi</a>, Bangladesh, and have held research positions at <a href="https://elitelab.ai" target="_blank" rel="noopener noreferrer">ELITE Research Lab LLC</a> (NY, USA), <a href="https://www.hanyang.ac.kr/" target="_blank" rel="noopener noreferrer">Hanyang University</a> (Seoul, South Korea), and <a href="https://www.ubd.edu.bn/" target="_blank" rel="noopener noreferrer">Universiti Brunei Darussalam</a> (Gadong, Brunei).<br/><br/>📢 If you are interested in collaboration, please feel free to reach out via email.`,
  socials: [
    {
      platform: "email",
      url: "mailto:humayra.k.rime@ieee.org",
      label: "humayra.k.rime@ieee.org",
    },
    {
      platform: "github",
      url: "https://github.com/humayrakhanomrime",
      label: "h-k-r",
    },
    {
      platform: "scholar",
      url: "https://scholar.google.com/citations?user=VYSzUF8AAAAJ&hl=en",
      label: "Google Scholar",
    },
    {
      platform: "orcid",
      url: "https://orcid.org/0009-0009-3052-8336",
      label: "ORCID",
    },
    {
      platform: "linkedin",
      url: "https://www.linkedin.com/in/humayrakhanomrime/",
      label: "LinkedIn",
    },
  ],
};

export const researchInterests: ResearchInterest[] = [
  {
    title: "Deep Learning",
    description:
      "Neural architectures for real-world sensing and decision-making",
  },
  {
    title: "Graph Neural Networks",
    description: "Graph attention networks for fault diagnosis",
  },
  {
    title: "3D Image Analysis",
    description: "Hyperspectral image classification",
  },
  {
    title: "Fault Diagnosis",
    description: "Intelligent fault detection in photovoltaic systems",
  },
  {
    title: "Deep Generative Models",
    description: "Generative approaches for AI applications",
  },
];
