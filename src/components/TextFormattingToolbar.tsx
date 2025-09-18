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
  MessageSquare,
  X,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

// Photoshop-inspired comprehensive color palette
const colorPalette = [
  // Row 1 - Pure colors & white
  ['#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
  // Row 2 - Red spectrum
  ['#FF4444', '#FF6666', '#FF8888', '#FFAAAA', '#FFCCCC', '#FFEEEE', '#CC0000', '#990000'],
  // Row 3 - Orange spectrum  
  ['#FF4400', '#FF6622', '#FF8844', '#FFAA66', '#FFCC88', '#FFEEAA', '#CC3300', '#992200'],
  // Row 4 - Yellow spectrum
  ['#FFAA00', '#FFBB22', '#FFCC44', '#FFDD66', '#FFEE88', '#FFFFAA', '#CC8800', '#996600'],
  // Row 5 - Green spectrum
  ['#44FF44', '#66FF66', '#88FF88', '#AAFFAA', '#CCFFCC', '#EEFFEE', '#00CC00', '#009900'],
  // Row 6 - Blue spectrum
  ['#4444FF', '#6666FF', '#8888FF', '#AAAAFF', '#CCCCFF', '#EEEEFF', '#0000CC', '#000099'],
  // Row 7 - Purple spectrum
  ['#AA44FF', '#BB66FF', '#CC88FF', '#DDAAFF', '#EECCFF', '#FFEEFC', '#8800CC', '#660099'],
  // Row 8 - Gray spectrum
  ['#111111', '#333333', '#555555', '#777777', '#999999', '#BBBBBB', '#DDDDDD', '#F5F5F5'],
  // Row 9 - Earth tones
  ['#8B4513', '#A0522D', '#CD853F', '#DEB887', '#F4A460', '#D2B48C', '#BC8F8F', '#F5DEB3'],
  // Row 10 - Vibrant palette
  ['#FF1493', '#FF6347', '#FFD700', '#ADFF2F', '#00CED1', '#9370DB', '#FF4500', '#32CD32']
];

export const TextFormattingToolbar = ({ onFormat, visible, position = { x: 0, y: 0 } }: TextFormattingToolbarProps) => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [selectedText, setSelectedText] = useState('');

  // Captura o texto selecionado quando o toolbar aparece
  useEffect(() => {
    if (visible) {
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) {
        setSelectedText(selection.toString());
        setLinkText(selection.toString());
      }
    }
  }, [visible]);

  const applyFormat = (format: string, value?: string) => {
    // Use execCommand para formatação de rich text
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
        if (value) {
          document.execCommand('createLink', false, value);
        }
        break;
      default:
        onFormat(format, value);
    }
  };

  const handleColorSelect = (color: string) => {
    // Apply color immediately and provide visual feedback
    applyFormat('color', color);
    
    // Add a subtle animation to show color was applied
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.color = color;
      span.style.transition = 'all 0.3s ease';
      
      try {
        range.surroundContents(span);
        // Brief highlight effect
        span.style.backgroundColor = color + '20';
        setTimeout(() => {
          span.style.backgroundColor = 'transparent';
        }, 300);
      } catch (e) {
        // Fallback for complex selections
        document.execCommand('foreColor', false, color);
      }
    }
    
    setShowColorPalette(false);
  };

  const handleLinkClick = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      alert('Selecione o texto que deseja transformar em link');
      return;
    }
    
    setSelectedText(selection.toString());
    setLinkText(selection.toString());
    setShowLinkDialog(true);
  };

  const handleLinkSubmit = () => {
    if (linkUrl.trim()) {
      // Valida se é uma URL válida
      let validUrl = linkUrl.trim();
      if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
        validUrl = 'https://' + validUrl;
      }
      
      try {
        new URL(validUrl);
        applyFormat('link', validUrl);
        setShowLinkDialog(false);
        setLinkUrl('');
        setLinkText('');
      } catch (error) {
        alert('Por favor, insira uma URL válida');
      }
    }
  };

  const handleLinkCancel = () => {
    setShowLinkDialog(false);
    setLinkUrl('');
    setLinkText('');
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
          {/* Formatação básica */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => applyFormat('bold')}
            title="Negrito"
          >
            <Bold className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => applyFormat('italic')}
            title="Itálico"
          >
            <Italic className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => applyFormat('underline')}
            title="Sublinhado"
          >
            <Underline className="h-4 w-4" />
          </Button>

          <div className="h-6 w-px bg-border mx-1" />

          {/* Botão de Cor do Texto */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 relative overflow-hidden group"
              onClick={() => setShowColorPalette(!showColorPalette)}
              title="Seletor de Cores Avançado"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 opacity-20 group-hover:opacity-40 transition-opacity duration-200 rounded" />
              <Palette className="h-4 w-4 relative z-10" />
            </Button>

            {/* Paleta de Cores */}
            <AnimatePresence>
              {showColorPalette && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-10 left-0 z-60 bg-popover border border-border rounded-xl shadow-2xl p-4 min-w-[320px] max-h-[400px] overflow-y-auto"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 rounded-md shadow-md" />
                      <div className="text-sm font-semibold text-foreground">Paleta de Cores Avançada</div>
                    </div>
                    
                    {/* Comprehensive Color Grid */}
                    <div className="space-y-2">
                      {colorPalette.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex gap-1 justify-center">
                          {row.map((color) => (
                            <button
                              key={color}
                              className="w-7 h-7 rounded-md border-2 border-border hover:border-primary hover:scale-110 transition-all duration-200 shadow-md relative group"
                              style={{ backgroundColor: color }}
                              onClick={() => handleColorSelect(color)}
                              title={color}
                            >
                              <div className="absolute inset-0 rounded-md bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>

                    {/* Seletor de cor personalizada */}
                    <div className="pt-2 border-t border-border">
                      <div className="text-xs text-muted-foreground mb-2">Cor personalizada:</div>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          className="w-8 h-8 rounded border border-border cursor-pointer"
                          onChange={(e) => handleColorSelect(e.target.value)}
                          title="Escolher cor personalizada"
                        />
                        <input
                          type="text"
                          placeholder="#000000"
                          className="flex-1 px-2 py-1 text-xs border border-border rounded bg-background text-foreground"
                          onChange={(e) => {
                            if (e.target.value.match(/^#[0-9A-Fa-f]{6}$/)) {
                              handleColorSelect(e.target.value);
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Botão fechar */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => setShowColorPalette(false)}
                    >
                      Fechar
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-6 w-px bg-border mx-1" />

          {/* Botão de Link */}
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

        {/* Dialog de Link Moderno */}
        <AnimatePresence>
          {showLinkDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
              onClick={handleLinkCancel}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.2 }}
                className="bg-background border border-border rounded-xl shadow-2xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Adicionar Link</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleLinkCancel}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Texto selecionado */}
                {selectedText && (
                  <div className="mb-4 p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Texto selecionado:</div>
                    <div className="text-sm font-medium text-foreground">"{selectedText}"</div>
                  </div>
                )}

                {/* Campos do formulário */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      URL do Link
                    </label>
                    <Input
                      type="url"
                      placeholder="https://exemplo.com"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="w-full"
                      autoFocus
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      Digite a URL completa (com https://)
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Texto do Link (opcional)
                    </label>
                    <Input
                      type="text"
                      placeholder="Texto que aparecerá como link"
                      value={linkText}
                      onChange={(e) => setLinkText(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleLinkCancel}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleLinkSubmit}
                    disabled={!linkUrl.trim()}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Adicionar Link
                  </Button>
                </div>

                {/* Dica de uso */}
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    💡 <strong>Dica:</strong> Selecione o texto que deseja transformar em link antes de clicar no botão de link.
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};