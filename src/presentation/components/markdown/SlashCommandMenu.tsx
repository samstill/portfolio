import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiType, FiList, FiCheckSquare, FiCode, 
  FiImage, FiLink, FiMinus, FiMessageSquare 
} from 'react-icons/fi';

const Menu = styled(motion.div)`
  position: fixed;
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 8px;
  width: 320px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;

  /* Improved scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    margin: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

const MenuItem = styled(motion.button)<{ $isSelected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: ${props => props.$isSelected ? 'rgba(74, 108, 247, 0.2)' : 'transparent'};
  color: ${props => props.theme.text};
  cursor: pointer;
  border-radius: 8px;
  text-align: left;
  transition: all 0.2s ease;

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: ${props => props.$isSelected ? '#4a6cf7' : props.theme.text};
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .title {
    font-weight: 500;
    font-size: 0.95rem;
  }

  .description {
    font-size: 0.85rem;
    opacity: 0.7;
  }

  .shortcut {
    font-size: 0.85rem;
    opacity: 0.5;
    padding: 2px 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  &:hover {
    background: rgba(74, 108, 247, 0.15);
    transform: translateX(4px);
  }

  &:focus {
    outline: none;
    background: rgba(74, 108, 247, 0.2);
  }
`;

interface Command {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: (text: string, cursorPos: number) => {
    text: string;
    newCursorPos: number;
  };
  shortcut?: string;
}

const insertText = (
  element: HTMLDivElement, 
  text: string, 
  cursorOffset = 0,
  onChange?: (value: string) => void
) => {
  const selection = window.getSelection();
  if (!selection?.rangeCount) return;

  const range = selection.getRangeAt(0);
  const content = element.innerText;
  const before = content.substring(0, range.startOffset);
  const after = content.substring(range.endOffset);
  
  // Remove the slash that triggered the menu
  const newValue = before.slice(0, -1) + text + after;
  
  // Update form state if onChange is provided
  if (onChange) {
    onChange(newValue);
  }
  
  // Update element content
  element.innerText = newValue;
  element.focus();
  
  // Set cursor position
  const newPosition = range.startOffset + text.length + cursorOffset - 1;
  const newRange = document.createRange();
  const textNode = element.firstChild || element;
  newRange.setStart(textNode, newPosition);
  newRange.setEnd(textNode, newPosition);
  selection.removeAllRanges();
  selection.addRange(newRange);
};

const commands: Command[] = [
  {
    title: 'Heading 1',
    description: 'Big heading',
    icon: <FiType size={20} />,
    action: (text: string, cursorPos: number) => {
      const before = text.slice(0, cursorPos - 1); // Remove slash
      const after = text.slice(cursorPos);
      return {
        text: `${before}# ${after}`,
        newCursorPos: cursorPos + 1
      };
    },
    shortcut: 'Ctrl+1'
  },
  {
    title: 'Heading 2',
    description: 'Medium heading',
    icon: <FiType size={18} />,
    action: (text: string, cursorPos: number) => {
      const before = text.slice(0, cursorPos - 1);
      const after = text.slice(cursorPos);
      return {
        text: `${before}## ${after}`,
        newCursorPos: cursorPos + 2
      };
    },
    shortcut: 'Ctrl+2'
  },
  {
    title: 'Bullet List',
    description: 'Create a bullet point',
    icon: <FiList size={18} />,
    action: (text: string, cursorPos: number) => {
      const before = text.slice(0, cursorPos - 1);
      const after = text.slice(cursorPos);
      return {
        text: `${before}- ${after}`,
        newCursorPos: cursorPos + 1
      };
    },
    shortcut: 'Ctrl+3'
  },
  {
    title: 'Text',
    description: 'Plain text block',
    icon: <FiType size={18} />,
    action: (element, onChange) => {
      const block = findBlock(element);
      if (block) {
        block.type = 'paragraph';
        updateBlock(block);
      }
    },
    keywords: ['text', 'plain', 'paragraph'],
    blockTypes: ['heading1', 'heading2', 'quote', 'bulletList', 'numberList']
  },
  {
    title: 'Numbered List',
    description: 'Create a numbered item',
    icon: <FiList size={18} />,
    action: (element, onChange) => insertText(element, '1. ', 0, onChange),
    keywords: ['list', 'number', 'ordered'],
    blockTypes: ['numberList']
  },
  {
    title: 'Task List',
    description: 'Create a todo item',
    icon: <FiCheckSquare size={18} />,
    action: (element, onChange) => insertText(element, '- [ ] ', 0, onChange),
    keywords: ['task', 'todo', 'checkbox'],
    blockTypes: ['bulletList']
  },
  {
    title: 'Code Block',
    description: 'Insert code with syntax highlighting',
    icon: <FiCode size={18} />,
    action: (element, onChange) => insertText(element, '```\n\n```', -4, onChange),
    keywords: ['code', 'syntax', 'programming'],
    blockTypes: ['code']
  },
  {
    title: 'Link',
    description: 'Add a hyperlink',
    icon: <FiLink size={18} />,
    action: (element, onChange) => insertText(element, '[]()', -1, onChange),
    keywords: ['link', 'url', 'href'],
    blockTypes: ['quote']
  },
  {
    title: 'Image',
    description: 'Insert an image',
    icon: <FiImage size={18} />,
    action: (element, onChange) => insertText(element, '![]()', -1, onChange),
    keywords: ['image', 'picture', 'photo'],
    blockTypes: ['quote']
  },
  {
    title: 'Quote',
    description: 'Add a blockquote',
    icon: <FiMessageSquare size={18} />,
    action: (element, onChange) => insertText(element, '> ', 0, onChange),
    keywords: ['quote', 'blockquote', 'cite'],
    blockTypes: ['quote']
  },
  {
    title: 'Divider',
    description: 'Add a horizontal line',
    icon: <FiMinus size={18} />,
    action: (element, onChange) => insertText(element, '\n---\n', 0, onChange),
    keywords: ['divider', 'line', 'separator'],
    blockTypes: ['quote']
  },
];

interface SlashCommandMenuProps {
  position: { x: number; y: number };
  onClose: () => void;
  onSelect: (command: Command) => void;
  filter: string;
}

export const SlashCommandMenu: React.FC<SlashCommandMenuProps> = ({
  position,
  onClose,
  onSelect,
  filter
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const filteredCommands = commands.filter(command => 
    command.title.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(i => (i + 1) % filteredCommands.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(i => (i - 1 + filteredCommands.length) % filteredCommands.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            onSelect(filteredCommands[selectedIndex]);
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [filteredCommands, selectedIndex, onSelect, onClose]);

  if (filteredCommands.length === 0) return null;

  return (
    <Menu
      ref={menuRef}
      style={{ left: position.x, top: position.y }}
    >
      {filteredCommands.map((command, index) => (
        <MenuItem
          key={command.title}
          onClick={() => onSelect(command)}
          $isSelected={index === selectedIndex}
        >
          <div className="icon-wrapper">
            {command.icon}
          </div>
          <div className="content">
            <span className="title">{command.title}</span>
            <span className="description">{command.description}</span>
          </div>
          {command.shortcut && (
            <span className="shortcut">{command.shortcut}</span>
          )}
        </MenuItem>
      ))}
    </Menu>
  );
};

// Add utility functions
const updateBlock = (block: Block) => {
  setBlocks(prev => prev.map(b => 
    b.id === block.id ? block : b
  ));
}; 