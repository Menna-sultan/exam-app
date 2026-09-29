import React from "react";
import { Code2, Brain, BookOpen, RectangleEllipsis  } from "lucide-react";

export default function AuthSideSection() {
  return (
    <section className="h-full w-full bg-[#EFF6FFBF] p-8 lg:p-12 flex flex-col justify-between min-h-100 lg:min-h-screen relative overflow-hidden select-none">
     
      <div className="absolute top-[-10%] right-[-10%] w-88 h-88 rounded-full bg-blue-200/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72  rounded-full bg-sky-200/40 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full justify-between gap-12 lg:gap-0">
       
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-[#1b61ff] flex items-center justify-center text-white shadow-sm shadow-[#1b61ff]/25">
            <Code2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="font-mono font-bold text-[#1b61ff] text-[1.125rem] tracking-wide">
            Exam App
          </span>
        </div>

      
        <div className="flex flex-col gap-24 ">
          <h1 className="font-sans text-4xl  font-bold text-gray-800 leading-none tracking-normal align-middle ">
            Empower your learning journey with our smart exam platform.
          </h1>

          
          <div className="flex flex-col gap-7">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 border border-1.5 border-[#155DFC] flex items-center justify-center text-[#155DFC] shadow-sm">
                <Brain className="w-4 h-4 stroke-[1.8]" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-mono font-bold text-[#1b61ff] text-[1rem] tracking-wide">
                  Tailored Diplomas
                </h3>
                <p className="font-mono text-[0.875rem] leading-relaxed text-slate-500 max-w-sm">
                  Choose from specialized tracks like Frontend, Backend, and Mobile Development.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 border border-1.5 border-[#155DFC] flex items-center justify-center text-[#155DFC] shadow-sm">
                <BookOpen className="w-4 h-4 stroke-[1.8]" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-mono font-bold text-[#1b61ff] text-[1rem] tracking-wide">
                  Focused Exams
                </h3>
                <p className="font-mono text-[0.875rem] leading-relaxed text-slate-500 max-w-sm">
                  Access topic-specific tests including HTML, CSS, JavaScript, and more.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 border border-1.5 border-[#155DFC] flex items-center justify-center text-[#155DFC] shadow-sm">
                <RectangleEllipsis  className="w-4 h-4 stroke-[1.8]" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-mono font-bold text-[#1b61ff] text-[1rem] tracking-wide">
                  Smart Multi-Step Forms
                </h3>
                <p className="font-mono text-[0.875rem] leading-relaxed text-slate-500 max-w-sm">
                  Choose from specialized tracks like Frontend, Backend, and Mobile Development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}