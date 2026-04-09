import type { Question } from '@/types/survey';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, ArrowLeftRight, X } from 'lucide-react';

interface Props {
  question: Question;
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
}

const ISM_OPTIONS = [
  { value: '→', label: 'A → B', icon: ArrowRight, description: 'A leads to B' },
  { value: '←', label: 'A ← B', icon: ArrowLeft, description: 'B leads to A' },
  { value: '↔', label: 'A ↔ B', icon: ArrowLeftRight, description: 'Both influence each other' },
  { value: '×', label: 'A × B', icon: X, description: 'No relationship' },
];

const ISMPairwiseQuestion = ({ question, value, onChange }: Props) => {
  const factors = question.factors || [];
  const pairs = question.pairs || generateAllPairs(factors.map(f => f.id));

  const setPairValue = (pairKey: string, val: string) => {
    onChange({ ...value, [pairKey]: val });
  };

  const getFactorLabel = (id: string) => factors.find(f => f.id === id)?.label || id;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 mb-4 p-3 rounded-lg bg-secondary/50">
        {ISM_OPTIONS.map(opt => (
          <div key={opt.value} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <opt.icon className="w-3 h-3" />
            <span>{opt.value} = {opt.description}</span>
          </div>
        ))}
      </div>
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {pairs.map((pair, idx) => {
          const pairKey = `${pair.factorA}_${pair.factorB}`;
          const current = value[pairKey] || '';
          return (
            <div key={pairKey} className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary/20 transition-colors">
              <span className="text-xs text-muted-foreground w-6 shrink-0">{idx + 1}.</span>
              <span className="text-sm font-medium flex-1 min-w-0">{getFactorLabel(pair.factorA)}</span>
              <div className="flex gap-1 shrink-0">
                {ISM_OPTIONS.map(opt => (
                  <Button
                    key={opt.value}
                    variant={current === opt.value ? 'default' : 'outline'}
                    size="sm"
                    className="w-9 h-9 p-0"
                    onClick={() => setPairValue(pairKey, opt.value)}
                    title={opt.description}
                  >
                    <opt.icon className="w-3.5 h-3.5" />
                  </Button>
                ))}
              </div>
              <span className="text-sm font-medium flex-1 min-w-0 text-right">{getFactorLabel(pair.factorB)}</span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground text-right">
        {Object.keys(value).length} / {pairs.length} completed
      </p>
    </div>
  );
};

function generateAllPairs(ids: string[]) {
  const pairs: { factorA: string; factorB: string }[] = [];
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      pairs.push({ factorA: ids[i], factorB: ids[j] });
    }
  }
  return pairs;
}

export default ISMPairwiseQuestion;
