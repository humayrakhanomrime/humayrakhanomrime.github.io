import type {
  Education,
  Experience,
  SkillCategory,
  Collaborator,
} from "@/types";

export const education: Education[] = [
  {
    institution: "Middle Tennessee State University (MTSU)",
    location: "Murfreesboro, TN, USA",
    url: "https://www.mtsu.edu/",
    logo: "/logos/mtsu.png",
    degree: "M.S. in Engineering Technology",
    startYear: 2026,
    endYear: 0,
    score: "",
    courses: [
      "Methods of Research",
      "Model Optimization",
      "Advanced Machine Learning",
      "Applied Statistics",
      "Engineering Project Management",
      "Data-Driven Decision Making",
    ],
  },
  {
    institution: "University of Rajshahi",
    location: "Rajshahi, Bangladesh",
    url: "https://ru.ac.bd/",
    logo: "/logos/ru.png",
    degree: "B.Sc. in Computer Science & Engineering",
    startYear: 2019,
    endYear: 2024,
    score: "",
    courses: [
      "Artificial Intelligence",
      "Deep Learning",
      "Digital Image Processing",
      "Software Engineering",
      "Discrete Mathematics",
      "Digital System Design",
    ],
  },
];

export const experience: Experience[] = [
  {
    company: "InfinitiBit",
    position: "Junior AI Engineer",
    location: "Dhaka, Bangladesh (On-site)",
    startDate: "January 2025",
    endDate: "December 2025",
    summary:
      "Designed and implemented the memory mechanism for GraphBit, an agentic AI framework.",
    highlights: [
      "Architected a dual-layer memory system for context-aware agent behaviour",
      "Built a persistent memory layer backed by SQLite for long-term knowledge retention and retrieval across agent sessions",
      "Developed an in-memory storage layer for transient, session-scoped context, enabling low-latency access to short-lived working memory during agent reasoning",
    ],
    logo: "/logos/infinitibit.png",
    url: "https://github.com/InfinitiBit",
  },
  {
    company: "ELITE Research Lab LLC",
    position: "Research Associate",
    location: "NY, USA (Remote)",
    startDate: "February 2024",
    endDate: "December 2024",
    summary:
      "Developed transfer learning-based deep learning pipelines for medical image analysis.",
    highlights: [
      "Developed a transfer learning-based deep learning pipeline for automated melanoma classification from dermoscopic images",
      "Conducted extensive experiments across multiple transfer learning strategies and backbone networks under class-imbalanced conditions",
    ],
    logo: "/logos/elite.png",
    url: "https://elitelab.ai",
  },
  {
    company: "Hanyang University",
    position: "Computer Vision Intern",
    location: "Seoul, South Korea (Remote)",
    startDate: "October 2022",
    endDate: "March 2023",
    summary:
      "Researched self-supervised learning techniques for enhanced model performance.",
    highlights: [
      "Conducted extensive research on self-supervised learning and its impact on enhancing machine learning model performance",
      "Analyzed and evaluated the effectiveness of self-supervised learning techniques against state-of-the-art solutions",
    ],
    logo: "/logos/hanyang.png",
    url: "https://www.hanyang.ac.kr/",
  },
  {
    company: "Universiti Brunei Darussalam",
    position: "Research Intern",
    location: "Gadong, Brunei (Remote)",
    startDate: "April 2022",
    endDate: "September 2022",
    summary:
      "Initiated and completed a remote sensing research project published at a high-quality IEEE conference.",
    highlights: [
      "Initialized a remote sensing research project and completed and published it at a high-quality IEEE conference",
      "Performed comparative analysis of state-of-the-art remote sensing machine learning models",
    ],
    logo: "/logos/ubd.png",
    url: "https://www.ubd.edu.bn/",
  },
];

export const skills: SkillCategory[] = [
  { name: "Languages", keywords: ["Python", "C/C++", "SQL", "Matlab"] },
  {
    name: "ML / DL",
    keywords: ["PyTorch", "TensorFlow", "Keras", "Scikit-learn"],
  },
  {
    name: "Data & Visualization",
    keywords: ["NumPy", "Pandas", "Matplotlib", "Seaborn", "OpenCV"],
  },
  {
    name: "GNN / Graphs",
    keywords: ["PyTorch Geometric (PyG)", "DGL", "NetworkX"],
  },
  {
    name: "Tools & DevOps",
    keywords: ["Git", "Docker", "Linux", "Jupyter", "VS Code", "LaTeX"],
  },
  {
    name: "Cloud / MLOps",
    keywords: ["AWS (SageMaker, EC2)", "MLflow", "Weights & Biases"],
  },
];

export const collaborators: Collaborator[] = [
  { name: "Prof. Dr. Md. Jakir Hossen", institution: "Multimedia University" },
  { name: "Md Kishor Morol", institution: "Cornell University" },
  {
    name: "Ananta Bijoy Bhadra",
    institution: "Georgia Southern University",
  },
  {
    name: "Md. Alamgir Hossain",
    institution: "University of Tennessee",
  },
  {
    name: "Erphan A. Bhuiyan",
    institution: "University of Wisconsin",
  },
];

