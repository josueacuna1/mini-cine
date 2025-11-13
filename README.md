# Mini-Cine — Documentación Técnica
---
## Menú
- [Descripción general](#descripción-general)
- [Stack tecnológico](#stack-tecnológico)
- [Puesta en marcha](#puesta-en-marcha)
  - [Prerrequisitos](#prerrequisitos)
  - [Instalación y arranque](#instalación-y-arranque)
- [Estructura del proyecto](#estructura-del-proyecto)
  - [Arquitectura en Capas](#arquitectura-en-capas)
  - [Estructura de archivos](#estructura-de-archivos)
  - [Persistencia de información](#persistencia-de-información)
    - [Datos guardados](#datos-guardados)
    - [Uso en en mini-cine](#uso-en-mini-cine)
- [Estilos y diseño](#estilos-y-diseño)
  - [Tipografía](#tipografía)
  - [Paleta y variables](#paleta-y-variables)
  - [Bloques y espaciados](#bloques-y-espaciados)
- [Lógica de reglas de Negocio](#lógica-de-reglas-de-negocio)
  - [Integración](#integración-allts-y-runnerts)
  - [Rango horario permitido](#rango-horario-permitido-time-windowts)
  - [Empalme de funciones](#empalme-de-funciones-overlapts)
  - [Tiempo de limpieza](#tiempo-de-limpieza-constantsts)
  - [Películas largas](#películas-largas-long-moviests)
  - [Funciones SPECIAL](#funciones-special-specialts)
  - [Estrenos PREMIERE](#estrenos-premiere-premierets)
  - [Alta demanda](#alta-demanda-high-demandts)
  - [Ventana diaria](#ventana-diaria-time-windowts--useschedulemetrics)
---

## Descripción general

Mini-Cine es una aplicación web desarrollada con React y TypeScript, diseñada para facilitar la planificación, gestión y análisis de funciones de cine durante una semana completa.

El sistema integra de forma clara y accesible tres módulos principales:

- **Catálogo de películas**: consulta de títulos disponibles, filtros por tipo, clasificación, demanda y atributos relevantes.

- **Planificador de funciones**: herramienta interactiva para asignar películas a salas, horarios y días específicos, con validaciones automáticas basadas en reglas de negocio.

- **Dashboard**: visualización de métricas como ocupación, capacidad estimada, minutos utilizados, tiempos muertos y tendencias semanales.

La interfaz está orientada a la usabilidad, con una experiencia fluida que permite a los usuarios operar de manera intuitiva, gracias a:
- *Navegación* clara y modular
- *Retroalimentación* visual inmediata
- *Validaciones* en tiempo real mediante reglas configurables
- *Diseño* con enfoque en legibilidad y accesibilidad

Además, el sistema implementa un motor de reglas que garantiza la coherencia entre horarios, salas y restricciones operativas, asegurando que se cumplan las políticas del cine como horarios válidos, tiempo de limpieza, manejo de estrenos, funciones especiales, etc.

---

## Stack tecnológico

| Tecnología | Uso |
|-------------|----------------|
| **React,  TypeScript** | Renderizado de vistas y componentes tipados. |
| **Vite** | Entorno de desarrollo y bundler. |
| **CSS Modules / Custom CSS** | Estilización modular, temas y variables. |
| **Hooks personalizados (React)** | Lógica reutilizable de almacenamiento, métricas y reglas. |
| **LocalStorage** | Persistencia de informacion. |
| **ESM Modules** | Importaciones modernas y consistentes. |

---


## Puesta en marcha

### Prerrequisitos
- Node.js ≥ 18
- npm o yarn

### Instalación y arranque
```bash
# Clonar el repositorio
git clone https://github.com/josueacuna1/mini-cine.git

# Entrar a la carpeta 
cd mini-cine

# Instalar dependencias
npm install

# Ejecutar en modo desarrllo
npm run dev

# Abrir en navegador:
http://localhost:5173

# Build de producción
npm run build
npm run preview

```

## Estructura del proyecto

### Arquitectura en Capas

| **Capa** | **Propósito** |
| --- | --- |
| **app** | Punto de entrada y composición de la app. |
| **views** | Vistas de la app. |
| **components** | Conjunto de componentes reutilizables que se usan en las vistas |
| **data** | Insumos de información para el funcionamiento de la app. |
| **hooks** | Gestionan la lógica de negocio, validaciones, métricas y persistencia. |
| **domain** | Núcleo del negocio: tipos, reglas, constantes y adaptadores de datos. |
| **utils** | Funciones utilitarias sin dependencias del estado ni del DOM. |
| **styles** | Hojas de estilo globales y variables CSS. |


### Estructura de archivos
```bash
public/
└── mini-cine.ico
src/
├── app/            # Entrada principal y composición de la App
│   ├── App.tsx             # Componente raíz que gestiona las vistas
│   └── main.tsx            # Punto de arranque
│
├── assets/
│   └── react.svg
│
├── components/     # Componentes reutilizables por módulo
│   ├── catalog/            # Módulo de Catálogo de películas
│   │   ├── MovieFilters.tsx
│   │   ├── MovieList.tsx
│   │   └── catalog.css
│   │
│   ├── planner/    # Módulo de planificación de funciones
│   │   ├── CreateScreeningForm.tsx
│   │   ├── DayScheduleList.tsx
│   │   ├── DaySelector.tsx
│   │   ├── RoomSelector.tsx
│   │   ├── MoviePicker.tsx
│   │   ├── TimePicker.tsx
│   │   ├── ValidationAlerts.tsx
│   │   ├── planner.css
│   │   └── planner.tsx
│   │
│   ├── dashboard/  # Módulo analítico (dashboard)
│   │   ├── DaySummaryGrid.tsx
│   │   ├── RoomSummaryCard.tsx
│   │   ├── WeeklyMetricLineChart.tsx
│   │   └── dashboard.css
│   │
│   └── layout/     # Estructura visual global
│       ├── Navbar.tsx
│       └── navbar.css
│
├── data/           # Datos base y simulados
│   ├── movies.json
│   ├── screens.json
│   └── seed.ts
│
├── domain/         # Lógica de negocio y reglas
│   ├── types.ts
│   ├── constants.ts
│   ├── adapters.ts
│   └── rules/              # Motor de validación de reglas de programación
│       ├── index.ts
│       ├── runner.ts
│       ├── all.ts
│       ├── overlap.ts
│       ├── high-demand.ts
│       ├── premiere.ts
│       ├── long-movie.ts
│       ├── time-window.ts
│       └── special.ts
│
├── hooks/          # Lógica reusable entre vistas
│   ├── useLocalStorage.ts
│   ├── useScheduleMetrics.ts
│   └── useScheduleRules.ts

├── utils/          # Utilidades independientes
│   └── timeUtils.ts
│
├── styles/         # Estilos globales y variables
│   ├── variables.css
│   ├── index.css
│   └── transitions.css
│
└── views/          # Páginas principales
    ├── CatalogView.tsx
    ├── PlannerView.tsx
    └── DashboardView.tsx
```

### Persistencia de información

La app utiliza `localStorage` para **guardar la planificación semanal** de forma automática.  

Por lo tanto, aunque se cierre o recargue la página, los horarios, salas y funciones se mantienen intactos.

El uso de localStorage:
- **Lee** el valor inicial desde *localStorage* usando la clave indicada.
- Si **no** existe, **guarda initialValue** como punto de partida.
- Retorna un estado reactivo ([value, setValue]) igual que useState.
- Cada vez que value cambia, el hook sincroniza automáticamente el nuevo valor en localStorage.

#### Datos guardados

**Clave**: `bd-mini-cine`
**Valor**: un objeto serializado con:
```json
{
  "movies": [...],
  "rooms": [...],
  "screenings": [...]
}
```



#### Uso en mini-cine

El hook `useLocalStorage`:

- Carga el valor guardado en `localStorage` al iniciar.
- Si no existe, usa un valor inicial.
- Cada vez que el estado cambia, se guarda automáticamente en `localStorage`.

Ejemplo dentro de mini-cine:

```ts
const [weekPlan, setWeekPlan] =
  useLocalStorage<WeekPlan>('bd-mini-cine', initialWeekPlan);
```
---

## Estilos y diseño

La interfaz de **Mini-Cine** fue diseñada bajo una estética moderna, cálida y profesional. Combina colores cálidos con contrastes fríos para mantener un equilibrio.

### Tipografía

| Tipo | Fuente | Peso | Uso |
|------|---------|------|-----|
| **Primaria** | *Century Gothic*| 600 / 700 | Textos, títulos, botones |
| **Secundaria** | *Montserrat* | Regular | Compatibilidad general |

#### Estilo general
```css
:root { 
  --ff: "Century Gothic", 
        "CenturyGothic", 
        "URW Gothic", 
        "Gothic A1", 
        Montserrat, 
        system-ui, 
        -apple-system, 
        "Segoe UI", 
        Arial, sans-serif;
  }

body {
  font-family: var(--ff);
  font-size: 16px;
  line-height: 1.55;
  letter-spacing: .2px;
}

h1, h2, h3 { font-weight: 700; letter-spacing: .3px; }
h4, h5, h6 { font-weight: 600; }
```
#### Paleta y variables
```css
:root {
  --bg: #282b31;
  --surface: #121418;
  --card: #1A1D22;
  --divider: #262A33;
  --text: #EAECEE;
  --text-2: #B8C0CC;
  --text-muted: #8A93A3;
  --teal-700: #074F57;
  --teal-500: #0FA3B1;
  --teal-200: #A9E5D9;
  --sand-200: #EED9A7;
  --amber-500: #F4A300;
  --amber-700: #CB6A00;
  --success: #3BB273;
  --warning: var(--amber-500);
  --error: #E45050;
  --info: var(--teal-500);
  --ring: rgba(15,163,177,0.35);
  --hover: rgba(255,255,255,.06);
  --press: rgba(255,255,255,.1);
  --ff: "Century Gothic", "CenturyGothic", "URW Gothic", "Gothic A1", Montserrat, system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
  --radius-lg: 18px;
  --radius-md: 12px;
  --radius-sm: 8px;
  --shadow-1: 0 6px 18px rgba(0,0,0,.25);
}
```

| Variable | Uso |
| --- | --- |
| `--bg` | Fondo de página |
| `--surface` | Contenedores secundarios |
| `--card` | Tarjetas / paneles principales |
| `--divider` | Bordes y separadores |
| `--text` | Texto principal |
| `--text-2` | Texto secundario |
| `--text-muted` | Notas, hints, etiquetas |
| `--teal-500/200` | Enlaces, énfasis, estados informativos |
| `--amber-500/700` | Botones primarios, acentos cálidos |
| `--success` | Estados “OK” |
| `--warning` | Advertencias |
| `--error` | Errores |
| `--ring` | Halo de foco |
| `--hover/press` | Estados hover/active |
| `--radius-*` | Esquinas redondeadas |
| `--shadow-1` | Elevación sutil |

#### Bloques y espaciados

| Elemento | Padding / Gap | Radio | Sombra |
| -- | --- | --- | --- |
| Cards / paneles | `1rem` | `--radius-lg` | `--shadow-1` |
| Botones | `.6rem 1rem` | `--radius-lg` | — |
| Inputs / selects | `.55rem .7rem` | `--radius-md`  | halo en focus |
| Listas / grids | `gap: 12–24px` | según contexto | — |

----

## Lógica de Reglas de Negocio

Cada regla dentro de `domain/rules` implementa una función del tipo:

```ts
export type RuleFn = (context: {
  weekPlan: WeekPlan;
  movie: Movie;
  proposal: Screening;
  room: Room;
}) => ValidationResult[];
```
El runner (`runner.ts`) ejecuta todas las reglas registradas en `all.ts`
y devuelve un `ERROR` o advertencias `WARN` para mostrarlas en el componente `ValidationAlerts`.

### Integración (all.ts y runner.ts)
`all.ts` registra todas las reglas activas.
`runner.ts` las ejecuta de forma secuencial y agrupa resultados.

```ts
export const allRules = [
  timeWindowRule,
  overlapRule,
  longMovieRule,
  highDemandRule,
  specialRule,
  premiereRules,
];
```

---

### Rango horario permitido (time-window.ts)
Condición: Las funciones deben comenzar entre 10:00 y 23:59 hrs.
Tipo: `ERROR`.

Ejemplo:
09:30 → `ERROR`- `La hora debe estar entre 10:00 y 23:59.`
22:45 → `OK`

---

### Empalme de funciones (overlap.ts)
Condición: No puede haber funciones empalmadas en la misma sala incluyendo en ese periodo el tiempo de limpieza dependiendo de la sala.
Tipo:  `ERROR`.

Ejemplo:
14:00–16:00 y 15:45 → `ERROR`- `Empalme con función existente a las 14:00 hrs en la Sala 1`

---

### Tiempo de limpieza (constants.ts)
Condición: Se agrega tiempo adicional después de cada función segun el tipo de sala:
- SMALL → 15 min
- MEDIUM → 15 min
- LARGE → 20 min

Regla automática.

---

### Películas largas (long-movie.ts)
Condición: Duración > 150 min no permitida en sala SMALL.
Tipo:  `ERROR`.

Ejemplo:
pelicula: 160min + sala SMALL → `ERROR` - `Las películas de más de 150 min no pueden programarse en sala chica.`

---

### Funciones SPECIAL (special.ts)
Condición: Solo pueden programarse funciones de tipo **SPECIAL** de viernes a domingo.
Tipo:  `ERROR`.

Ejemplo:
Martes + SPECIAL → `ERROR`- `Las funciones SPECIAL sólo pueden programarse de viernes a domingo.`

---

### Estrenos PREMIERE (premiere.ts)
Condición: Las peliculas tipo **PREMIERE** deben estrenarse los dias **Jueves** con al menos dos funciones y ser tipo **PREMIERE**.
Tipo: `WARN`.

Ejemplo:
Jueves + 0 funciones → `WARN` - `Se deben agendar 2 horarios por tratarse de un estreno en la categoría PREMIERE. El formulario te pedirá dos horarios.`
Jueves + 1 función → `WARN` - `Jueves (PREMIERE): ya tienes una función, agrega una segunda para cumplir el requisito.`
Jueves + 2 funciones → `OK`

---

### Alta demanda (high-demand.ts)
Condición: Si demandScore ≥ 70, la primera función debe iniciar antes de 14:00.
Tipo: `ERROR`.

Ejemplo:
15:00 → `ERROR` - `Alta demanda (≥70): la primera función del día debe iniciar antes de las 14:00.`
13:00 → `OK`

---

### Ventana diaria (time-window.ts + useScheduleMetrics)
Condición: Para el **dashboard**, los minutos libres/ocupados solo se contabilizan dentro del rango del día, comprendiendo 10:00–24:00.

Funciones fuera de rango no afectan los cálculos de tiempo libre.
