/**
 * labsData — InnoSpeak Labs: 7 learning areas + project-based curriculum.
 *
 * Labs courses are also present in programmeData.js COURSES array
 * (with pillar: 'labs') so that routing, admissions, favourites and
 * course details continue to work. This file adds the Schools
 * metadata and the project-based curriculum entries that describe
 * what learners actually build in each school.
 */

export const LAB_SCHOOLS = [
  {
    id: 'school-ai',
    title: 'Digital Intelligence',
    icon: 'Brain',
    description:
      'Build intelligent systems — from RAG pipelines and AI agents to multimodal applications — using LangChain, LangGraph, MCP and modern LLM APIs.',
    technologies: ['LangChain', 'LangGraph', 'MCP', 'RAG', 'OpenAI API', 'Anthropic API', 'Vector Databases', 'Python', 'Hugging Face', 'CrewAI', 'AutoGen', 'Semantic Kernel', 'Whisper', 'PyTorch', 'TensorFlow'],
    tracks: ['AI Foundations', 'Generative AI', 'AI Agents', 'Agentic Workflows', 'Multi-Agent Systems', 'MCP', 'RAG Systems', 'NLP', 'Computer Vision', 'Reinforcement Learning', 'Deep Learning', 'AI for Industry', 'AI Ethics'],
  },
  {
    id: 'school-software-engineering',
    title: 'Software & Digital Systems',
    icon: 'Code',
    description:
      'Design, build and ship production software — from full-stack web apps to mobile applications and well-architected APIs.',
    technologies: ['React', 'Node.js', 'TypeScript', 'Python', 'Go', 'Rust', 'C++', 'PostgreSQL', 'Docker', 'REST', 'GraphQL', 'Swift', 'Kotlin', 'Electron'],
    tracks: ['Frontend Development', 'Backend Development', 'Full-Stack Development', 'Mobile Development', 'Desktop Applications', 'System Design', 'Software Architecture', 'Microservices', 'API Design', 'Design Patterns', 'Clean Architecture', 'Testing', 'Agile & Scrum', 'Security'],
  },
  {
    id: 'school-cloud-devops',
    title: 'Cloud, Infrastructure & DevOps',
    icon: 'Cloud',
    description:
      'Architect and operate cloud infrastructure — from CI/CD pipelines to Kubernetes clusters and infrastructure as code.',
    technologies: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'GitHub Actions', 'GitLab CI', 'Linux', 'Nginx', 'Prometheus', 'Grafana', 'ELK Stack'],
    tracks: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Serverless', 'DevSecOps', 'Cloud Security', 'Monitoring & Observability', 'Infrastructure as Code', 'Site Reliability Engineering', 'Chaos Engineering'],
  },
  {
    id: 'school-cybersecurity',
    title: 'Cybersecurity & Digital Safety',
    icon: 'ShieldCheck',
    description:
      'Learn to defend and attack systems ethically — from penetration testing to security operations and threat hunting.',
    technologies: ['Kali Linux', 'Wireshark', 'Metasploit', 'Burp Suite', 'Splunk', 'Microsoft Sentinel', 'Python', 'Nmap', 'OWASP', 'YARA', 'Ghidra', 'IDA Pro', 'Frida', 'MITRE ATT&CK'],
    tracks: ['SOC', 'Blue Team', 'Red Team', 'Penetration Testing', 'Bug Bounty', 'Malware Analysis', 'Reverse Engineering', 'Digital Forensics', 'Cloud Security', 'Zero Trust', 'Threat Hunting', 'SIEM', 'Network Security', 'Cryptography'],
  },
  {
    id: 'school-data-science',
    title: 'Data, Analytics & Intelligent Systems',
    icon: 'BarChart3',
    description:
      'Turn raw data into insight — from data pipelines and analytics dashboards to deployed machine learning models.',
    technologies: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'SQL', 'Tableau', 'Power BI', 'Spark', 'Airflow', 'dbt', 'D3.js', 'Plotly', 'Excel'],
    tracks: ['Python for Data Science', 'Statistics', 'Machine Learning', 'Deep Learning', 'Big Data', 'Data Engineering', 'Data Warehousing', 'Business Intelligence', 'Predictive Analytics', 'NLP', 'Computer Vision', 'Data Visualization', 'MLOps', 'Data Governance'],
  },
  {
    id: 'school-engineering-innovation',
    title: 'Engineering, Automation & Innovation',
    icon: 'Cog',
    description:
      'Build physical and embedded systems — from robotics and IoT smart farms to renewable energy and embedded hardware.',
    technologies: ['Arduino', 'Raspberry Pi', 'ROS', 'ROS2', 'PLC', 'AutoCAD', 'SolidWorks', '3D Printing', 'Sensors', 'Microcontrollers', 'ESP32', 'STM32', 'Drone SDKs', 'SCADA', 'MPPT Controllers'],
    tracks: ['Robotics', 'IoT & Smart Agriculture', 'Renewable Energy', 'Embedded Systems', 'Drone Technology', 'Smart Grids', 'Electric Vehicles', 'Digital Twin', 'Edge Computing', 'Smart Cities', 'Industrial AI', 'CAM'],
  },
  {
    id: 'school-creative-ai-immersive',
    title: 'Creative Technology & Immersive Media',
    icon: 'Sparkles',
    description:
      'Create at the intersection of AI and media — from AR/VR experiences in Unreal Engine to AI-generated art and 3D worlds.',
    technologies: ['Unreal Engine', 'Unity', 'Blender', 'Midjourney', 'Adobe Firefly', 'Runway', 'After Effects', 'AR/VR', 'XR', '3D Modeling', 'Motion Capture', 'Suno', 'Stable Diffusion'],
    tracks: ['AI Art & Design', '3D Modelling', 'Blender', 'Unreal Engine', 'Unity', 'AR Development', 'VR Development', 'XR Development', 'Motion Capture', 'Virtual Production', 'AI Music', 'AI Animation', 'Game Development', 'Game Design', 'Immersive Storytelling'],
  },
];

export const LAB_PROJECTS = [
  // ── Digital Intelligence ──────────────────────
  {
    id: 'ai-rag',
    schoolId: 'school-ai',
    track: 'AI Foundations',
    title: 'RAG Knowledge Assistant',
    description: 'Build a retrieval-augmented generation system that answers questions from a custom document corpus using vector embeddings and LLM APIs.',
    technologies: ['LangChain', 'Vector DB', 'OpenAI API', 'Python'],
    duration: '6 Weeks',
    deliverable: 'A working RAG application with a document upload interface',
    prerequisites: ['Python programming', 'Basic understanding of APIs'],
  },
  {
    id: 'ai-agents',
    schoolId: 'school-ai',
    track: 'AI Agents',
    title: 'Autonomous AI Agent with LangGraph',
    description: 'Design and build a multi-step AI agent using LangGraph that can plan, use tools and complete complex tasks autonomously.',
    technologies: ['LangGraph', 'LangChain', 'MCP', 'Python'],
    duration: '8 Weeks',
    deliverable: 'A deployed AI agent with tool-use capabilities',
    prerequisites: ['Python programming', 'Completion of RAG project or equivalent'],
  },
  {
    id: 'ai-mcp-server',
    schoolId: 'school-ai',
    track: 'AI Automation',
    title: 'MCP Server Implementation',
    description: 'Build and deploy a Model Context Protocol server that connects AI models to external tools and data sources securely.',
    technologies: ['MCP', 'TypeScript', 'Node.js', 'API Design'],
    duration: '4 Weeks',
    deliverable: 'A working MCP server with documentation',
    prerequisites: ['TypeScript/JavaScript', 'API design fundamentals'],
  },
  {
    id: 'ai-multimodal',
    schoolId: 'school-ai',
    track: 'Multimodal AI',
    title: 'Multimodal AI Application',
    description: 'Build an application that processes text, images and audio simultaneously using multimodal LLMs and vision models.',
    technologies: ['GPT-4 Vision', 'Whisper', 'Python', 'React'],
    duration: '6 Weeks',
    deliverable: 'A multimodal AI app with a web interface',
    prerequisites: ['Python programming', 'Basic React knowledge'],
  },

  // ── Software & Digital Systems ───────────────────────────
  {
    id: 'se-fullstack',
    schoolId: 'school-software-engineering',
    track: 'Full-Stack Development',
    title: 'Full-Stack Web Application',
    description: 'Design, build and deploy a production-grade full-stack web application with authentication, database and API.',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    duration: '10 Weeks',
    deliverable: 'A deployed full-stack application with CI/CD',
    prerequisites: ['JavaScript proficiency', 'Basic database knowledge'],
  },
  {
    id: 'se-api-design',
    schoolId: 'school-software-engineering',
    track: 'API Design',
    title: 'Production-Grade REST & GraphQL API',
    description: 'Design, build and document a scalable API with authentication, rate limiting, testing and OpenAPI documentation.',
    technologies: ['Node.js', 'GraphQL', 'PostgreSQL', 'Swagger'],
    duration: '6 Weeks',
    deliverable: 'A deployed API with full documentation',
    prerequisites: ['JavaScript/TypeScript', 'Basic database knowledge'],
  },
  {
    id: 'se-mobile',
    schoolId: 'school-software-engineering',
    track: 'Mobile Development',
    title: 'Cross-Platform Mobile App',
    description: 'Build and publish a cross-platform mobile application with offline support, push notifications and backend integration.',
    technologies: ['React Native', 'Expo', 'Firebase', 'TypeScript'],
    duration: '8 Weeks',
    deliverable: 'A published mobile app on iOS and Android',
    prerequisites: ['React knowledge', 'JavaScript proficiency'],
  },
  {
    id: 'se-devops-pipeline',
    schoolId: 'school-software-engineering',
    track: 'DevOps Pipelines',
    title: 'DevOps Pipeline from Scratch',
    description: 'Set up a complete CI/CD pipeline with automated testing, building, containerisation and deployment.',
    technologies: ['GitHub Actions', 'Docker', 'AWS', 'Terraform'],
    duration: '6 Weeks',
    deliverable: 'A fully automated deployment pipeline',
    prerequisites: ['Git proficiency', 'Basic cloud knowledge'],
  },

  // ── Cloud, Infrastructure & DevOps ────────────────────────────────
  {
    id: 'cloud-infra',
    schoolId: 'school-cloud-devops',
    track: 'Cloud Infrastructure',
    title: 'Cloud Infrastructure Architecture',
    description: 'Architect and deploy a multi-tier cloud infrastructure with networking, security groups and load balancing.',
    technologies: ['AWS', 'Terraform', 'VPC', 'RDS'],
    duration: '8 Weeks',
    deliverable: 'A reproducible cloud infrastructure deployment',
    prerequisites: ['Linux fundamentals', 'Networking basics'],
  },
  {
    id: 'cloud-k8s',
    schoolId: 'school-cloud-devops',
    track: 'Container Orchestration',
    title: 'Kubernetes Cluster Deployment',
    description: 'Deploy and manage a Kubernetes cluster with multiple services, auto-scaling and monitoring.',
    technologies: ['Kubernetes', 'Docker', 'Helm', 'Prometheus'],
    duration: '6 Weeks',
    deliverable: 'A running K8s cluster with deployed services',
    prerequisites: ['Docker proficiency', 'Linux fundamentals'],
  },
  {
    id: 'cloud-iac',
    schoolId: 'school-cloud-devops',
    track: 'Infrastructure as Code',
    title: 'Infrastructure as Code with Terraform',
    description: 'Build reproducible, version-controlled infrastructure using Terraform modules and CI/CD integration.',
    technologies: ['Terraform', 'AWS', 'GitHub Actions', 'Ansible'],
    duration: '6 Weeks',
    deliverable: 'A modular Terraform codebase with CI/CD',
    prerequisites: ['Cloud basics', 'YAML/Git proficiency'],
  },

  // ── Cybersecurity & Digital Safety ──────────────────────────────────
  {
    id: 'sec-pentest',
    schoolId: 'school-cybersecurity',
    track: 'Penetration Testing',
    title: 'Penetration Testing Lab',
    description: 'Conduct a full penetration test on a purpose-built vulnerable system, from reconnaissance to exploitation and reporting.',
    technologies: ['Kali Linux', 'Metasploit', 'Nmap', 'Burp Suite'],
    duration: '8 Weeks',
    deliverable: 'A professional penetration test report',
    prerequisites: ['Networking fundamentals', 'Linux basics'],
  },
  {
    id: 'sec-soc',
    schoolId: 'school-cybersecurity',
    track: 'Security Operations',
    title: 'Security Operations Centre',
    description: 'Set up and operate a SIEM-based security operations centre with log collection, alerting and incident response.',
    technologies: ['Splunk', 'SIEM', 'Python', 'Log Analysis'],
    duration: '6 Weeks',
    deliverable: 'A functional SOC dashboard with alert rules',
    prerequisites: ['Networking fundamentals', 'Basic scripting'],
  },
  {
    id: 'sec-threat-hunt',
    schoolId: 'school-cybersecurity',
    track: 'Threat Hunting',
    title: 'Threat Hunting Exercise',
    description: 'Learn to proactively hunt for threats in enterprise environments using IOC analysis, threat intelligence and behavioral detection.',
    technologies: ['YARA', 'MITRE ATT&CK', 'Python', 'SIEM'],
    duration: '6 Weeks',
    deliverable: 'A threat hunt report with detection rules',
    prerequisites: ['Security fundamentals', 'Scripting basics'],
  },

  // ── Data, Analytics & Intelligent Systems ───────────────────────
  {
    id: 'ds-pipeline',
    schoolId: 'school-data-science',
    track: 'Data Engineering',
    title: 'End-to-End Data Pipeline',
    description: 'Build a production data pipeline from ingestion through transformation to visualisation using modern data stack tools.',
    technologies: ['Python', 'Apache Airflow', 'dbt', 'PostgreSQL', 'Metabase'],
    duration: '8 Weeks',
    deliverable: 'A running data pipeline with dashboard',
    prerequisites: ['Python proficiency', 'SQL fundamentals'],
  },
  {
    id: 'ds-ml-deploy',
    schoolId: 'school-data-science',
    track: 'ML Model Deployment',
    title: 'ML Model Training & Deployment',
    description: 'Train, evaluate and deploy a machine learning model as a scalable API service with monitoring and A/B testing.',
    technologies: ['Scikit-learn', 'TensorFlow', 'Docker', 'FastAPI'],
    duration: '8 Weeks',
    deliverable: 'A deployed ML model with API and monitoring',
    prerequisites: ['Python proficiency', 'ML fundamentals'],
  },
  {
    id: 'ds-dashboard',
    schoolId: 'school-data-science',
    track: 'Analytics Dashboards',
    title: 'Analytics Dashboard Project',
    description: 'Build an interactive analytics dashboard that connects to a real data source and provides actionable business insights.',
    technologies: ['Tableau', 'Python', 'SQL', 'Pandas'],
    duration: '6 Weeks',
    deliverable: 'A published interactive dashboard',
    prerequisites: ['SQL fundamentals', 'Data visualisation basics'],
  },

  // ── Engineering, Automation & Innovation ───────────────────────
  {
    id: 'eng-robotics',
    schoolId: 'school-engineering-innovation',
    track: 'Robotics',
    title: 'Autonomous Robot Build',
    description: 'Design, build and program an autonomous robot using ROS, sensors and microcontrollers to complete a navigation challenge.',
    technologies: ['ROS', 'Raspberry Pi', 'Arduino', 'Python', 'Sensors'],
    duration: '10 Weeks',
    deliverable: 'A working autonomous robot with demo',
    prerequisites: ['Python programming', 'Basic electronics'],
  },
  {
    id: 'eng-iot-farm',
    schoolId: 'school-engineering-innovation',
    track: 'IoT & Smart Agriculture',
    title: 'IoT Smart Farm System',
    description: 'Build an IoT-based smart agriculture system with soil sensors, automated irrigation and remote monitoring.',
    technologies: ['ESP32', 'MQTT', 'Sensors', 'Cloud IoT', 'Mobile App'],
    duration: '8 Weeks',
    deliverable: 'A working IoT smart farm prototype',
    prerequisites: ['Basic electronics', 'Programming fundamentals'],
  },
  {
    id: 'eng-renewable',
    schoolId: 'school-engineering-innovation',
    track: 'Renewable Energy',
    title: 'Solar Power System Design',
    description: 'Design, size and build a small-scale solar power system with battery storage and monitoring dashboard.',
    technologies: ['Solar Panels', 'MPPT Controller', 'Battery Bank', 'IoT Monitoring'],
    duration: '8 Weeks',
    deliverable: 'A working solar power system prototype',
    prerequisites: ['Electrical fundamentals', 'Basic electronics'],
  },
  {
    id: 'eng-embedded',
    schoolId: 'school-engineering-innovation',
    track: 'Embedded Systems',
    title: 'Embedded Systems Project',
    description: 'Design and build an embedded system with microcontroller, sensors, actuators and real-time firmware for a specific application.',
    technologies: ['STM32', 'C/C++', 'RTOS', 'PCB Design', 'Sensors'],
    duration: '8 Weeks',
    deliverable: 'A working embedded system prototype',
    prerequisites: ['C programming', 'Digital electronics basics'],
  },

  // ── Creative Technology & Immersive Media ──────────────────
  {
    id: 'ci-arvr',
    schoolId: 'school-creative-ai-immersive',
    track: 'AR/VR Development',
    title: 'AR/VR Experience in Unreal Engine',
    description: 'Build an immersive AR or VR experience using Unreal Engine with interactive 3D content and user interaction.',
    technologies: ['Unreal Engine', 'C++', 'Blueprints', 'AR Kit'],
    duration: '10 Weeks',
    deliverable: 'A published AR/VR experience',
    prerequisites: ['3D basics', 'Programming fundamentals'],
  },
  {
    id: 'ci-ai-art',
    schoolId: 'school-creative-ai-immersive',
    track: 'AI Art & Design',
    title: 'AI-Generated Art Collection',
    description: 'Create a curated collection of AI-generated artwork using Midjourney, Adobe Firefly and Stable Diffusion, with a public exhibition.',
    technologies: ['Midjourney', 'Adobe Firefly', 'Stable Diffusion', 'Photoshop'],
    duration: '6 Weeks',
    deliverable: 'A published AI art collection with artist statement',
    prerequisites: ['Creative interest', 'Basic digital tools familiarity'],
  },
  {
    id: 'ci-3d-motion',
    schoolId: 'school-creative-ai-immersive',
    track: '3D & Motion Graphics',
    title: '3D Animated Short with Blender',
    description: 'Create a 3D animated short film using Blender, covering modeling, rigging, animation, lighting and rendering.',
    technologies: ['Blender', 'After Effects', 'Premiere Pro', 'Cycles Render'],
    duration: '10 Weeks',
    deliverable: 'A rendered 3D animated short film',
    prerequisites: ['Creative interest', 'Basic computer graphics familiarity'],
  },
];

// ── Helper functions ──────────────────────────────────────────

export function getLabSchools() {
  return LAB_SCHOOLS;
}

export function getLabSchoolById(id) {
  return LAB_SCHOOLS.find((s) => s.id === id);
}

export function getLabProjectsBySchool(schoolId) {
  return LAB_PROJECTS.filter((p) => p.schoolId === schoolId);
}

export function getLabProjects() {
  return LAB_PROJECTS;
}
