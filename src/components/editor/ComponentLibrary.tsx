// Component Library Panel for the Editor
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ChevronDown, 
  ChevronRight,
  Plus,
  Sparkles,
  LayoutGrid
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { COMPONENT_CATEGORIES, createComponentFromPreset } from '@/lib/component-presets';
import { PageComponent, PageComponentType, ComponentPreset } from '@/types/page-components';

interface ComponentLibraryProps {
  onAddComponent: (component: PageComponent) => void;
  existingComponentCount: number;
}

export function ComponentLibrary({ 
  onAddComponent, 
  existingComponentCount 
}: ComponentLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['layout', 'content']);
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleAddComponent = (type: PageComponentType) => {
    const newComponent = createComponentFromPreset(type, existingComponentCount);
    onAddComponent(newComponent);
  };

  // Filter components based on search
  const filteredCategories = COMPONENT_CATEGORIES.map(category => ({
    ...category,
    components: category.components.filter(
      comp =>
        comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.components.length > 0);

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="mb-3 flex items-center gap-2">
          <LayoutGrid className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Components</h3>
          <Badge variant="secondary" className="ml-auto text-xs">
            {COMPONENT_CATEGORIES.reduce((acc, cat) => acc + cat.components.length, 0)}
          </Badge>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Component List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          <AnimatePresence>
            {filteredCategories.map((category) => (
              <div key={category.id} className="mb-2">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="flex-1 text-left">{category.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {category.components.length}
                  </Badge>
                  {expandedCategories.includes(category.id) ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {/* Category Components */}
                <AnimatePresence>
                  {expandedCategories.includes(category.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-1 py-1 pl-2">
                        {category.components.map((component) => (
                          <ComponentItem
                            key={component.type}
                            component={component}
                            isHovered={hoveredComponent === component.type}
                            onHover={setHoveredComponent}
                            onAdd={() => handleAddComponent(component.type)}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </AnimatePresence>

          {filteredCategories.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Sparkles className="mb-2 h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No components found</p>
              <p className="text-xs text-muted-foreground/70">Try a different search term</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

interface ComponentItemProps {
  component: ComponentPreset;
  isHovered: boolean;
  onHover: (type: string | null) => void;
  onAdd: () => void;
}

function ComponentItem({ component, isHovered, onHover, onAdd }: ComponentItemProps) {
  return (
    <motion.div
      onMouseEnter={() => onHover(component.type)}
      onMouseLeave={() => onHover(null)}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg border border-transparent p-3 cursor-pointer transition-all',
        'hover:border-border hover:bg-accent/50',
        isHovered && 'border-primary/50 bg-primary/5'
      )}
      whileHover={{ x: 4 }}
      onClick={onAdd}
    >
      {/* Icon */}
      <div className={cn(
        'flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-transform',
        'bg-muted group-hover:bg-background group-hover:scale-110',
        isHovered && 'scale-110 bg-primary/10'
      )}>
        {component.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {component.name}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {component.description}
        </p>
      </div>

      {/* Add Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
        className="absolute right-2"
      >
        <Button 
          size="icon" 
          variant="ghost"
          className="h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
}

// Compact version for sidebar
interface ComponentLibraryCompactProps {
  onAddComponent: (component: PageComponent) => void;
  existingComponentCount: number;
}

export function ComponentLibraryCompact({
  onAddComponent,
  existingComponentCount,
}: ComponentLibraryCompactProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddComponent = (type: PageComponentType) => {
    const newComponent = createComponentFromPreset(type, existingComponentCount);
    onAddComponent(newComponent);
    setIsOpen(false);
  };

  // Get quick access components (most commonly used)
  const quickComponents = [
    COMPONENT_CATEGORIES[0].components[0], // Hero
    COMPONENT_CATEGORIES[1].components[0], // Heading
    COMPONENT_CATEGORIES[1].components[1], // Text
    COMPONENT_CATEGORIES[2].components[0], // Button
    COMPONENT_CATEGORIES[3].components[0], // Card
  ];

  return (
    <div className="space-y-3">
      {/* Quick Add */}
      <div className="flex flex-wrap gap-2">
        {quickComponents.map((comp) => (
          <Button
            key={comp.type}
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => handleAddComponent(comp.type)}
          >
            <span>{comp.icon}</span>
            {comp.name}
          </Button>
        ))}
      </div>

      {/* View All Button */}
      <Button
        variant="secondary"
        size="sm"
        className="w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <LayoutGrid className="mr-2 h-4 w-4" />
        {isOpen ? 'Hide Library' : 'View All Components'}
      </Button>

      {/* Expanded Library */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden rounded-lg border border-border"
          >
            <ComponentLibrary
              onAddComponent={(comp) => {
                onAddComponent(comp);
                setIsOpen(false);
              }}
              existingComponentCount={existingComponentCount}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
