"use client";

import React from 'react';
import { Edit } from 'lucide-react';
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
  
  const handleTitleClick = () => {
    if (isCompleted && !isEditing) {
      if (onToggleSummary) {
        onToggleSummary();
      }
    } else if (!isCompleted) {
      return;
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between px-4 py-3 transition-all duration-300 bg-[#ccc8c8]" >
        <div className={`flex items-center gap-2 ${isCompleted && !isEditing ? "cursor-pointer" : "cursor-default"}`}
          onClick={handleTitleClick}
        >
          <div
            className="transition-all duration-300"
          >
            {isCompleted && !isEditing ? <DottedCircle /> : <EmptyCircle />}
          </div>
          <span className="text-sm transition-colors duration-300 text-[#ae9409] font-bold">
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
              className="flex items-center cursor-pointer gap-1 text-gray-700 hover:text-[#ae9409] transition-colors duration-200"
            >
              <Edit className="w-4 h-4" />
              <span className="text-sm font-medium">Edit</span>
            </button>
          )}
        </div>
      </div>
      
      <div
        className={`overflow-hidden transition-all duration-700 ease-in-out
          ${isCompleted && !isEditing && showSummary ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`
        }
      >
        <div 
          className="bg-gray-100 px-6 py-4 border-l-4 border-[#ae9409]"
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
