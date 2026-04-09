import type { Question } from '@/types/survey';
import { cn } from '@/lib/utils';

interface Props {
  question: Question;
  value: Record<string, number>;
  onChange: (value: Record<string, number>) => void;
}

const SCALE_VALUES = [9, 7, 5, 3, 1, 3, 5, 7, 9];
const SCALE_LABELS = [
  'Extremely',
  'Very strongly',
  'Strongly',
  'Moderately',
  'Equal',
  'Moderately',
  'Strongly',
  'Very strongly',
  'Extremely',
];

const AHPPairwiseQuestion = ({ question, value, onChange }: Props) => {
  const factors = question.factors || [];
  const pairs = question.pairs || generateAllPairs(factors.map(f => f.id));

  const setPairValue = (pairKey: string, position: number) => {
    // position 0-8: 0 = A strongly preferred (value -9), 4 = equal (1), 8 = B strongly preferred (9)
    const val = position < 4 ? -(SCALE_VALUES[position]) : position === 4 ? 1 : SCALE_VALUES[position];
    onChange({ ...value, [pairKey]: val });
  };

  const getFactorLabel = (id: string) => factors.find(f => f.id === id)?.label || id;

  const getSelectedPosition = (pairKey: string): number | null => {
    const val = value[pairKey];
    if (val === undefined || val === null) return null;
    if (val === 1) return 4;
    if (val < 0) return SCALE_VALUES.indexOf(-val);
    return SCALE_VALUES.lastIndexOf(val);
  };

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-lg bg-secondary/50 text-xs text-muted-foreground">
        <p>Select a value on the scale. <strong>Left</strong> = Factor A is more important. <strong>Right</strong> = Factor B is more important. <strong>Center (1)</strong> = Equally important.</p>
      </div>

      <div className="hidden md:grid grid-cols-[1fr_auto_1fr] gap-2 items-center px-2 text-xs text-muted-foreground font-medium">
        <span className="text-left">← Factor A more important</span>
        <span className="text-center w-[360px]">Equal</span>
        <span className="text-right">Factor B more important →</span>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {pairs.map((pair, idx) => {
          const pairKey = `${pair.factorA}_${pair.factorB}`;
          const selected = getSelectedPosition(pairKey);
          return (
            <div key={pairKey} className="rounded-lg border border-border p-3 hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-5 shrink-0">{idx + 1}.</span>
                <span className="text-xs font-medium text-primary flex-1 text-right min-w-0 truncate" title={getFactorLabel(pair.factorA)}>
                  {getFactorLabel(pair.factorA)}
                </span>
                <div className="flex gap-0.5 shrink-0">
                  {SCALE_VALUES.map((sv, pos) => (
                    <button
                      key={pos}
                      onClick={() => setPairValue(pairKey, pos)}
                      title={`${SCALE_LABELS[pos]} (${sv})`}
                      className={cn(
                        'w-8 h-8 rounded text-xs font-medium transition-all border',
                        pos === 4 ? 'border-primary/40' : 'border-border',
                        selected === pos
                          ? pos < 4
                            ? 'bg-primary text-primary-foreground border-primary scale-110'
                            : pos === 4
                            ? 'bg-muted-foreground text-background border-muted-foreground scale-110'
                            : 'bg-accent-foreground text-accent border-accent-foreground scale-110'
                          : 'hover:bg-secondary'
                      )}
                    >
                      {sv}
                    </button>
                  ))}
                </div>
                <span className="text-xs font-medium text-accent-foreground flex-1 min-w-0 truncate" title={getFactorLabel(pair.factorB)}>
                  {getFactorLabel(pair.factorB)}
                </span>
              </div>
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

export default AHPPairwiseQuestion;
