import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Code,
  Superscript,
  Subscript,
  Palette,
  Highlighter,
  Link,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface TextFormattingToolbarProps {
  onFormat: (format: string, value?: string) => void;
  visible: boolean;
  position?: { x: number; y: number };
}

interface SelectionPosition {
  x: number;
  y: number;
  visible: boolean;
}

export const TextFormattingToolbar = ({ onFormat, visible, position = { x: 0, y: 0 } }: TextFormattingToolbarProps) => {
  const toolbarRef = useRef<HTMLDivElement>(null);

  const colors = [
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Default', value: 'inherit' }
  ];

  const highlights = [
    { name: 'Yellow', value: '#fef08a' },
    { name: 'Green', value: '#bbf7d0' },
    { name: 'Blue', value: '#bfdbfe' },
    { name: 'Purple', value: '#e9d5ff' },
    { name: 'Pink', value: '#fbcfe8' },
    { name: 'Red', value: '#fecaca' },
    { name: 'None', value: 'transparent' }
  ];

  useEffect(() => {
    // This toolbar is now controlled by parent component
    // Position will be calculated relative to the active input/textarea
  }, []);

  const applyFormat = (format: string, value?: string) => {
    // Use execCommand for rich text formatting
    switch (format) {
      case 'bold':
        document.execCommand('bold', false);
        break;
      case 'italic':
        document.execCommand('italic', false);
        break;
      case 'underline':
        document.execCommand('underline', false);
        break;
      case 'color':
        if (value) {
          document.execCommand('foreColor', false, value);
        }
        break;
      case 'link':
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed && value) {
          document.execCommand('createLink', false, value);
        }
        break;
      default:
        onFormat(format, value);
    }
  };

  const handleLinkClick = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      alert('Selecione o texto que deseja transformar em link');
      return;
    }
    
    const url = prompt('Digite o URL do link:');
    if (url) {
      applyFormat('link', url);
    }
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={toolbarRef}
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="fixed z-50 bg-background border border-border rounded-lg shadow-lg px-2 py-1.5"
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        <div className="flex items-center gap-1">
          {/* Basic formatting */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => applyFormat('bold')}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => applyFormat('italic')}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => applyFormat('underline')}
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </Button>

          <div className="h-6 w-px bg-border mx-1" />

          {/* Font Color */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Font Color"
              >
                <Palette className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" side="bottom">
              <div className="grid grid-cols-4 gap-1">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    className="w-6 h-6 rounded border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color.value === 'inherit' ? '#666' : color.value }}
                    onClick={() => applyFormat('color', color.value)}
                    title={color.name}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <div className="h-6 w-px bg-border mx-1" />

          {/* Insert Link */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleLinkClick}
            title="Adicionar Link"
          >
            <Link className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
