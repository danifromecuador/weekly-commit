import type { DayId } from "@/lib/weekly-grid/types";
import type { Locale } from "@/lib/i18n";

type Messages = {
  appTitle: string;
  appSubtitle: string;
  controls: {
    switchToLightMode: string;
    switchToDarkMode: string;
    lightMode: string;
    darkMode: string;
    chooseColorTheme: string;
    theme: string;
    switchLanguageToEnglish: string;
    switchLanguageToSpanish: string;
    languageLabel: string;
  };
  grid: {
    goal: string;
    timeShort: string;
    duration: string;
    total: string;
    totals: string;
    /** Empty grid: short line before the add CTA */
    noActivities: string;
    /** Empty grid: label on the primary add button */
    addGoal: string;
    addActivity: string;
    addGoalNameFirst: string;
    activityName: string;
    removeActivity: string;
    removeThisGoalQuestion: string;
    removeNamedGoalSuffix: string;
    removeUnnamedRow: string;
    cancel: string;
    remove: string;
    setGoalNameAndDurationFirst: string;
    completedSuffix: string;
    selectDuration: string;
    durationPerSession: string;
    /** Drag handle in Goal column to reorder rows */
    dragReorderGoal: string;
  };
  dayLabels: Record<DayId, string>;
  dayInitials: Record<DayId, string>;
  footer: {
    by: string;
    streaks: string;
    plannywise: string;
    linkedInAria: string;
    streaksAria: string;
    plannywiseAria: string;
    relatedAppsNavAria: string;
  };
};

const EN_MESSAGES: Messages = {
  appTitle: "Weekly Commit",
  appSubtitle: "Achieve your goals one week at a time",
  controls: {
    switchToLightMode: "Switch to light mode",
    switchToDarkMode: "Switch to dark mode",
    lightMode: "Light mode",
    darkMode: "Dark mode",
    chooseColorTheme: "Choose color theme",
    theme: "Theme",
    switchLanguageToEnglish: "Switch language to English",
    switchLanguageToSpanish: "Switch language to Spanish",
    languageLabel: "Language",
  },
  grid: {
    goal: "Goal",
    timeShort: "Time",
    duration: "Duration",
    total: "Total",
    totals: "Totals",
    noActivities: "No activities yet.",
    addGoal: "Add",
    addActivity: "Add activity",
    addGoalNameFirst: "Add a goal name to every row first",
    activityName: "Activity name",
    removeActivity: "Remove activity",
    removeThisGoalQuestion: "Remove this goal?",
    removeNamedGoalSuffix: "will be removed. This cannot be undone.",
    removeUnnamedRow: "This row will be removed. This cannot be undone.",
    cancel: "Cancel",
    remove: "Remove",
    setGoalNameAndDurationFirst: "Set a goal name and duration first",
    completedSuffix: "completed",
    selectDuration: "Select",
    durationPerSession: "Duration per session",
    dragReorderGoal: "Drag to reorder goal",
  },
  dayLabels: {
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
  },
  dayInitials: {
    mon: "M",
    tue: "T",
    wed: "W",
    thu: "T",
    fri: "F",
    sat: "S",
  },
  footer: {
    by: "By",
    streaks: "Streaks",
    plannywise: "Plannywise",
    linkedInAria: "Dani Dev on LinkedIn",
    streaksAria: "Streaks — open productivity app",
    plannywiseAria: "Plannywise — open productivity app",
    relatedAppsNavAria: "More productivity apps by Dani Dev",
  },
};

const ES_MESSAGES: Messages = {
  appTitle: "Compromiso Semanal",
  appSubtitle: "Alcanza tus metas una semana a la vez",
  controls: {
    switchToLightMode: "Cambiar a modo claro",
    switchToDarkMode: "Cambiar a modo oscuro",
    lightMode: "Modo claro",
    darkMode: "Modo oscuro",
    chooseColorTheme: "Elegir tema de color",
    theme: "Tema",
    switchLanguageToEnglish: "Cambiar idioma a inglés",
    switchLanguageToSpanish: "Cambiar idioma a español",
    languageLabel: "Idioma",
  },
  grid: {
    goal: "Meta",
    timeShort: "Tiempo",
    duration: "Duración",
    total: "Total",
    totals: "Totales",
    noActivities: "Aún no hay actividades.",
    addGoal: "Agregar",
    addActivity: "Agregar actividad",
    addGoalNameFirst: "Primero agrega un nombre de meta a cada fila",
    activityName: "Nombre de actividad",
    removeActivity: "Eliminar actividad",
    removeThisGoalQuestion: "¿Eliminar esta meta?",
    removeNamedGoalSuffix: "será eliminada. Esta acción no se puede deshacer.",
    removeUnnamedRow: "Esta fila será eliminada. Esta acción no se puede deshacer.",
    cancel: "Cancelar",
    remove: "Eliminar",
    setGoalNameAndDurationFirst: "Primero define nombre de meta y duración",
    completedSuffix: "completado",
    selectDuration: "Elegir",
    durationPerSession: "Duración por sesión",
    dragReorderGoal: "Arrastrar para reordenar la meta",
  },
  dayLabels: {
    mon: "Lunes",
    tue: "Martes",
    wed: "Miércoles",
    thu: "Jueves",
    fri: "Viernes",
    sat: "Sábado",
  },
  dayInitials: {
    mon: "L",
    tue: "M",
    wed: "X",
    thu: "J",
    fri: "V",
    sat: "S",
  },
  footer: {
    by: "Por",
    streaks: "Streaks",
    plannywise: "Plannywise",
    linkedInAria: "Dani Dev en LinkedIn",
    streaksAria: "Streaks — abrir app de productividad",
    plannywiseAria: "Plannywise — abrir app de productividad",
    relatedAppsNavAria: "Más apps de productividad de Dani Dev",
  },
};

export function getMessages(locale: Locale): Messages {
  return locale === "es" ? ES_MESSAGES : EN_MESSAGES;
}

