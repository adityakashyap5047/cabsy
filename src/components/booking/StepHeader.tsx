"use client";

import React from 'react';
import { Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import DottedCircle from '../circle/DottedCircle';
import EmptyCircle from '../circle/EmptyCircle';

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
          "flex items-center justify-between px-4 py-1 transition-all duration-300",
          isCompleted && !isEditing 
            ? "bg-gray-200 hover:bg-gray-300" 
            : isEditing 
            ? "bg-gray-500 cursor-default"
            : "bg-gray-500 cursor-default"
        )}
      >
        <div className={`flex items-center gap-2 ${isCompleted && !isEditing ? "cursor-pointer" : "cursor-default"}`}
          onClick={handleHeaderClick}
        >
          <div
            className={`transition-all duration-300`}
          >
            {isCompleted && !isEditing ? <DottedCircle /> : <EmptyCircle />}
          </div>
          <span className={cn(
            "font-semibold text-sm transition-colors duration-300",
            isCompleted && !isEditing ? "text-gray-700" : "text-white"
          )}
          >
            Step {stepNumber}: {title}
          </span>
        </div>

        <div className="flex items-center gap-3">
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
      
      {/* Summary View with smooth vertical sliding window effect */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-700 ease-in-out",
          isCompleted && !isEditing && showSummary 
            ? "max-h-[600px] opacity-100" 
            : "max-h-0 opacity-0"
        )}
      >
        <div 
          className="bg-gray-100 px-6 py-4 border-l-4 border-yellow-500"
          style={{
            transition: 'all 700ms ease-in-out',
            transform: isCompleted && !isEditing && showSummary ? 'translateY(0)' : 'translateY(-16px)',
            opacity: isCompleted && !isEditing && showSummary ? 1 : 0
          }}
        >
          {summary}
        </div>
      </div>
    </div>
  );
}
