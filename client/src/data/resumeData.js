const resumeData = {
  personal: {
    name: "Aditya Raj Khandal",
    firstName: "aditya",
    phone: "+91 9460668897",
    location: "Jaipur, Rajasthan, India",
    email: "er.adityarajkhandal@gmail.com",
    github: "https://github.com/adityarajkhandal",
    linkedin: "https://linkedin.com/in/adityarajkhandal",
    tagline: "Aspiring Software Engineer with strong foundations in Java, Data Structures & Algorithms, SQL, and AI-driven development.",
    bio: "I am currently pursuing my Master's in Computer Applications at BIT Mesra, Ranchi. Previously, I interned as an AI Automation Intern at Appsavio, where I integrated advanced AI models into enterprise systems. I'm passionate about building scalable solutions and exploring the intersection of AI and software engineering.",
    hobbies: "In my free time, I enjoy exploring new AI tools, contributing to open source, and building side projects. I'm always up for learning something new."
  },

  education: [
    {
      degree: "Master of Computer Applications (MCA)",
      institution: "BIT Mesra, Ranchi",
      period: "2025 – 2027",
      details: "Key Subjects: Data Structures, Object-Oriented Programming, DBMS, Operating Systems"
    },
    {
      degree: "Bachelor of Computer Applications (BCA)",
      institution: "BIT Mesra, Jaipur Campus",
      period: "2022 – 2025",
      details: "Relevant Coursework: C, C++, Java, SQL, Web Technologies, Software Engineering"
    }
  ],

  skills: {
    languages: ["C", "C++", "Java"],
    web: ["HTML", "CSS", "JavaScript", "ReactJS", "NodeJS", "REST APIs"],
    databases: ["MySQL", "MongoDB"],
    tools: ["Git", "GitHub", "VS Code", "Docker"],
    concepts: ["Data Structures", "Algorithms", "OOP", "DBMS"],
    ai: ["LLMs", "RAG", "LangChain"]
  },

  // Flat list for the "about" section tech grid
  featuredSkills: [
    "Java",
    "JavaScript",
    "ReactJS",
    "NodeJS",
    "C++",
    "MongoDB"
  ],

  experience: [
    {
      id: "appsavio",
      company: "Appsavio",
      role: "AI Automation Intern",
      companyHighlight: "Appsavio",
      location: "Jaipur, Rajasthan",
      period: "MAY 2026 – JULY 2026",
      bullets: [
        "AI Integration & Automation: Spearheaded the integration of advanced AI models into Salesforce CRM to automate complex business workflows and enhance system capabilities",
        "Intelligent Agent Development: Designed and deployed custom AI agents within the Salesforce ecosystem to streamline data processing, automate repetitive tasks, and improve overall operational efficiency"
      ]
    }
  ],

  projects: [
    {
      title: "REWEAR — Thrift Store",
      description: "Designed and built a responsive landing page for a peer-to-peer secondhand fashion marketplace enabling users to buy and sell pre-owned clothing.",
      longDescription: "A full-stack peer-to-peer secondhand fashion marketplace enabling users to buy and sell pre-owned clothing. Features a conversion-focused hero section with clear CTAs and trust-building elements, plus a clean navigation system with login/signup flows and a browse catalog structure.",
      tech: ["React.js", "Node.js", "MongoDB", "Express.js", "CSS"],
      github: "https://github.com/adityarajkhandal",
      live: "#",
      featured: true
    },
    {
      title: "Perplexity Clone — AI Research Assistant",
      description: "A Perplexity-inspired AI search and chat application that combines web search with AI to provide users with fast, contextual and source-backed answers.",
      longDescription: "Built an AI-powered research assistant with real-time query processing, retrieval-based search. Combines web search with AI to provide users with fast, contextual and source-backed answers using RAG architecture.",
      tech: ["React.js", "Node.js", "Python", "LangChain", "LLMs", "REST APIs"],
      github: "https://github.com/adityarajkhandal",
      live: "#",
      featured: true
    }
  ],

  certifications: [
    "Oracle OCI AI Foundations Certification",
    "JPMorgan Chase & Co. — Software Engineering Virtual Experience Program"
  ],

  navLinks: [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" }
  ]
};

export default resumeData;
