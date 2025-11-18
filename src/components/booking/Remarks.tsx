'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, PenBox } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RemarksProps {
  value: string;
  onChange: (value: string) => void;
  handleRemarksChange: (value: string) => void;
}

const Remarks: React.FC<RemarksProps> = ({ value, onChange, handleRemarksChange }) => {
  const [isEditing, setIsEditing] = useState(true);
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const handleCheck = () => {
    if (value.trim()) {
      setText(value.trim());
      handleRemarksChange(value.trim());
      setIsEditing(false);
    }
  };

  const handleClear = () => {
    onChange('');
    handleRemarksChange('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    setText('');
    onChange('');
    handleRemarksChange('');
    setIsEditing(true);
  };

  return (
    <div>
      <div className="bg-gray-100 px-3 sm:px-4 md:px-6 py-1 border-b border-gray-200">
        <h2 className="text-base sm:text-lg font-medium text-gray-800">Additional Information</h2>
      </div>
      <div
        className={`transition-all duration-700 ease-in-out 
          ${isEditing
            ? 'max-h-[400px] opacity-100 transform translate-y-0'
            : 'max-h-0 opacity-0 transform -translate-y-4'
          }
        `}
      >
        <div className="relative mt-3 sm:mt-4 px-3 sm:px-4 md:px-6">
          <Label className="mb-2 text-xs sm:text-sm">Other Comments or Special Requests (Optional)</Label>
          <div className="relative mt-2">
          <Textarea
            ref={textareaRef}
            className="rounded-none pr-12 text-sm sm:text-base"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
          />
          {value.trim() && (
            <div className="absolute top-2 right-2 flex flex-col gap-2">
              <Check
                onClick={handleCheck}
                className="w-4 h-4 opacity-50 cursor-pointer hover:text-green-600 hover:opacity-100 transition-all duration-200"
              />
              <X
                onClick={handleClear}
                className="w-4 h-4 opacity-50 cursor-pointer hover:text-red-600 hover:opacity-100 transition-all duration-200"
              />
            </div>
          )}
          </div>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-700 ease-in-out ${
          !isEditing && text
            ? 'max-h-[400px] opacity-100 transform translate-y-0'
            : 'max-h-0 opacity-0 transform -translate-y-4'
        }`}
      >
        <div className="px-4 md:px-6">
          <div className="group p-4 bg-gray-50 border border-gray-200 rounded relative">
            <p className="text-gray-800 whitespace-pre-wrap mr-4 text-sm">{text}</p>
            
            <div className="absolute top-2 right-2 opacity-100 group-hover:opacity-100 transition-opacity duration-200 flex flex-col">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEdit}
                className="h-4 w-4 cursor-pointer bg-transparent! hover:text-blue-600 hover:bg-blue-50"
              >
                <PenBox className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="h-4 w-4 mt-2 cursor-pointer bg-transparent! hover:text-red-600 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Remarks;
