// Export Dialog - Export page as HTML or JSON
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileCode, FileJson, Copy, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PageComponent } from '@/types/page-components';
import { exportToHTML, exportToJSON, downloadFile } from '@/lib/export-utils';
import { toast } from 'sonner';

interface ExportDialogProps {
  components: PageComponent[];
  projectName: string;
  trigger?: React.ReactNode;
}

export function ExportDialog({ components, projectName, trigger }: ExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'html' | 'json'>('html');
  const [includeStyles, setIncludeStyles] = useState(true);
  const [minify, setMinify] = useState(false);
  const [prettyJson, setPrettyJson] = useState(true);
  const [copied, setCopied] = useState(false);

  const htmlContent = exportToHTML(components, {
    pageTitle: projectName,
    includeStyles,
    minify,
  });

  const jsonContent = exportToJSON(components, { pretty: prettyJson });

  const handleCopy = () => {
    const content = activeTab === 'html' ? htmlContent : jsonContent;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard!');
  };

  const handleDownload = () => {
    const content = activeTab === 'html' ? htmlContent : jsonContent;
    const filename = activeTab === 'html' 
      ? `${projectName.toLowerCase().replace(/\s+/g, '-')}.html`
      : `${projectName.toLowerCase().replace(/\s+/g, '-')}.json`;
    const mimeType = activeTab === 'html' ? 'text/html' : 'application/json';
    
    downloadFile(content, filename, mimeType);
    toast.success(`Downloaded ${filename}`);
  };

  if (components.length === 0) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] w-[95vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Page
          </DialogTitle>
          <DialogDescription>
            Export your page as HTML or JSON. The exported file can be used in any web project.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'html' | 'json')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="html" className="gap-2">
              <FileCode className="h-4 w-4" />
              HTML
            </TabsTrigger>
            <TabsTrigger value="json" className="gap-2">
              <FileJson className="h-4 w-4" />
              JSON
            </TabsTrigger>
          </TabsList>

          <TabsContent value="html" className="space-y-4">
            {/* HTML Options */}
            <div className="flex items-center gap-6 rounded-lg bg-muted/50 p-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="include-styles"
                  checked={includeStyles}
                  onCheckedChange={setIncludeStyles}
                />
                <Label htmlFor="include-styles" className="text-sm">Include Styles</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="minify"
                  checked={minify}
                  onCheckedChange={setMinify}
                />
                <Label htmlFor="minify" className="text-sm">Minify Output</Label>
              </div>
            </div>

            {/* HTML Preview */}
            <ScrollArea className="h-[400px] rounded-lg border bg-muted p-4">
              <pre className="text-sm text-foreground font-mono whitespace-pre-wrap break-all">
                {htmlContent}
              </pre>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="json" className="space-y-4">
            {/* JSON Options */}
            <div className="flex items-center gap-6 rounded-lg bg-muted/50 p-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="pretty-json"
                  checked={prettyJson}
                  onCheckedChange={setPrettyJson}
                />
                <Label htmlFor="pretty-json" className="text-sm">Pretty Print</Label>
              </div>
            </div>

            {/* JSON Preview */}
            <ScrollArea className="h-[400px] rounded-lg border bg-muted p-4">
              <pre className="text-sm text-foreground font-mono whitespace-pre-wrap break-all">
                {jsonContent}
              </pre>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {components.length} component{components.length !== 1 ? 's' : ''} will be exported
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download {activeTab.toUpperCase()}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
