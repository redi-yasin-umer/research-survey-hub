import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useSurveyStore } from '@/store/surveyStore';
import type { Question } from '@/types/survey';
import ISMPairwiseQuestion from '@/components/survey/ISMPairwiseQuestion';
import AHPPairwiseQuestion from '@/components/survey/AHPPairwiseQuestion';
import RespondentIdentityForm from '@/components/survey/RespondentIdentityForm';
import type { RespondentIdentity } from '@/types/survey';
import { FileText, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const EMPTY_IDENTITY: RespondentIdentity = {
  fullName: '', organization: '', position: '', email: '', phone: '', yearsExperience: '', notes: '',
};

const SurveyRespond = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const store = useSurveyStore();
  const survey = store.getSurvey(id || '');
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [identity, setIdentity] = useState<RespondentIdentity>(EMPTY_IDENTITY);
  const [submitted, setSubmitted] = useState(false);

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center max-w-md">
          <p className="text-muted-foreground mb-4">Survey not found.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </Card>
      </div>
    );
  }

  const setAnswer = (qId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const toggleCheckbox = (qId: string, optionId: string) => {
    const current = (answers[qId] as string[]) || [];
    const updated = current.includes(optionId)
      ? current.filter(v => v !== optionId)
      : [...current, optionId];
    setAnswer(qId, updated);
  };

  const progress = (Object.keys(answers).length / survey.questions.length) * 100;

  const handleSubmit = () => {
    const missing = survey.questions.filter(q => q.required && !answers[q.id]);
    if (missing.length > 0) {
      toast.error(`Please answer all required questions (${missing.length} remaining)`);
      return;
    }
    if (survey.collectIdentity) {
      if (!identity.fullName.trim() || !identity.organization.trim()) {
        toast.error('Please provide at least your Name and Institution.');
        return;
      }
    }
    store.addResponse({
      surveyId: survey.id,
      answers,
      ...(survey.collectIdentity ? { identity } : {}),
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-12 text-center max-w-md animate-scale-in">
          <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p className="text-muted-foreground mb-6">Your response has been recorded successfully.</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </Card>
      </div>
    );
  }

  const renderQuestion = (q: Question, index: number) => {
    switch (q.type) {
      case 'multiple_choice':
        return (
          <RadioGroup value={answers[q.id] as string || ''} onValueChange={v => setAnswer(q.id, v)}>
            <div className="space-y-2">
              {q.options?.map(opt => (
                <div key={opt.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors">
                  <RadioGroupItem value={opt.id} id={`${q.id}_${opt.id}`} />
                  <Label htmlFor={`${q.id}_${opt.id}`} className="flex-1 cursor-pointer">{opt.label}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {q.options?.map(opt => (
              <div key={opt.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors">
                <Checkbox
                  checked={((answers[q.id] as string[]) || []).includes(opt.id)}
                  onCheckedChange={() => toggleCheckbox(q.id, opt.id)}
                  id={`${q.id}_${opt.id}`}
                />
                <Label htmlFor={`${q.id}_${opt.id}`} className="flex-1 cursor-pointer">{opt.label}</Label>
              </div>
            ))}
          </div>
        );

      case 'dropdown':
        return (
          <Select value={answers[q.id] as string || ''} onValueChange={v => setAnswer(q.id, v)}>
            <SelectTrigger><SelectValue placeholder="Select an option..." /></SelectTrigger>
            <SelectContent>
              {q.options?.map(opt => (
                <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'likert': {
        const scale = q.likertScale || 5;
        const labels5 = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
        const labels7 = ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neutral', 'Somewhat Agree', 'Agree', 'Strongly Agree'];
        const labels = scale === 5 ? labels5 : labels7;
        return (
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>{labels[0]}</span>
              <span>{labels[labels.length - 1]}</span>
            </div>
            <div className="flex gap-2 justify-center">
              {Array.from({ length: scale }, (_, i) => i + 1).map(v => (
                <button
                  key={v}
                  onClick={() => setAnswer(q.id, String(v))}
                  className={`w-12 h-12 rounded-xl border-2 text-sm font-medium transition-all ${
                    answers[q.id] === String(v)
                      ? 'border-primary bg-primary text-primary-foreground scale-110'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        );
      }

      case 'open_ended':
        return (
          <Textarea
            value={answers[q.id] as string || ''}
            onChange={e => setAnswer(q.id, e.target.value)}
            placeholder="Type your answer..."
            rows={3}
          />
        );

      case 'ism_pairwise':
        return (
          <ISMPairwiseQuestion
            question={q}
            value={(answers[q.id] as Record<string, string>) || {}}
            onChange={v => setAnswer(q.id, v)}
          />
        );

      case 'ahp_pairwise':
        return (
          <AHPPairwiseQuestion
            question={q}
            value={(answers[q.id] as Record<string, number>) || {}}
            onChange={v => setAnswer(q.id, v)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-bg py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-primary-foreground" />
            <span className="text-sm text-primary-foreground/80">ResearchQ</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground">{survey.title}</h1>
          {survey.description && <p className="text-primary-foreground/80 mt-2">{survey.description}</p>}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-4">
        <div className="sticky top-0 z-10 bg-background pt-4 pb-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1 text-right">{Math.round(progress)}% complete</p>
        </div>

        {survey.collectIdentity && (
          <RespondentIdentityForm value={identity} onChange={setIdentity} />
        )}

        {survey.instructions && (
          <Card className="p-4 mb-6 bg-primary/5 border-primary/20">
            <p className="text-sm text-muted-foreground">{survey.instructions}</p>
          </Card>
        )}

        <div className="space-y-6 pb-8">
          {survey.questions.map((q, i) => (
            <Card key={q.id} className="p-6 animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="mb-4">
                <div className="flex items-start gap-2">
                  <span className="text-sm font-medium text-muted-foreground">{i + 1}.</span>
                  <div>
                    <h3 className="font-medium">
                      {q.title}
                      {q.required && <span className="text-destructive ml-1">*</span>}
                    </h3>
                    {q.description && <p className="text-sm text-muted-foreground mt-1">{q.description}</p>}
                  </div>
                </div>
              </div>
              {renderQuestion(q, i)}
            </Card>
          ))}

          <Button variant="hero" size="lg" className="w-full" onClick={handleSubmit}>
            <Send className="w-4 h-4" />
            Submit Response
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SurveyRespond;
