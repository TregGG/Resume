export const profile = {
  name: 'Aryan Jain',
  handle: 'TregGG',
  tagline: 'From logic gates to GPU compute.',
  role: 'Electronics & Communication Engineering · IIT Roorkee · Class of 2028',
  summary:
    'I build systems close to the metal: CPUs and VGA controllers on FPGAs, particle physics that never leaves the GPU, real-time systems that move real people, and the engines and tools on top of them.',
  emails: ['kkaryanjain@gmail.com', 'aryan_j@ece.iitr.ac.in'],
  links: [
    { label: 'GitHub', value: 'TregGG', href: 'https://github.com/TregGG' },
    { label: 'Codeforces', value: 'tregg', href: 'https://codeforces.com/profile/tregg' },
  ],
  stats: [
    { value: '20+', label: 'projects built' },
    { value: '5', label: 'engineering domains' },
    { value: '100K', label: 'particles on GPU' },
  ],
};

export const focusAreas = [
  {
    code: 'HW',
    title: 'Hardware & Architecture',
    text: 'SystemVerilog / Verilog cores on Cyclone IV, RISC-V, microcoded CPUs from raw gates.',
  },
  {
    code: 'GPU',
    title: 'Graphics & Simulation',
    text: 'OpenGL compute pipelines, N-body, SPH, boids, real-time audio-reactive rendering.',
  },
  {
    code: 'NET',
    title: 'Systems & Networking',
    text: 'Real-time dispatch and live tracking over WebSockets, geospatial queries, Dockerized deployment.',
  },
  {
    code: 'ML',
    title: 'ML & Vision',
    text: 'Streaming EEG inference, drone vision guidance, transformers from scratch.',
  },
  {
    code: 'ENG',
    title: 'Engines & Games',
    text: 'C++17 ECS engine with embedded Python scripting and a React visual editor.',
  },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: 'Hardware',
    items: ['SystemVerilog', 'Verilog', 'Quartus Prime', 'ModelSim', 'Icarus / GTKWave', 'Logisim', 'PlatformIO', 'CST Studio'],
  },
  {
    group: 'Graphics & Systems',
    items: ['C++17', 'OpenGL 4.3', 'GLSL Compute', 'CMake', 'Dear ImGui'],
  },
  {
    group: 'Backend & Web',
    items: ['Python', 'FastAPI', 'PostgreSQL', 'PostGIS', 'WebSockets', 'Docker', 'Azure', 'React'],
  },
  {
    group: 'ML & Vision',
    items: ['PyTorch', 'CUDA', 'OpenCV', 'MediaPipe', 'YOLO', 'scikit-learn', 'NumPy / SciPy'],
  },
  {
    group: 'Games',
    items: ['Unity / C#', 'AR Foundation', 'Godot / GDScript', 'ECS design', 'Embedded Python'],
  },
];

export const education = {
  school: 'Indian Institute of Technology Roorkee',
  degree: 'B.Tech, ECE',
  years: '2024–2028',
  status: 'Currently in 3rd year',
};

export const activities = [
  {
    title: 'Head of AR/VR',
    org: 'ArIES, IIT Roorkee',
    years: '2026 — Present',
  },
  {
    title: 'Volunteer, Women Empowerment',
    org: 'NSS IIT Roorkee',
    years: '2024 — 2025',
  },
];
