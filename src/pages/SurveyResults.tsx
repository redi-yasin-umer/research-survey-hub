import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/landing/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSurveyStore } from '@/store/surveyStore';
import { ArrowLeft, Download } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CHART_COLORS = [
  'hsl(220, 90%, 56%)',
  'hsl(262, 83%, 58%)',
  'hsl(330, 80%, 60%)',
  'hsl(142, 71%, 45%)',
  'hsl(38, 92%, 50%)',
  'hsl(0, 84%, 60%)',
  'hsl(180, 70%, 45%)',
];

const SurveyResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const store = useSurveyStore();
  const survey = store.getSurvey(id || '');
  const responses = store.getResponses(id || '');

  if (!survey) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Survey not found.</p>
        </div>
      </div>
    );
  }

  const exportCSV = () => {
    const headers = ['Response ID', 'Submitted At', ...survey.questions.map(q => q.title)];
    const rows = responses.map(r => [
      r.id,
      new Date(r.submittedAt).toLocaleString(),
      ...survey.questions.map(q => {
        const ans = r.answers[q.id];
        if (Array.isArray(ans)) {
          return ans.map(a => q.options?.find(o => o.id === a)?.label || a).join('; ');
        }
        if (q.options) return q.options.find(o => o.id === ans)?.label || ans || '';
        return ans || '';
      }),
    ]);

    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${survey.title.replace(/\s+/g, '_')}_responses.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getQuestionStats = (q: typeof survey.questions[0]) => {
    const answers = responses.map(r => r.answers[q.id]).filter(Boolean);

    if (q.type === 'likert') {
      const scale = q.likertScale || 5;
      const values = answers.map(Number).filter(n => !isNaN(n));
      const mean = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
      const median = values.length ? [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)] : 0;
      const stdDev = values.length > 1
        ? Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (values.length - 1))
        : 0;

      const distribution = Array.from({ length: scale }, (_, i) => ({
        name: String(i + 1),
        count: values.filter(v => v === i + 1).length,
      }));

      return { type: 'likert' as const, mean, median, stdDev, distribution, total: values.length };
    }

    if (q.type === 'multiple_choice' || q.type === 'dropdown') {
      const counts: Record<string, number> = {};
      answers.forEach(a => { counts[a as string] = (counts[a as string] || 0) + 1; });
      const data = q.options?.map(o => ({ name: o.label, count: counts[o.id] || 0 })) || [];
      return { type: 'choice' as const, data, total: answers.length };
    }

    if (q.type === 'checkbox') {
      const counts: Record<string, number> = {};
      answers.forEach(a => (a as string[]).forEach(v => { counts[v] = (counts[v] || 0) + 1; }));
      const data = q.options?.map(o => ({ name: o.label, count: counts[o.id] || 0 })) || [];
      return { type: 'checkbox' as const, data, total: answers.length };
    }

    if (q.type === 'open_ended') {
      return { type: 'text' as const, answers: answers as string[], total: answers.length };
    }

    if (q.type === 'ism_pairwise' || q.type === 'ahp_pairwise') {
      return { type: 'pairwise' as const, total: answers.length };
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{survey.title}</h1>
              <p className="text-sm text-muted-foreground">{responses.length} responses</p>
            </div>
          </div>
          <Button variant="outline" onClick={exportCSV}>
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>

        <div className="space-y-6">
          {survey.questions.map((q, qi) => {
            const stats = getQuestionStats(q);
            if (!stats) return null;

            return (
              <Card key={q.id} className="p-6">
                <h3 className="font-semibold mb-1">Q{qi + 1}: {q.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{stats.total} responses</p>

                {stats.type === 'likert' && (
                  <div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 rounded-lg bg-secondary">
                        <div className="text-2xl font-bold text-primary">{stats.mean.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">Mean</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-secondary">
                        <div className="text-2xl font-bold text-primary">{stats.median}</div>
                        <div className="text-xs text-muted-foreground">Median</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-secondary">
                        <div className="text-2xl font-bold text-primary">{stats.stdDev.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">Std Dev</div>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={stats.distribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="hsl(220, 90%, 56%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {(stats.type === 'choice' || stats.type === 'checkbox') && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={stats.data} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                          {stats.data.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2">
                      {stats.data.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                            <span>{item.name}</span>
                          </div>
                          <span className="font-medium">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {stats.type === 'text' && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {stats.answers.filter(Boolean).map((a, i) => (
                      <div key={i} className="p-3 rounded-lg bg-secondary text-sm">{a}</div>
                    ))}
                    {stats.answers.filter(Boolean).length === 0 && (
                      <p className="text-sm text-muted-foreground">No text responses yet.</p>
                    )}
                  </div>
                )}

                {stats.type === 'pairwise' && (
                  <div className="p-4 rounded-lg bg-secondary/50 text-sm text-muted-foreground">
                    <p>{stats.total} pairwise comparison responses collected. Export to CSV/Excel for detailed analysis.</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SurveyResults;
