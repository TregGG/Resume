export type Category = 'Hardware' | 'Graphics' | 'Systems' | 'ML / Vision' | 'Games';

export interface HeroProject {
  id: string;
  title: string;
  codename?: string;
  category: Category;
  blurb: string;
  metrics: { value: string; label: string }[];
  bullets: string[];
  stack: string[];
  repo?: string;
}

export interface MinorProject {
  title: string;
  text: string;
  stack: string[];
  repo?: string;
}

const gh = (r: string) => `https://github.com/TregGG/${r}`;

export const heroProjects: HeroProject[] = [
  {
    id: 'swirlynight',
    title: 'Zero-CPU Particle Physics',
    codename: 'Swirlynight',
    category: 'Graphics',
    blurb: '100,000+ interactive particles simulated entirely on the GPU. The CPU sends only ~8 bytes of mouse data per frame.',
    metrics: [
      { value: '100K+', label: 'particles' },
      { value: '~8 B', label: 'CPU → GPU / frame' },
      { value: '5', label: 'physics models' },
    ],
    bullets: [
      'Ping-pong SSBOs double-buffer state so parallel workgroups never race.',
      'Zero-copy pipeline: the compute output SSBO is bound directly as the VBO for rasterization.',
      'O(N²) N-body and SPH fluid accelerated with shared-memory tiling; also boids, slime mold and predator-prey.',
      'JSON registry hot-swaps compute pipelines, tuned live in Dear ImGui.',
    ],
    stack: ['C++17', 'OpenGL 4.3', 'GLSL Compute', 'GLFW', 'ImGui', 'CMake'],
    repo: gh('Swirlynight'),
  },
  {
    id: 'gpuga',
    title: 'FPGA GPU & VGA Controller',
    codename: 'GPUGA',
    category: 'Hardware',
    blurb: 'A synthesizable VGA graphics core for the Altera DE0-Nano, driving a custom resistor-ladder DAC.',
    metrics: [
      { value: '640×480', label: '@ 60 Hz' },
      { value: '25.175', label: 'MHz pixel clock' },
      { value: '4,096', label: 'colors' },
    ],
    bullets: [
      'PLL derives the 25.175 MHz pixel clock from the 50 MHz onboard oscillator.',
      'Sync/blanking state machine for standard 640×480 @ 60 Hz timing.',
      'Custom 12-bit R-2R ladder DAC (4-bit R/G/B) driven over GPIO headers.',
      'Test-pattern generator, modular testbenches and SDC timing constraints.',
    ],
    stack: ['SystemVerilog', 'Cyclone IV', 'Quartus Prime', 'ModelSim', 'SDC'],
    repo: gh('GPUGA'),
  },
  {
    id: 'erick',
    title: 'Campus Rick — Smart Transit',
    codename: 'ERICK',
    category: 'Systems',
    blurb: 'Booking, real-time dispatch and live tracking for the IIT Roorkee campus e-rickshaw network.',
    metrics: [
      { value: '3', label: 'real-time PWAs' },
      { value: 'Live', label: 'GPS over WebSockets' },
      { value: 'PostGIS', label: 'geo engine' },
    ],
    bullets: [
      'Passenger app, driver app and admin dispatch console, all real-time PWAs.',
      'Geospatial queries in PostGIS over OpenStreetMap campus geometry.',
      'Event-driven WebSocket protocol for driver GPS, booking lifecycle and fleet state.',
      'Docker Compose, watchdog scripts and Azure deployment.',
    ],
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'PostGIS', 'WebSockets', 'Docker', 'Azure'],
    repo: gh('ERICK'),
  },
  {
    id: 'eeg',
    title: 'Driver Drowsiness from EEG',
    category: 'ML / Vision',
    blurb: 'End-to-end streaming ML: a simulated 30-channel, 128 Hz EEG headset scored live by an interpretable CNN.',
    metrics: [
      { value: '73.4%', label: 'LOSO accuracy' },
      { value: '0.828', label: 'AUC' },
      { value: '30 ch', label: '@ 128 Hz' },
    ],
    bullets: [
      'InterpretableCNN with depthwise-separable and pointwise convolutions for spatio-temporal features.',
      'Leave-one-subject-out evaluation on the Figshare dataset (11 subjects, 2,022 epochs); 84.6% on the demo subject.',
      'Replaced batch-only BatchNorm with running statistics so single epochs can be scored in a stream.',
      'FastAPI WebSocket backend streams 3 s epochs to a Chart.js dashboard with a rolling alert engine.',
    ],
    stack: ['PyTorch', 'FastAPI', 'WebSockets', 'SciPy', 'Chart.js'],
  },
  {
    id: 'shawnty',
    title: 'ShawntyEngine',
    category: 'Games',
    blurb: 'A 2D multiplayer game engine with a strict split between game logic, physics and OpenGL rendering.',
    metrics: [
      { value: 'ECS', label: 'architecture' },
      { value: 'Python', label: 'gameplay scripting' },
      { value: 'Hot', label: 'reload editor' },
    ],
    bullets: [
      'Entity-Component System composing Transform, Rigidbody and Sprite components.',
      'Embedded Python scripting for gameplay without recompiling the C++ core.',
      'React + FastAPI visual web editor: drag-and-drop scenes, assets, hot reload into the running game.',
      'Client-server state replication built into the engine foundation.',
    ],
    stack: ['C++17', 'OpenGL', 'Python', 'React', 'FastAPI', 'WebSockets'],
    repo: gh('ShawntyEngine'),
  },
];

export const archive: { category: Category; projects: MinorProject[] }[] = [
  {
    category: 'Hardware',
    projects: [
      {
        title: 'RV32I Single-Cycle Core',
        text: 'Full RV32I (R/I/S/B/U/J) in Verilog: ALU, decoder, immediate gen, 32×32 register file, memory bus. Python assembler and prime-number testbenches.',
        stack: ['Verilog', 'iverilog', 'Python'],
      },
      {
        title: '16-bit Computer, OS & Tetris',
        text: 'A microcoded 16-bit CPU from logic gates in Logisim, its own ISA and two-pass assembler, an assembly OS with TTY driver, and Tetris running on it.',
        stack: ['Logisim', 'Microcode', 'Assembly', 'Python'],
      },
      {
        title: 'ESP32 GPS Tracker',
        text: 'PlatformIO firmware with TinyGPSPlus, Wi-Fi SoftAP and WebSocket telemetry streaming to a laptop server.',
        stack: ['C++', 'ESP32', 'WebSockets'],
      },
      {
        title: 'RF & Digital Coursework',
        text: 'PCB high-frequency signal receiver (ECC-203), CST Studio RF antenna simulation, and a 24-hour digital stopwatch state machine.',
        stack: ['PCB', 'CST Studio', 'Digital logic'],
      },
    ],
  },
  {
    category: 'Graphics',
    projects: [
      {
        title: 'PulseTropia',
        text: 'Real-time 3D audio visualizer: terrain mesh deformed by FFT frequency bands, a minimp3 audio compiler, free-flight camera and HUD.',
        stack: ['C++', 'OpenGL', 'SDL2', 'KISS FFT'],
        repo: gh('PulseTropia'),
      },
      {
        title: 'NeonBuzz',
        text: 'Turns photos into neon contour art: Canny, bilateral filtering, Zhang-Suen thinning, tangent-following brush strokes, K-Means color grouping.',
        stack: ['C++17', 'OpenGL', 'OpenCV'],
        repo: gh('NeonBuzz'),
      },
      {
        title: 'PixelPaint',
        text: '2D sprite renderer with modular camera, texture management and lighting shaders.',
        stack: ['C++', 'OpenGL'],
      },
      {
        title: 'LiveScanViewer',
        text: '3D point-cloud and mesh renderer with physical camera tracking and grid projection.',
        stack: ['C++', 'OpenGL'],
      },
    ],
  },
  {
    category: 'ML / Vision',
    projects: [
      {
        title: 'Aerothon Drone Vision',
        text: 'QR target registration and drop-zone matching on a Jetson Nano, emitting normalized ΔX/ΔY offsets for the flight controller PID loop.',
        stack: ['Python', 'OpenCV', 'Jetson Nano'],
      },
      {
        title: 'Air Canvas',
        text: '21-landmark hand tracking turns gestures into drawing commands, streamed over TCP to decoupled renderers.',
        stack: ['Python', 'MediaPipe', 'OpenCV'],
      },
      {
        title: 'NanoGPT',
        text: 'Character-level GPT from scratch: multi-head self-attention, causal masking, positional embeddings, residual blocks.',
        stack: ['PyTorch', 'CUDA'],
      },
    ],
  },
  {
    category: 'Games',
    projects: [
      {
        title: 'cppataria',
        text: '2D multiplayer desktop game in modern C++ on the Walnut framework.',
        stack: ['C++', 'Walnut'],
        repo: gh('cppataria'),
      },
      {
        title: 'keriso',
        text: '2D pixel-art action combat game inspired by Sekiro.',
        stack: ['Godot', 'GDScript'],
        repo: gh('keriso'),
      },
      {
        title: 'penpineapple',
        text: '2D physics platformer.',
        stack: ['Godot 4'],
      },
    ],
  },
];
