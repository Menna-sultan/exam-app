'use client'

import React from "react";

const OnboardingSteps = ({
  currentStep,
}: {
  currentStep: number;
}) => {
  // Hide the step indicator on the very first screen (Step 1 - Email).
  if (currentStep === 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2" aria-label="Register steps">
      {/* Step 1 */}
      <div
        className={
          currentStep >= 1
            ? "w-3 h-3 rotate-45 border bg-blue-600 border-blue-600"
            : "w-3 h-3 rotate-45 border border-slate-300 bg-transparent"
        }
      />

      {/* Line 1 -> 2 */}
      <div
        className={
          currentStep >= 2
            ? "w-12 border-t border-dashed border-blue-600"
            : "w-12 border-t border-dashed border-slate-300"
        }
      />

      {/* Step 2 */}
      <div
        className={
          currentStep >= 2
            ? "w-3 h-3 rotate-45 border bg-blue-600 border-blue-600"
            : "w-3 h-3 rotate-45 border border-slate-300 bg-transparent"
        }
      />

      {/* Line 2 -> 3 */}
      <div
        className={
          currentStep >= 3
            ? "w-12 border-t border-dashed border-blue-600"
            : "w-12 border-t border-dashed border-slate-300"
        }
      />

      {/* Step 3 */}
      <div
        className={
          currentStep >= 3
            ? "w-3 h-3 rotate-45 border bg-blue-600 border-blue-600"
            : "w-3 h-3 rotate-45 border border-slate-300 bg-transparent"
        }
      />

      {/* Line 3 -> 4 */}
      <div
        className={
          currentStep >= 4
            ? "w-12 border-t border-dashed border-blue-600"
            : "w-12 border-t border-dashed border-slate-300"
        }
      />

      {/* Step 4 */}
      <div
        className={
          currentStep >= 4
            ? "w-3 h-3 rotate-45 border bg-blue-600 border-blue-600"
            : "w-3 h-3 rotate-45 border border-slate-300 bg-transparent"
        }
      />
    </div>
  );
};

export default OnboardingSteps;

