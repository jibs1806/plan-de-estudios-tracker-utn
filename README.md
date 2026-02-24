# Plan de Estudios Tracker
Live: https://plan-de-estudios-tracker.vercel.app/
App web para visualizar el avance de una carrera universitaria. La idea nació de necesitar algo más claro que una planilla de Excel para ver qué materias tengo aprobadas, cuáles puedo cursar y cuáles me faltan desbloquear.

Funciona con cualquier carrera — trae un preset de Lic. en Informática (UNQ) pero podés cargar el plan de tu universidad pegando la tabla directo desde la web.

## Qué hace

- Muestra todas las materias agrupadas por núcleo/ciclo, con su estado: **aprobada**, **habilitada** o **bloqueada**
- Calcula automáticamente qué materias podés cursar en base a las correlatividades
- Las correlativas se ven inline en cada card, con color diferenciado si ya las aprobaste o no
- Panel de estadísticas: progreso por núcleo, créditos, promedio
- Soporte para orientaciones (cuando el plan tiene ramas electivas)
- Importa materias aprobadas desde SIU Guaraní (copy-paste) o como lista simple
- Dark mode / light mode
- Todo se guarda en localStorage, no hay backend

## Stack

- **Next.js 14** (App Router)
- **React 18** + TypeScript
- **Tailwind CSS**
- **lucide-react** para iconos
- State management con Context + useReducer (sin dependencias externas)

## Setup

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Cómo cargar una carrera

Hay dos formas:

### 1. Preset

Al abrir la app sin datos, la pantalla de bienvenida ofrece pre cargar el plan de **Lic. en Informática — UNQ** con un click. Viene con 60 materias, 6 núcleos y todas las correlatividades ya configuradas.

### 2. Pegar desde la web de tu universidad

Desde el botón **Editar > Pegar plan de otra carrera**, pegás la tabla del plan de estudios tal cual la copiás de la web. El parser detecta automáticamente:

- **Núcleos/ciclos**: líneas que matchean patrones como `Núcleo de ...`, `Ciclo ...`, `Área de ...`, `Cursos Obligatorios ...`, `Cursos Electivos`
- **Header de columnas**: detecta columnas de créditos, horas semanales y horas totales
- **Materias**: filas con nombre + al menos un valor numérico (créditos, horas, etc.)
- **Orientaciones**: detecta `Cursos Orientados en/de ...` y te deja elegir cuál seguís
Ejemplo: https://www.unq.edu.ar/carrera/81-licenciatura-en-artes-digitales/
<img width="850" height="658" alt="Captura de pantalla 2026-02-24 a la(s) 12 21 04 p  m" src="https://github.com/user-attachments/assets/1a909c73-0f71-4aba-9031-a2f8f1115b41" />

#### Formato esperado

El input es texto plano, separado por tabs o múltiples espacios. Algo así:

```
Núcleo de Asignaturas Obligatorias
Curso	Créditos	Horas semanales	Hs. Totales
Matemática I	10	5 hs.	90 hs.
Introducción a la Programación	10	5 hs.	90 hs.
...

Núcleo de Asignaturas Optativas: 4 asignaturas
Curso	Créditos	Horas semanales	Hs. Totales
Redes Neuronales	8	4 hs.	64 hs.
...
```

Si el parser no detecta headers de columna, intenta adivinar qué es cada número por su magnitud (horas semanales suelen ser < 12, créditos < 30, horas totales > 30).

### Materias aprobadas

En el mismo flujo de importación, o después desde **Editar > Actualizar aprobadas**, podés:

- **Pegar desde SIU Guaraní (Reportes -> Historia académica)**: el formato típico de dos líneas por materia:
  ```
  Matemática I (01033)
  Regularidad - 7 (Siete) Aprobado 15/07/2024 - Detalle
  ```
  Detecta el código, nombre y nota automáticamente.
  Ejemplo: 
<img width="798" height="658" alt="Captura de pantalla 2026-02-24 a la(s) 12 20 39 p  m" src="https://github.com/user-attachments/assets/8030efc0-a4a6-4919-a2b5-a3e754984822" />

- **Lista simple**: una materia por línea o separadas por coma:
  ```
  Matemática I
  Introducción a la Programación
  Lógica y Programación
  ```

- **Marcar a mano**: en el panel de actualizar aprobadas, tocás cada materia para marcarla/desmarcarla y opcionalmente cargás la nota.

## Estructura del proyecto

```
app/
  layout.tsx          — layout root, fonts, favicon
  page.tsx            — página principal, header, providers
  globals.css         — tokens de tema, animaciones, estilos base

components/
  CurriculumBoard.tsx — grilla de materias por núcleo con filtros
  StatsPanel.tsx      — panel lateral/bottom sheet de estadísticas
  ImportModal.tsx     — modal de importación y gestión de aprobadas
  WelcomeScreen.tsx   — pantalla inicial cuando no hay plan cargado

lib/
  store.tsx           — estado global (Context + useReducer + localStorage)
  parser.ts           — parser de texto plano → plan de estudios
  utils.ts            — cálculo de estados, estadísticas, helpers
  theme.tsx           — provider de dark/light mode
  icons.tsx           — mapeo de nombres de ícono a componentes lucide

data/
  curriculum.ts       — tipos, preset de Informática UNQ
```

## Modelo de datos

```typescript
// Un plan de estudios completo
interface CareerPlan {
  id: string;
  name: string;
  nuclei: NucleusConfig[];   // agrupaciones (núcleos, ciclos, áreas)
  subjects: Subject[];       // todas las materias
}

// Cada núcleo/ciclo
interface NucleusConfig {
  id: string;
  label: string;
  minRequired: number | null; // null = todas obligatorias, número = mínimo requerido
  accent: string;             // color del núcleo (hex)
  accentSoft: string;         // color de fondo suave (hex8)
  icon: string;               // nombre del ícono lucide
}

// Cada materia
interface Subject {
  id: string;
  name: string;
  weeklyHours: number;
  totalHours: number;
  credits: number;
  nucleusId: string;          // a qué núcleo pertenece
  prerequisites: string[];    // IDs de materias correlativas
}

// Materia aprobada (lo que guarda el usuario)
interface ApprovedSubject {
  id: string;
  grade: number | null;       // nota, null si no la cargó
}
```

El estado de cada materia se calcula on-the-fly:
- **approved**: el ID está en la lista de aprobadas
- **available**: no está aprobada, pero todas sus correlativas sí
- **blocked**: le falta al menos una correlativa

---

Hecho por Magali Defelippe
