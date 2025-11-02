"use client";

import React from 'react';
import { Check, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepHeaderProps {
  stepNumber: number;
  title: string;
  isCompleted: boolean;
  isEditing?: boolean;
  showSummary?: boolean;
  onToggleSummary?: () => void;
  onEdit?: () => void;
  summary?: React.ReactNode;
}

export default function StepHeader({
  stepNumber,
  title,
  isCompleted,
  isEditing = false,
  showSummary = false,
  onToggleSummary,
  onEdit,
  summary,
}: StepHeaderProps) {
  
  const handleHeaderClick = () => {
    if (isCompleted && !isEditing) {
      // When completed and not editing, toggle summary
      if (onToggleSummary) {
        onToggleSummary();
      }
    } else if (!isCompleted) {
      // When not completed, do nothing (can't toggle)
      return;
    }
  };

  return (
    <div className="mb-4">
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3 transition-all duration-300",
          isCompleted && !isEditing 
            ? "bg-gray-200 hover:bg-gray-300" 
            : isEditing 
            ? "bg-gray-500 cursor-default"
            : "bg-gray-500 cursor-default"
        )}
      >
        <div className={`flex items-center gap-3 ${isCompleted && !isEditing ? "cursor-pointer" : "cursor-default"}`}
          onClick={handleHeaderClick}
        >
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all duration-300",
              isCompleted && !isEditing
                ? "bg-yellow-500 text-white"
                : "bg-transparent border-2 border-yellow-500 text-yellow-500"
            )}
          >
            {isCompleted && !isEditing ? <Check className="w-5 h-5" /> : stepNumber}
          </div>
          <span className={cn(
            "font-semibold text-lg transition-colors duration-300",
            isCompleted && !isEditing ? "text-gray-700" : "text-white"
          )}
          >
            Step {stepNumber}: {title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Show Edit button only when completed and not editing */}
          {isCompleted && !isEditing && onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="flex items-center cursor-pointer gap-1 text-gray-700 hover:text-yellow-600 transition-colors duration-200"
            >
              <Edit className="w-4 h-4" />
              <span className="text-sm font-medium">Edit</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary View with smooth transition */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-500 ease-in-out",
          isCompleted && !isEditing && showSummary ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {isCompleted && !isEditing && showSummary && summary && (
          <div className="bg-gray-100 px-6 py-4 border-l-4 border-yellow-500">
            {summary}
          </div>
        )}
      </div>
    </div>
  );
}
