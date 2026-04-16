import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/landing/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSurveyStore } from '@/store/surveyStore';
import type { Question, QuestionType, QuestionOption, PairwiseFactor, InstitutionalHeader } from '@/types/survey';
import { Plus, Trash2, GripVertical, Save, ArrowLeft, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

const questionTypeLabels: Record<QuestionType, string> = {
  multiple_choice: 'Multiple Choice',
  likert: 'Likert Scale',
  open_ended: 'Open-Ended Text',
  dropdown: 'Dropdown',
  checkbox: 'Checkbox (Multi-select)',
  ism_pairwise: 'ISM Pairwise',
  ahp_pairwise: 'AHP Pairwise',
};

const CreateSurvey = () => {
  const navigate = useNavigate();
  const store = useSurveyStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [collectIdentity, setCollectIdentity] = useState(false);
  const [header, setHeader] = useState<InstitutionalHeader>({
    university: '', school: '', department: '', researchTitle: '',
    purposeStatement: '', researcherName: '', researcherPhone: '',
    researcherEmail: '', advisorName: '',
  });
  const updateHeader = (field: keyof InstitutionalHeader, v: string) =>
    setHeader(prev => ({ ...prev, [field]: v }));

  const addQuestion = () => {
    const newQ: Question = {
      id: `q_${Date.now()}`,
      type: 'multiple_choice',
      title: '',
      required: true,
      options: [
        { id: `o_${Date.now()}_1`, label: 'Option 1' },
        { id: `o_${Date.now()}_2`, label: 'Option 2' },
      ],
    };
    setQuestions([...questions, newQ]);
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], ...updates };
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const addOption = (qIndex: number) => {
    const q = questions[qIndex];
    const options = [...(q.options || []), { id: `o_${Date.now()}`, label: `Option ${(q.options?.length || 0) + 1}` }];
    updateQuestion(qIndex, { options });
  };

  const updateOption = (qIndex: number, oIndex: number, label: string) => {
    const q = questions[qIndex];
    const options = [...(q.options || [])];
    options[oIndex] = { ...options[oIndex], label };
    updateQuestion(qIndex, { options });
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const q = questions[qIndex];
    const options = (q.options || []).filter((_, i) => i !== oIndex);
    updateQuestion(qIndex, { options });
  };

  const handleSave = (status: 'draft' | 'active') => {
    if (!title.trim()) { toast.error('Please enter a survey title'); return; }
    if (questions.length === 0) { toast.error('Add at least one question'); return; }
    if (questions.some(q => !q.title.trim())) { toast.error('All questions need a title'); return; }

    store.addSurvey({
      title, description, instructions, isPublic, isAnonymous, questions, status,
      collectIdentity,
      ...(collectIdentity && header.university.trim() ? { institutionalHeader: header } : {}),
    });
    toast.success(status === 'draft' ? 'Survey saved as draft' : 'Survey published!');
    navigate('/dashboard');
  };

  const needsOptions = (type: QuestionType) => ['multiple_choice', 'checkbox', 'dropdown'].includes(type);
  const needsFactors = (type: QuestionType) => ['ism_pairwise', 'ahp_pairwise'].includes(type);

  const addFactor = (qIndex: number) => {
    const q = questions[qIndex];
    const factors = [...(q.factors || []), { id: `f_${Date.now()}`, label: `Factor ${(q.factors?.length || 0) + 1}` }];
    updateQuestion(qIndex, { factors });
  };

  const updateFactor = (qIndex: number, fIndex: number, label: string) => {
    const q = questions[qIndex];
    const factors = [...(q.factors || [])];
    factors[fIndex] = { ...factors[fIndex], label };
    updateQuestion(qIndex, { factors });
  };

  const removeFactor = (qIndex: number, fIndex: number) => {
    const q = questions[qIndex];
    const factors = (q.factors || []).filter((_, i) => i !== fIndex);
    updateQuestion(qIndex, { factors });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold">Create Survey</h1>
        </div>

        {/* Survey Details */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Survey Details</h2>
          <div className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter survey title..." className="mt-1" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your survey..." className="mt-1" />
            </div>
            <div>
              <Label>Instructions for respondents</Label>
              <Textarea value={instructions} onChange={e => setInstructions(e.target.value)} placeholder="Any special instructions..." className="mt-1" rows={2} />
            </div>
            <div className="flex gap-8">
              <div className="flex items-center gap-2">
                <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                <Label>Public survey</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                <Label>Anonymous responses</Label>
              </div>
            </div>
          </div>
        </Card>

        {/* Institutional Header (any researcher worldwide) */}
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Institutional Header & Respondent Identity</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Optional. Fill in your university and researcher details — works for any institution worldwide.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Switch checked={collectIdentity} onCheckedChange={setCollectIdentity} />
              <Label>Enable</Label>
            </div>
          </div>

          {collectIdentity && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label>University / Institution *</Label>
                <Input value={header.university} onChange={e => updateHeader('university', e.target.value)} placeholder="e.g. Adama Science and Technology University" maxLength={200} />
              </div>
              <div className="space-y-2">
                <Label>School / Faculty</Label>
                <Input value={header.school} onChange={e => updateHeader('school', e.target.value)} placeholder="e.g. School of Civil Engineering and Architecture" maxLength={200} />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input value={header.department} onChange={e => updateHeader('department', e.target.value)} placeholder="e.g. Department of Construction Engineering and Management" maxLength={200} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Research Title</Label>
                <Textarea value={header.researchTitle} onChange={e => updateHeader('researchTitle', e.target.value)} placeholder="Full title of your research / dissertation" rows={2} maxLength={500} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Purpose Statement</Label>
                <Textarea value={header.purposeStatement} onChange={e => updateHeader('purposeStatement', e.target.value)} placeholder="e.g. Results will be used strictly for academic purposes and treated with full confidentiality." rows={2} maxLength={500} />
              </div>
              <div className="space-y-2">
                <Label>Researcher Name</Label>
                <Input value={header.researcherName} onChange={e => updateHeader('researcherName', e.target.value)} placeholder="Your full name" maxLength={120} />
              </div>
              <div className="space-y-2">
                <Label>Advisor / Supervisor</Label>
                <Input value={header.advisorName} onChange={e => updateHeader('advisorName', e.target.value)} placeholder="e.g. Dr. Jane Doe" maxLength={120} />
              </div>
              <div className="space-y-2">
                <Label>Researcher Phone</Label>
                <Input value={header.researcherPhone} onChange={e => updateHeader('researcherPhone', e.target.value)} placeholder="e.g. +1 555 123 4567" maxLength={40} />
              </div>
              <div className="space-y-2">
                <Label>Researcher Email</Label>
                <Input type="email" value={header.researcherEmail} onChange={e => updateHeader('researcherEmail', e.target.value)} placeholder="you@university.edu" maxLength={150} />
              </div>
            </div>
          )}
        </Card>

        {/* Questions */}
        <div className="space-y-4 mb-6">
          {questions.map((q, qi) => (
            <Card key={q.id} className="p-6 animate-scale-in">
              <div className="flex items-start gap-3">
                <GripVertical className="w-5 h-5 text-muted-foreground mt-2 cursor-grab" />
                <div className="flex-1 space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input value={q.title} onChange={e => updateQuestion(qi, { title: e.target.value })} placeholder="Question text..." />
                    </div>
                    <Select value={q.type} onValueChange={(v: QuestionType) => updateQuestion(qi, { type: v, ...(needsOptions(v) && !q.options?.length ? { options: [{ id: `o_${Date.now()}_1`, label: 'Option 1' }] } : {}), ...(needsFactors(v) && !q.factors?.length ? { factors: [{ id: `f_${Date.now()}_1`, label: 'Factor 1' }, { id: `f_${Date.now()}_2`, label: 'Factor 2' }] } : {}) })}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(questionTypeLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {q.type === 'likert' && (
                    <div className="flex items-center gap-3">
                      <Label className="text-sm">Scale:</Label>
                      <Select value={String(q.likertScale || 5)} onValueChange={v => updateQuestion(qi, { likertScale: Number(v) as 5 | 7 })}>
                        <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">1–5</SelectItem>
                          <SelectItem value="7">1–7</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {needsOptions(q.type) && (
                    <div className="space-y-2 pl-4">
                      {q.options?.map((opt, oi) => (
                        <div key={opt.id} className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground w-6">{oi + 1}.</span>
                          <Input value={opt.label} onChange={e => updateOption(qi, oi, e.target.value)} className="flex-1" />
                          {(q.options?.length || 0) > 1 && (
                            <Button variant="ghost" size="icon" onClick={() => removeOption(qi, oi)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button variant="ghost" size="sm" onClick={() => addOption(qi)}>
                        <Plus className="w-3 h-3 mr-1" /> Add option
                      </Button>
                    </div>
                  )}

                  {needsFactors(q.type) && (
                    <div className="space-y-2 pl-4">
                      <Label className="text-sm text-muted-foreground">Factors for pairwise comparison:</Label>
                      {q.factors?.map((f, fi) => (
                        <div key={f.id} className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground w-6">{fi + 1}.</span>
                          <Input value={f.label} onChange={e => updateFactor(qi, fi, e.target.value)} className="flex-1" />
                          {(q.factors?.length || 0) > 2 && (
                            <Button variant="ghost" size="icon" onClick={() => removeFactor(qi, fi)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button variant="ghost" size="sm" onClick={() => addFactor(qi)}>
                        <Plus className="w-3 h-3 mr-1" /> Add factor
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        {(q.factors?.length || 0)} factors → {Math.max(0, ((q.factors?.length || 0) * ((q.factors?.length || 0) - 1)) / 2)} pairs
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Switch checked={q.required} onCheckedChange={v => updateQuestion(qi, { required: v })} />
                      <Label className="text-sm">Required</Label>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeQuestion(qi)} className="text-destructive">
                      <Trash2 className="w-3 h-3 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button variant="outline" onClick={addQuestion} className="w-full mb-8 border-dashed h-14">
          <Plus className="w-4 h-4 mr-2" />
          Add Question
        </Button>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => handleSave('draft')}>
            <Save className="w-4 h-4" /> Save Draft
          </Button>
          <Button variant="hero" onClick={() => handleSave('active')}>
            Publish Survey
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateSurvey;
