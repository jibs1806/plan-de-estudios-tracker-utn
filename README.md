# Plan de Estudios Tracker - UTN FRBA (Sistemas K23)

Adaptación local de una app web para visualizar el avance del plan de estudios de la carrera **Ingeniería en Sistemas de Información (Plan K23)** de la **UTN FRBA**. 

Este repositorio tiene configurada esta carrera por defecto. Está pensado simplemente para ser clonado y ejecutado en un entorno local, para que puedas llevar en tu propia computadora un control claro sobre qué materias tenés aprobadas, cuáles podés cursar y cuáles te faltan desbloquear.

## Qué hace

- Muestra todas las materias agrupadas por nivel, con su estado actual: **aprobada**, **habilitada** o **bloqueada**.
- Calcula automáticamente qué materias podés cursar en base a las correlatividades del Plan K23.
- Las correlativas de cada materia se ven inline en las cards, destacando con distinto color si ya las aprobaste o no.
- Panel de visualización de estadísticas de avance (créditos, materias totales, promedio, etc.).
- Dark mode / light mode.
- Todo se guarda en `localStorage`; tus datos quedan 100% en tu navegador y no hay ningún backend de por medio.

## Instalación y Uso Local

Al estar destinado a un uso personal, los pasos a seguir son:

1. Clonar el repositorio en tu computadora:
   ```bash
   git clone <url-del-repo>
   cd plan-de-estudios-tracker-utn
   ```

2. Instalar las dependencias de Node.js:
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

Luego, abrí `http://localhost:3000` en tu navegador para empezar a marcar tu progreso.

## Cómo cargar tus materias aprobadas

Dentro de la aplicación, en el apartado **Editar > Actualizar aprobadas**, tenés varias opciones para poblar tu historia académica:

- **Pegar desde el SIU Guaraní (Reportes -> Historia académica)**: con el formato típico de dos líneas por materia que trae el SIU. El sistema detecta el código, nombre y nota de manera automática.
- **Lista simple**: una materia por línea o separadas por comas.
- **Manual**: tocando individualmente cada bloque de materia para marcarla/desmarcarla y (opcionalmente) guardando la calificación obtenida.

## Stack Tecnológico

- **Next.js 14** (App Router)
- **React 18** + TypeScript
- **Tailwind CSS**
- **lucide-react** para iconos
- Gestión de estado interna (Context + useReducer) 

---

## Créditos

Este repositorio es una bifurcación/modificación de la aplicación base. 

Todo el mérito por la interfaz original, el parser de materias base y el código estructural del proyecto le corresponde a su creadora original: **Magali Defelippe**.
