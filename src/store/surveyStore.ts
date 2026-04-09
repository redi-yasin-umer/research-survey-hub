import { useState } from 'react';
import type { Survey, SurveyResponse, Question } from '@/types/survey';

// Simple in-memory store for demo mode
let surveys: Survey[] = [
  {
    id: '1',
    title: 'Research Methodology Feedback',
    description: 'Help us improve our research methodology course by sharing your experience.',
    instructions: 'Please answer all questions honestly. Your responses are anonymous.',
    isPublic: true,
    isAnonymous: true,
    createdAt: new Date().toISOString(),
    status: 'active',
    responseCount: 24,
    questions: [
      {
        id: 'q1', type: 'likert', title: 'How satisfied are you with the course content?',
        required: true, likertScale: 5,
      },
      {
        id: 'q2', type: 'multiple_choice', title: 'Which research method do you prefer?',
        required: true,
        options: [
          { id: 'o1', label: 'Qualitative' },
          { id: 'o2', label: 'Quantitative' },
          { id: 'o3', label: 'Mixed Methods' },
        ],
      },
      {
        id: 'q3', type: 'checkbox', title: 'Which tools do you use for data analysis?',
        required: false,
        options: [
          { id: 'o1', label: 'SPSS' },
          { id: 'o2', label: 'R' },
          { id: 'o3', label: 'Python' },
          { id: 'o4', label: 'Excel' },
          { id: 'o5', label: 'NVivo' },
        ],
      },
      {
        id: 'q4', type: 'open_ended', title: 'What improvements would you suggest?',
        required: false,
      },
    ],
  },
  {
    id: '2',
    title: 'Student Well-being Survey',
    description: 'A survey to assess the well-being of postgraduate students.',
    isPublic: true,
    isAnonymous: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: 'active',
    responseCount: 56,
    questions: [
      {
        id: 'q1', type: 'likert', title: 'Rate your overall well-being this semester',
        required: true, likertScale: 7,
      },
      {
        id: 'q2', type: 'dropdown', title: 'What is your current year of study?',
        required: true,
        options: [
          { id: 'o1', label: 'MSc Year 1' },
          { id: 'o2', label: 'MSc Year 2' },
          { id: 'o3', label: 'PhD Year 1' },
          { id: 'o4', label: 'PhD Year 2' },
          { id: 'o5', label: 'PhD Year 3+' },
        ],
      },
    ],
  },
];

let responses: SurveyResponse[] = [];

// Generate demo responses
function generateDemoResponses() {
  const demoResponses: SurveyResponse[] = [];
  for (let i = 0; i < 24; i++) {
    demoResponses.push({
      id: `r${i}`,
      surveyId: '1',
      answers: {
        q1: String(Math.floor(Math.random() * 5) + 1),
        q2: ['o1', 'o2', 'o3'][Math.floor(Math.random() * 3)],
        q3: [['o1', 'o3'], ['o2', 'o4'], ['o1', 'o2', 'o5'], ['o3', 'o4']][Math.floor(Math.random() * 4)],
        q4: ['Great course!', 'More practical examples needed', 'Very informative', ''][Math.floor(Math.random() * 4)],
      },
      submittedAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
    });
  }
  return demoResponses;
}

responses = generateDemoResponses();

export function useSurveyStore() {
  const [, setTick] = useState(0);
  const refresh = () => setTick(t => t + 1);

  return {
    surveys: [...surveys],
    responses: [...responses],

    getSurvey: (id: string) => surveys.find(s => s.id === id),
    getResponses: (surveyId: string) => responses.filter(r => r.surveyId === surveyId),

    addSurvey: (survey: Omit<Survey, 'id' | 'createdAt' | 'responseCount'>) => {
      const newSurvey: Survey = {
        ...survey,
        id: String(Date.now()),
        createdAt: new Date().toISOString(),
        responseCount: 0,
      };
      surveys = [...surveys, newSurvey];
      refresh();
      return newSurvey;
    },

    addResponse: (response: Omit<SurveyResponse, 'id' | 'submittedAt'>) => {
      const newResponse: SurveyResponse = {
        ...response,
        id: String(Date.now()),
        submittedAt: new Date().toISOString(),
      };
      responses = [...responses, newResponse];
      const survey = surveys.find(s => s.id === response.surveyId);
      if (survey) survey.responseCount++;
      refresh();
      return newResponse;
    },

    updateSurveyStatus: (id: string, status: Survey['status']) => {
      const survey = surveys.find(s => s.id === id);
      if (survey) {
        survey.status = status;
        refresh();
      }
    },

    deleteSurvey: (id: string) => {
      surveys = surveys.filter(s => s.id !== id);
      responses = responses.filter(r => r.surveyId !== id);
      refresh();
    },
  };
}
