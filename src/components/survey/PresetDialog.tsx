import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Wand2 } from 'lucide-react';
import type { InstitutionalHeader, CategoryGroup } from '@/types/survey';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: 'ahp' | 'ism';
  initial: InstitutionalHeader;
  onSubmit: (header: InstitutionalHeader) => void;
}

const PresetDialog = ({ open, onOpenChange, mode, initial, onSubmit }: Props) => {
  const [header, setHeader] = useState<InstitutionalHeader>(initial);
  const [numCats, setNumCats] = useState<number>(initial.categories?.length || 3);
  const [factorsPerCat, setFactorsPerCat] = useState<number>(4);

  useEffect(() => {
    if (open) {
      setHeader(initial);
      setNumCats(initial.categories?.length || 3);
    }
  }, [open, initial]);

  const update = <K extends keyof InstitutionalHeader>(k: K, v: InstitutionalHeader[K]) =>
    setHeader(prev => ({ ...prev, [k]: v }));

  const buildTable = () => {
    const cats: CategoryGroup[] = [];
    for (let i = 0; i < numCats; i++) {
      cats.push({
        id: `cat_${Date.now()}_${i}`,
        category: '',
        factors: Array.from({ length: factorsPerCat }, () => ''),
      });
    }
    update('categories', cats);
  };

  const updateCat = (i: number, patch: Partial<CategoryGroup>) => {
    const list = [...(header.categories || [])];
    list[i] = { ...list[i], ...patch };
    update('categories', list);
  };
  const updateFactor = (ci: number, fi: number, val: string) => {
    const list = [...(header.categories || [])];
    const factors = [...list[ci].factors];
    factors[fi] = val;
    list[ci] = { ...list[ci], factors };
    update('categories', list);
  };
  const addFactor = (ci: number) => {
    const list = [...(header.categories || [])];
    list[ci] = { ...list[ci], factors: [...list[ci].factors, ''] };
    update('categories', list);
  };
  const removeFactor = (ci: number, fi: number) => {
    const list = [...(header.categories || [])];
    list[ci] = { ...list[ci], factors: list[ci].factors.filter((_, idx) => idx !== fi) };
    update('categories', list);
  };
  const addCat = () => {
    update('categories', [...(header.categories || []), { id: `cat_${Date.now()}`, category: '', factors: [''] }]);
  };
  const removeCat = (i: number) => {
    update('categories', (header.categories || []).filter((_, idx) => idx !== i));
  };

  const submit = () => {
    onSubmit(header);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode.toUpperCase()} Questionnaire — Fill Details</DialogTitle>
          <DialogDescription>
            All fields are editable. After submitting, a print-ready preview will be shown on the page.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Institutional */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold border-b pb-1">Institutional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2 space-y-1">
                <Label>University / Institution *</Label>
                <Input value={header.university} onChange={e => update('university', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>School / Faculty</Label>
                <Input value={header.school || ''} onChange={e => update('school', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Department</Label>
                <Input value={header.department || ''} onChange={e => update('department', e.target.value)} />
              </div>
              <div className="md:col-span-2 space-y-1">
                <Label>Research Title</Label>
                <Textarea rows={2} value={header.researchTitle || ''} onChange={e => update('researchTitle', e.target.value)} />
              </div>
              <div className="md:col-span-2 space-y-1">
                <Label>Purpose / Description of Questionnaire</Label>
                <Textarea rows={3} value={header.purposeStatement || ''} onChange={e => update('purposeStatement', e.target.value)} />
              </div>
            </div>
          </section>

          {/* Researcher */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold border-b pb-1">Researcher Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Researcher Name</Label>
                <Input value={header.researcherName || ''} onChange={e => update('researcherName', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Phone</Label>
                <Input value={header.researcherPhone || ''} onChange={e => update('researcherPhone', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input value={header.researcherEmail || ''} onChange={e => update('researcherEmail', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Advisor / Supervisor</Label>
                <Input value={header.advisorName || ''} onChange={e => update('advisorName', e.target.value)} />
              </div>
            </div>
          </section>

          {/* Methodology */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold border-b pb-1">Study Methodology</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Objective of the Study</Label>
                <Textarea rows={3} value={header.objective || ''} onChange={e => update('objective', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Method</Label>
                <Textarea rows={3} value={header.methodDescription || ''} onChange={e => update('methodDescription', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Instruction</Label>
                <Textarea rows={3} value={header.instructionDescription || ''} onChange={e => update('instructionDescription', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Example (CASE 1 / CASE 2)</Label>
                <Textarea rows={4} value={header.exampleDescription || ''} onChange={e => update('exampleDescription', e.target.value)} />
              </div>
            </div>
          </section>

          {/* Categories Builder */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold border-b pb-1">Questionnaire Categories & Sub-Factors</h3>
            <div className="flex flex-wrap items-end gap-3 p-3 rounded-md bg-secondary/40">
              <div className="space-y-1">
                <Label className="text-xs">Number of categories</Label>
                <Input type="number" min={1} max={20} value={numCats} onChange={e => setNumCats(Math.max(1, Number(e.target.value) || 1))} className="w-28" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Sub-factors per category</Label>
                <Input type="number" min={1} max={20} value={factorsPerCat} onChange={e => setFactorsPerCat(Math.max(1, Number(e.target.value) || 1))} className="w-28" />
              </div>
              <Button type="button" size="sm" variant="hero-outline" onClick={buildTable}>
                <Wand2 className="w-3 h-3 mr-1" /> Build table
              </Button>
            </div>

            <div className="space-y-2">
              {(header.categories || []).map((c, ci) => (
                <div key={c.id} className="border rounded-md p-2 bg-background">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-muted-foreground w-6">{ci + 1}.</span>
                    <Input
                      value={c.category}
                      onChange={e => updateCat(ci, { category: e.target.value })}
                      placeholder="Category name"
                      className="flex-1 h-8 font-medium"
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeCat(ci)} className="h-7 w-7 text-destructive">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="pl-8 space-y-1">
                    {c.factors.map((f, fi) => (
                      <div key={fi} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">•</span>
                        <Input
                          value={f}
                          onChange={e => updateFactor(ci, fi, e.target.value)}
                          placeholder={`Sub-factor ${fi + 1}`}
                          className="h-7 text-sm flex-1"
                        />
                        {c.factors.length > 1 && (
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeFactor(ci, fi)} className="h-6 w-6">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="ghost" size="sm" onClick={() => addFactor(ci)} className="h-7 text-xs">
                      <Plus className="w-3 h-3 mr-1" /> Add sub-factor
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addCat}>
                <Plus className="w-3 h-3 mr-1" /> Add category
              </Button>
            </div>
          </section>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="button" variant="hero" onClick={submit}>Submit & Preview</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PresetDialog;
