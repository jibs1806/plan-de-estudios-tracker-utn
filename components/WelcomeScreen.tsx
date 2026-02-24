"use client";

import { useState } from "react";
import { GraduationCap, FileText, ChevronRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { getInformaticaPreset } from "@/data/curriculum";

interface WelcomeScreenProps {
  onImportCustom: () => void;
  onPresetLoaded: () => void;
}

export default function WelcomeScreen({ onImportCustom, onPresetLoaded }: WelcomeScreenProps) {
  const { loadPreset } = useStore();
  const [loadingPreset, setLoadingPreset] = useState(false);

  const handleLoadPreset = () => {
    setLoadingPreset(true);
    setTimeout(() => {
      loadPreset(getInformaticaPreset(), []);
      onPresetLoaded();
    }, 350);
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
      <div
        className={`w-full max-w-md transition-all duration-500 ${
          loadingPreset ? "opacity-0 scale-95 translate-y-4" : "opacity-100 scale-100"
        }`}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-th-surface border border-th-border mb-5"
            style={{ boxShadow: "var(--th-shadow-md)" }}>
            <GraduationCap size={26} strokeWidth={1.5} className="text-th-ink-2" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-th-ink tracking-tight">
            Plan de Estudios
          </h1>
          <p className="text-sm text-th-ink-3 font-body mt-2 max-w-xs mx-auto leading-relaxed">
            Visualiza tu progreso, materias aprobadas y las que podes cursar.
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {/* Preset option */}
          <button
            onClick={handleLoadPreset}
            disabled={loadingPreset}
            className="group w-full text-left rounded-2xl bg-th-surface border border-th-border
                       hover:border-th-border-em transition-all duration-200 overflow-hidden
                       disabled:pointer-events-none"
            style={{ boxShadow: "var(--th-shadow-sm)" }}
          >
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-500/[0.08] flex items-center justify-center shrink-0
                                group-hover:scale-105 transition-transform duration-200">
                  <GraduationCap size={22} color="#818CF8" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-[15px] font-semibold text-th-ink tracking-tight">
                    Lic. Informatica — UNQ
                  </p>
                  <p className="text-xs text-th-ink-3 font-body mt-1 leading-relaxed">
                    Plan pre-configurado con 60 materias y correlatividades
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                      60 materias
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-th-ink-3 bg-th-hover px-2.5 py-1 rounded-lg">
                      6 nucleos
                    </span>
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className="text-th-ink-4 group-hover:text-th-ink-2 group-hover:translate-x-0.5 transition-all duration-200 shrink-0 mt-1"
                />
              </div>
            </div>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 px-1">
            <div className="flex-1 h-px bg-th-border" />
            <span className="text-[11px] text-th-ink-4 font-body uppercase tracking-widest">o</span>
            <div className="flex-1 h-px bg-th-border" />
          </div>

          {/* Custom import option */}
          <button
            onClick={onImportCustom}
            className="group w-full text-left rounded-2xl bg-th-subtle border border-th-border
                       hover:bg-th-hover hover:border-th-border-em transition-all duration-200"
          >
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-500/[0.08] flex items-center justify-center shrink-0
                                group-hover:scale-105 transition-transform duration-200">
                  <FileText size={22} color="#34D399" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-[15px] font-semibold text-th-ink tracking-tight">
                    Importar otra carrera
                  </p>
                  <p className="text-xs text-th-ink-3 font-body mt-1 leading-relaxed">
                    Pega la tabla del plan desde la web de tu universidad
                  </p>
                </div>
                <ChevronRight
                  size={18}
                  className="text-th-ink-4 group-hover:text-th-ink-2 group-hover:translate-x-0.5 transition-all duration-200 shrink-0 mt-1"
                />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
