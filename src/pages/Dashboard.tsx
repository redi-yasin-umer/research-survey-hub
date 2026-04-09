import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/landing/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSurveyStore } from '@/store/surveyStore';
import { Plus, BarChart3, ExternalLink, Trash2, Copy } from 'lucide-react';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  active: 'bg-success/10 text-success',
  closed: 'bg-destructive/10 text-destructive',
};

const Dashboard = () => {
  const navigate = useNavigate();
  const store = useSurveyStore();

  const copyLink = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/survey/${id}`);
    toast.success('Survey link copied!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Surveys</h1>
            <p className="text-muted-foreground mt-1">Create, manage, and analyze your questionnaires</p>
          </div>
          <Button variant="hero" onClick={() => navigate('/create')}>
            <Plus className="w-4 h-4" />
            New Survey
          </Button>
        </div>

        {store.surveys.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No surveys yet. Create your first one!</p>
            <Button onClick={() => navigate('/create')}>
              <Plus className="w-4 h-4" />
              Create Survey
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {store.surveys.map((survey) => (
              <Card key={survey.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{survey.title}</h3>
                      <Badge className={statusColors[survey.status]}>{survey.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{survey.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{survey.questions.length} questions</span>
                      <span>•</span>
                      <span>{survey.responseCount} responses</span>
                      <span>•</span>
                      <span>{new Date(survey.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="ghost" size="icon" onClick={() => copyLink(survey.id)} title="Copy link">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/survey/${survey.id}`)} title="Preview">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/results/${survey.id}`)} title="Results">
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => { store.deleteSurvey(survey.id); toast.success('Survey deleted'); }} title="Delete">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
