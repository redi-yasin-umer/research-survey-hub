import type { InstitutionalHeader, Question } from '@/types/survey';
import { GraduationCap } from 'lucide-react';

interface Props {
  header: InstitutionalHeader;
  questions: Question[];
  mode: 'ahp' | 'ism';
}

const SCALE = [9, 7, 5, 3, 1, 3, 5, 7, 9];
const SCALE_LABELS = [
  'Extremely important',
  'Very strongly important',
  'strongly important',
  'Moderately important',
  'Equally',
  'Moderately important',
  'strongly important',
  'Very strongly important',
  'Extremely important',
];

const ISM_SYMS = ['→', '←', '↔', '×'];

function generateAllPairs(ids: string[]) {
  const pairs: { factorA: string; factorB: string }[] = [];
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      pairs.push({ factorA: ids[i], factorB: ids[j] });
    }
  }
  return pairs;
}

const QuestionnairePreview = ({ header, questions, mode }: Props) => {
  const cats = header.categories || [];

  return (
    <div className="bg-white text-black rounded-lg shadow-lg border border-border p-6 md:p-10 font-serif print:shadow-none print:border-0">
      {/* HEADER */}
      <div className="text-center space-y-2">
        <p className="font-bold text-base md:text-lg">
          Appendix {mode === 'ahp' ? 'E' : 'F'}: Questionnaire for {mode.toUpperCase()}
        </p>
        <div className="flex justify-center my-3">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-red-700 flex items-center justify-center bg-white">
            <GraduationCap className="w-12 h-12 text-red-700" />
          </div>
        </div>
        {header.university && <p className="font-bold text-base md:text-lg">{header.university}</p>}
        {header.school && <p className="font-bold text-sm md:text-base">{header.school}</p>}
        {header.department && <p className="font-bold text-sm md:text-base">{header.department}</p>}
        {header.researchTitle && (
          <>
            <p className="text-sm mt-2">Questionnaire survey for study paper on</p>
            <p className="font-semibold text-sm md:text-base px-2">{header.researchTitle}</p>
          </>
        )}
      </div>

      {/* PURPOSE */}
      {header.purposeStatement && (
        <p className="text-sm mt-5 text-justify leading-relaxed whitespace-pre-line">{header.purposeStatement}</p>
      )}

      {/* SIGNATURE BLOCK */}
      {(header.researcherName || header.researcherPhone || header.advisorName) && (
        <div className="mt-6 text-right text-sm space-y-0.5">
          {header.researcherName && <p>Name- {header.researcherName}</p>}
          {header.researcherPhone && <p>Phone NO - {header.researcherPhone}</p>}
          {header.researcherEmail && <p>Email - {header.researcherEmail}</p>}
          {header.advisorName && <p>Advisor- {header.advisorName}</p>}
        </div>
      )}

      {/* GENERAL INFORMATION TABLE */}
      <div className="mt-8">
        <p className="text-center font-semibold italic mb-2">General information</p>
        <table className="w-full border border-black text-xs md:text-sm">
          <tbody>
            <tr><td className="border border-black p-2 w-1/3">Name of the organization</td><td className="border border-black p-2 h-7">&nbsp;</td></tr>
            <tr><td className="border border-black p-2">Respondent's position in the organization</td><td className="border border-black p-2 h-7">&nbsp;</td></tr>
            <tr><td className="border border-black p-2">Level of education of the respondent</td><td className="border border-black p-2 h-7">&nbsp;</td></tr>
            <tr>
              <td className="border border-black p-2">Relevant working experience</td>
              <td className="border border-black p-1">
                <div className="flex flex-wrap gap-2 text-xs">
                  {['1-5 years', '6-10 years', '11-15', '16-21 years', 'more than 20 years'].map(r => (
                    <span key={r} className="border border-black px-2 py-0.5">{r} ▢</span>
                  ))}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* OBJECTIVE / METHOD / INSTRUCTION / EXAMPLE */}
      {header.objective && (
        <div className="mt-6">
          <p className="text-center font-semibold italic">Objective of the study</p>
          <p className="text-sm whitespace-pre-line text-justify mt-1">{header.objective}</p>
        </div>
      )}
      {header.methodDescription && (
        <div className="mt-4">
          <p className="text-center font-semibold italic">Method</p>
          <p className="text-sm whitespace-pre-line text-justify mt-1">{header.methodDescription}</p>
        </div>
      )}
      {header.instructionDescription && (
        <div className="mt-4">
          <p className="text-center font-semibold italic">Instruction</p>
          <p className="text-sm whitespace-pre-line text-justify mt-1">{header.instructionDescription}</p>
        </div>
      )}
      {header.exampleDescription && (
        <div className="mt-4 border border-black p-3 bg-gray-50">
          <p className="font-semibold italic mb-1">Example</p>
          <p className="text-sm whitespace-pre-line">{header.exampleDescription}</p>
        </div>
      )}

      {/* CATEGORIES & SUCCESS FACTORS TABLE */}
      {cats.length > 0 && (
        <div className="mt-8">
          <p className="text-center font-semibold italic mb-2">Categories and Success Factors</p>
          <table className="w-full border border-black text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-2 text-left w-8">#</th>
                <th className="border border-black p-2 text-left">Category</th>
                <th className="border border-black p-2 text-left">Success Factors</th>
              </tr>
            </thead>
            <tbody>
              {cats.map((c, i) => (
                <tr key={c.id} className="align-top">
                  <td className="border border-black p-2">{i + 1}</td>
                  <td className="border border-black p-2 font-semibold">{c.category || '—'}</td>
                  <td className="border border-black p-2">
                    <ul className="list-disc list-inside space-y-0.5">
                      {c.factors.filter(Boolean).map((f, fi) => (<li key={fi}>{f}</li>))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PAIRWISE TABLES */}
      {questions.map((q, qIdx) => {
        const factors = q.factors || [];
        const pairs = q.pairs?.length ? q.pairs : generateAllPairs(factors.map(f => f.id));
        const labelOf = (id: string) => factors.find(f => f.id === id)?.label || id;

        return (
          <div key={q.id} className="mt-8">
            <p className="font-semibold text-sm md:text-base mb-2">
              {qIdx + 1}. {q.title || 'Pairwise Comparison'}
            </p>
            {q.description && <p className="text-xs md:text-sm italic mb-2">{q.description}</p>}

            <div className="overflow-x-auto">
              <table className="w-full border border-black text-[10px] md:text-xs min-w-[640px]">
                <thead>
                  <tr>
                    <th className="border border-black p-1 w-6">#</th>
                    <th className="border border-black p-1">Factor A</th>
                    {mode === 'ahp' ? (
                      SCALE.map((s, i) => (
                        <th key={i} className="border border-black p-1 align-bottom">
                          <div className="rotate-180 [writing-mode:vertical-rl] text-[9px] md:text-[10px] mx-auto whitespace-nowrap">
                            {SCALE_LABELS[i]}
                          </div>
                        </th>
                      ))
                    ) : (
                      ISM_SYMS.map(s => (
                        <th key={s} className="border border-black p-1">{s}</th>
                      ))
                    )}
                    <th className="border border-black p-1">Factor B</th>
                  </tr>
                  {mode === 'ahp' && (
                    <tr className="bg-orange-100">
                      <th className="border border-black p-1"></th>
                      <th className="border border-black p-1"></th>
                      {SCALE.map((s, i) => (
                        <th key={i} className={`border border-black p-1 ${i === 4 ? 'bg-orange-300' : ''}`}>{s}</th>
                      ))}
                      <th className="border border-black p-1"></th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {pairs.map((p, i) => (
                    <tr key={i}>
                      <td className="border border-black p-1 text-center">{i + 1}</td>
                      <td className="border border-black p-1">{labelOf(p.factorA)}</td>
                      {mode === 'ahp' ? (
                        SCALE.map((s, j) => (
                          <td key={j} className={`border border-black p-1 text-center ${j === 4 ? 'bg-orange-200' : ''}`}>
                            <span className="inline-block w-5 h-5 leading-5 rounded-full border border-black/40">{s}</span>
                          </td>
                        ))
                      ) : (
                        ISM_SYMS.map(s => (
                          <td key={s} className="border border-black p-1 text-center">
                            <span className="inline-block w-5 h-5 leading-5 rounded border border-black/40">▢</span>
                          </td>
                        ))
                      )}
                      <td className="border border-black p-1">{labelOf(p.factorB)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuestionnairePreview;
