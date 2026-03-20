export type SubjectState = "approved" | "regularized" | "available" | "blocked";

export interface NucleusConfig {
  id: string;
  label: string;
  minRequired: number | null;
  accent: string;
  accentSoft: string;
  icon: string;
}

export interface Prerequisites {
  regularized: string[];
  approved: string[];
}

export interface Subject {
  id: string;
  name: string;
  weeklyHours: number;
  totalHours: number;
  credits: number;
  nucleusId: string;
  prerequisites: Prerequisites;
}

export interface ApprovedSubject {
  id: string;
  grade: number | null;
  status?: "approved" | "regularized";
}

export interface CareerPlan {
  id: string;
  name: string;
  nuclei: NucleusConfig[];
  subjects: Subject[];
}

const ICON_CYCLE = [
  "BookOpen",
  "GraduationCap",
  "Sparkles",
  "Languages",
  "Puzzle",
  "Trophy",
];

export function getIconForIndex(idx: number): string {
  return ICON_CYCLE[idx % ICON_CYCLE.length];
}

function makeUTNFRBASubjects(): Subject[] {
  const s = (id: string, name: string, wh: number, th: number, cr: number, nuc: string, reqs: { r?: string[], a?: string[] } = {}): Subject => ({
    id, name, weeklyHours: wh, totalHours: th, credits: cr, nucleusId: nuc, prerequisites: { regularized: reqs.r || [], approved: reqs.a || [] },
  });

  return [
    // Primer Año
    s("am1", "Análisis Matemático I", 5, 160, 10, "1"),
    s("aga", "Álgebra y Geometría Analítica", 5, 160, 10, "1"),
    s("f1", "Física I", 5, 160, 10, "1"),
    s("ing1", "Inglés I", 2, 64, 4, "1"),
    s("led", "Lógica y Estructuras Discretas", 3, 96, 6, "1"),
    s("ayed", "Algoritmos y Estructuras de Datos", 5, 160, 10, "1"),
    s("adc", "Arquitectura de Computadoras", 4, 128, 8, "1"),
    s("spn", "Sistemas y Procesos de Negocio", 3, 96, 6, "1"),

    // Segundo Año
    s("am2", "Análisis Matemático II", 5, 160, 10, "2", { r: ["am1", "aga"] }),
    s("f2", "Física II", 5, 160, 10, "2", { r: ["am1", "f1"] }),
    s("is", "Ingeniería y Sociedad", 2, 64, 4, "2"),
    s("ing2", "Inglés II", 2, 64, 4, "2", { r: ["ing1"] }),
    s("ssl", "Sintaxis y Semántica de los Lenguajes", 4, 128, 8, "2", { r: ["led", "ayed"] }),
    s("pdp", "Paradigmas de Programación", 4, 128, 8, "2", { r: ["led", "ayed"] }),
    s("so", "Sistemas Operativos", 4, 128, 8, "2", { r: ["adc"] }),
    s("asi", "Análisis de Sistemas de Información", 6, 192, 12, "2", { r: ["ayed", "spn"] }),

    // Tercer Año
    s("pye", "Probabilidad y Estadística", 3, 96, 6, "3", { r: ["am1", "aga"] }),
    s("eco", "Economía", 3, 96, 6, "3", { a: ["am1", "aga"] }),
    s("bd", "Bases de Datos", 4, 128, 8, "3", { r: ["ssl", "asi"], a: ["led", "ayed"] }),
    s("dds", "Desarrollo de Software", 4, 128, 8, "3", { r: ["pdp", "asi"], a: ["led", "ayed"] }),
    s("cd", "Comunicación de Datos", 3, 96, 6, "3", { a: ["f1", "adc"] }),
    s("an", "Análisis Numérico", 3, 96, 6, "3", { r: ["am2"], a: ["am1", "aga"] }),
    s("dsi", "Diseño de Sistemas de Información", 6, 192, 12, "3", { r: ["pdp", "asi"], a: ["ing1", "ayed", "spn"] }),

    // Cuarto Año
    s("leg", "Legislación", 2, 64, 4, "4", { r: ["is"] }),
    s("ics", "Ingeniería y Calidad de Software", 4, 128, 8, "4", { r: ["bd", "dds", "dsi"], a: ["ssl", "pdp"] }),
    s("rd", "Redes de Datos", 3, 96, 6, "4", { r: ["so", "cd"] }),
    s("io", "Investigación Operativa", 4, 128, 8, "4", { r: ["pye", "an"] }),
    s("sim", "Simulación", 4, 128, 8, "4", { r: ["pye"], a: ["am2"] }),
    s("tpa", "Tecnologías para la automatización", 3, 96, 6, "4", { r: ["f2", "an"], a: ["am2"] }),
    s("adsi", "Administración de Sistemas de Información", 6, 192, 12, "4", { r: ["eco", "dsi"], a: ["asi"] }),

    // Quinto Año
    s("ia", "Inteligencia Artificial", 3, 96, 6, "5", { r: ["sim"], a: ["pye", "an"] }),
    s("cdd", "Ciencia de Datos", 3, 96, 6, "5", { r: ["sim"], a: ["pye", "bd"] }),
    s("sdg", "Sistemas de Gestión", 4, 128, 8, "5", { r: ["eco", "io"], a: ["dsi"] }),
    s("gg", "Gestión Gerencial", 3, 96, 6, "5", { r: ["leg", "adsi"], a: ["eco"] }),
    s("ssi", "Seguridad en los Sistemas de Información", 3, 96, 6, "5", { r: ["rd", "adsi"], a: ["dds", "cd"] }),
    s("pf", "Proyecto Final", 6, 192, 12, "5", { r: ["ics", "rd", "adsi"], a: ["ing2", "dds", "dsi"] }),
    s("pps", "Práctica Profesional Supervisada", 0, 0, 0, "5", { r: ["ics", "rd", "adsi"], a: ["ing2", "dds", "dsi"] }),

    // Electivas
    s("ele1", "Administracion Estrategica del Capital Humano", 3, 96, 6, "electivas"),
    s("ele2", "Ciberseguridad", 3, 96, 6, "electivas"),
    s("ele3", "Comunicación gráfica y visual", 3, 96, 6, "electivas"),
    s("ele4", "Creatividad e Innovación", 3, 96, 6, "electivas"),
    s("ele5", "Criptografía", 3, 96, 6, "electivas"),
    s("ele6", "Experiencia de Usuario y Accesibilidad", 3, 96, 6, "electivas"),
    s("ele7", "Gerenciamiento de Proyectos de Sistemas de Informacion", 3, 96, 6, "electivas"),
    s("ele8", "Gestión del Talento Humano", 3, 96, 6, "electivas"),
    s("ele9", "Ingeniería de Requisitos", 3, 96, 6, "electivas"),
    s("ele10", "Metodología de Investigación Científico-Tecnológica", 3, 96, 6, "electivas"),
    s("ele11", "Metodología de la Conducción de Equipos de Trabajo", 3, 96, 6, "electivas"),
    s("ele12", "Patrones Algorítmicos", 3, 96, 6, "electivas"),
    s("ele13", "Procesamiento del lenguaje natural", 3, 96, 6, "electivas"),
    s("ele14", "Técnicas Avanzadas de Programación", 3, 96, 6, "electivas"),
  ];
}

export function getUTNFRBAPreset(): CareerPlan {
  return {
    id: "sistemas-utn-frba",
    name: "Ingeniería en Sistemas — UTN FRBA 2023",
    nuclei: [
      { id: "1", label: "Primer Año", minRequired: null, accent: "#818CF8", accentSoft: "#818CF814", icon: "BookOpen" },
      { id: "2", label: "Segundo Año", minRequired: null, accent: "#60A5FA", accentSoft: "#60A5FA14", icon: "GraduationCap" },
      { id: "3", label: "Tercer Año", minRequired: null, accent: "#A78BFA", accentSoft: "#A78BFA14", icon: "Sparkles" },
      { id: "4", label: "Cuarto Año", minRequired: null, accent: "#F472B6", accentSoft: "#F472B614", icon: "Trophy" },
      { id: "5", label: "Quinto Año", minRequired: null, accent: "#FB923C", accentSoft: "#FB923C14", icon: "Puzzle" },
      { id: "electivas", label: "Electivas", minRequired: 7, accent: "#34D399", accentSoft: "#34D39914", icon: "Languages" },
    ],
    subjects: makeUTNFRBASubjects(),
  };
}

