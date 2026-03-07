// Page Canvas - Displays and manages page components
import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  Trash2, 
  GripVertical, 
  Eye, 
  EyeOff,
  Copy,
  Settings,
  ChevronUp,
  ChevronDown,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PageComponent } from '@/types/page-components';
import { ComponentRenderer } from './ComponentRenderer';

interface PageCanvasProps {
  components: PageComponent[];
  onComponentsChange: (components: PageComponent[]) => void;
  onSelectComponent: (id: string | null) => void;
  selectedComponentId: string | null;
  isEditing?: boolean;
  deviceMode?: 'desktop' | 'tablet' | 'mobile';
}

export function PageCanvas({
  components,
  onComponentsChange,
  onSelectComponent,
  selectedComponentId,
  isEditing = true,
  deviceMode = 'desktop',
}: PageCanvasProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleReorder = (reorderedComponents: PageComponent[]) => {
    const updated = reorderedComponents.map((comp, index) => ({
      ...comp,
      order: index,
    }));
    onComponentsChange(updated);
  };

  const handleDelete = (id: string) => {
    const updated = components.filter(c => c.id !== id);
    onComponentsChange(updated);
    if (selectedComponentId === id) {
      onSelectComponent(null);
    }
  };

  const handleDuplicate = (id: string) => {
    const componentToDuplicate = components.find(c => c.id === id);
    if (!componentToDuplicate) return;

    const newComponent: PageComponent = {
      ...componentToDuplicate,
      id: `comp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      order: components.length,
    };
    
    onComponentsChange([...components, newComponent]);
  };

  const handleToggleVisibility = (id: string) => {
    const updated = components.map(c =>
      c.id === id ? { ...c, visible: !c.visible } : c
    );
    onComponentsChange(updated);
  };

  const handleMoveUp = (id: string) => {
    const index = components.findIndex(c => c.id === id);
    if (index <= 0) return;
    
    const updated = [...components];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    handleReorder(updated);
  };

  const handleMoveDown = (id: string) => {
    const index = components.findIndex(c => c.id === id);
    if (index >= components.length - 1) return;
    
    const updated = [...components];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    handleReorder(updated);
  };

  const sortedComponents = [...components].sort((a, b) => a.order - b.order);

  if (components.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Plus className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Start Building Your Page
        </h3>
        <p className="text-muted-foreground max-w-sm">
          Click on components from the library to add them here. 
          You can reorder, edit, and customize each component.
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      "p-4 transition-all duration-300 mx-auto",
      deviceMode === 'mobile' ? 'max-w-[375px]' : 'max-w-full'
    )}>
      <Reorder.Group
        axis="y"
        values={sortedComponents}
        onReorder={handleReorder}
        className="space-y-3"
      >
        <AnimatePresence>
          {sortedComponents.map((component) => (
            <Reorder.Item
              key={component.id}
              value={component}
              onDragStart={() => setDraggedId(component.id)}
              onDragEnd={() => setDraggedId(null)}
              className={cn(
                'relative group',
                draggedId === component.id && 'z-50'
              )}
            >
              <div
                className={cn(
                  'relative rounded-lg transition-all',
                  isEditing && 'border border-transparent hover:border-border',
                  selectedComponentId === component.id && 'border-primary ring-1 ring-primary',
                  !component.visible && 'opacity-50'
                )}
                onClick={() => onSelectComponent(component.id)}
              >
                {/* Component Controls */}
                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: selectedComponentId === component.id ? 1 : 0 }}
                    className="absolute -top-10 right-0 flex items-center gap-1 bg-card border border-border rounded-lg p-1 shadow-lg z-10 group-hover:opacity-100"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveUp(component.id);
                      }}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveDown(component.id);
                      }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleVisibility(component.id);
                      }}
                    >
                      {component.visible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicate(component.id);
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(component.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )}

                {/* Drag Handle */}
                {isEditing && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}

                {/* Component Content */}
                <div className={cn(!component.visible && 'pointer-events-none')}>
                  <ComponentRenderer
                    component={component}
                    isEditing={isEditing}
                    isSelected={selectedComponentId === component.id}
                  />
                </div>
              </div>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  );
}
