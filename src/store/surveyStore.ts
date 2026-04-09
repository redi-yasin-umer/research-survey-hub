import { useState } from 'react';
import type { Survey, SurveyResponse } from '@/types/survey';

const ISM_FACTORS = [
  { id: 'f1', label: 'Government support and incentives', category: 'Strategic & Policy' },
  { id: 'f2', label: 'Clear regulatory framework', category: 'Strategic & Policy' },
  { id: 'f3', label: 'Standardization of prefabricated components', category: 'Strategic & Policy' },
  { id: 'f4', label: 'Stable national housing policy', category: 'Strategic & Policy' },
  { id: 'f5', label: 'Public–private strategic collaboration', category: 'Strategic & Policy' },
  { id: 'f6', label: 'Early stakeholder involvement', category: 'Supply Chain Integration' },
  { id: 'f7', label: 'Collaboration among designers, manufacturers, and contractors', category: 'Supply Chain Integration' },
  { id: 'f8', label: 'Integrated supply chain planning', category: 'Supply Chain Integration' },
  { id: 'f9', label: 'Long-term supplier partnerships', category: 'Supply Chain Integration' },
  { id: 'f10', label: 'Supply chain communication and information sharing', category: 'Supply Chain Integration' },
  { id: 'f11', label: 'Designers\' experience in prefabrication', category: 'Design & Engineering' },
  { id: 'f12', label: 'Adoption of Building Information Modeling (BIM)', category: 'Design & Engineering' },
  { id: 'f13', label: 'Design for Manufacturing and Assembly', category: 'Design & Engineering' },
  { id: 'f14', label: 'High design accuracy and reduced changes', category: 'Design & Engineering' },
  { id: 'f15', label: 'Manufacturers\' experience', category: 'Manufacturing & Production' },
  { id: 'f16', label: 'Advanced manufacturing technology', category: 'Manufacturing & Production' },
  { id: 'f17', label: 'Quality control in component production', category: 'Manufacturing & Production' },
  { id: 'f18', label: 'Transportation planning for prefabricated components', category: 'Logistics & Transportation' },
  { id: 'f19', label: 'Reliable logistics infrastructure', category: 'Logistics & Transportation' },
  { id: 'f20', label: 'Competent project management', category: 'Project Management' },
  { id: 'f21', label: 'Availability of skilled labor', category: 'Human Resource & Knowledge' },
];

const AHP_CATEGORIES = [
  { id: 'c1', label: 'Strategic & Policy' },
  { id: 'c2', label: 'Supply Chain Integration' },
  { id: 'c3', label: 'Design & Engineering' },
  { id: 'c4', label: 'Manufacturing & Production' },
  { id: 'c5', label: 'Logistics & Transportation' },
  { id: 'c6', label: 'Project Management' },
  { id: 'c7', label: 'Human Resource & Knowledge' },
];

let surveys: Survey[] = [
  {
    id: 'ism-demo',
    title: 'ISM Questionnaire – Supply Chain Factors for Prefabricated Housing',
    description: 'Identify the direct interrelationship between success factors of Integrated Supply Chain and Logistics Management for Prefabricated Housing Projects in Ethiopia.',
    instructions: 'For each pair of factors, identify only the direct interrelationship: → means A leads to B, ← means B leads to A, ↔ means both influence each other, × means no relationship.',
    isPublic: true,
    isAnonymous: false,
    createdAt: new Date().toISOString(),
    status: 'active',
    responseCount: 0,
    questions: [
      {
        id: 'demo_info', type: 'dropdown', title: 'Relevant working experience',
        required: true,
        options: [
          { id: 'y1', label: '1–5 years' },
          { id: 'y2', label: '6–10 years' },
          { id: 'y3', label: '11–15 years' },
          { id: 'y4', label: '16–21 years' },
          { id: 'y5', label: 'More than 20 years' },
        ],
      },
      {
        id: 'ism_q1', type: 'ism_pairwise',
        title: 'Pairwise Relationship Assessment (ISM)',
        description: 'Identify the direct interrelationship between these success factors. Which factor leads to or influences the other?',
        required: true,
        factors: ISM_FACTORS,
      },
    ],
  },
  {
    id: 'ahp-demo',
    title: 'AHP Questionnaire – Prioritizing Success Factor Categories',
    description: 'Conduct a pairwise comparison to identify the weight of success factor categories for supply chain and logistics management for prefabricated housing projects in Ethiopia.',
    instructions: 'Compare each pair of categories based on their importance. Select a value on the 1–9 scale: left side means Factor A is more important, right side means Factor B is more important, center (1) means equally important.',
    isPublic: true,
    isAnonymous: false,
    createdAt: new Date().toISOString(),
    status: 'active',
    responseCount: 0,
    questions: [
      {
        id: 'ahp_info', type: 'dropdown', title: 'Relevant working experience',
        required: true,
        options: [
          { id: 'y1', label: '1–5 years' },
          { id: 'y2', label: '6–10 years' },
          { id: 'y3', label: '11–15 years' },
          { id: 'y4', label: '16–21 years' },
          { id: 'y5', label: 'More than 20 years' },
        ],
      },
      {
        id: 'ahp_q1', type: 'ahp_pairwise',
        title: 'Pairwise Comparison of Success Factor Categories (AHP)',
        description: 'Compare the relative importance of each pair of categories to the success of supply chain and logistics management for prefabricated housing projects.',
        required: true,
        factors: AHP_CATEGORIES,
      },
    ],
  },
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
      { id: 'q1', type: 'likert', title: 'How satisfied are you with the course content?', required: true, likertScale: 5 },
      {
        id: 'q2', type: 'multiple_choice', title: 'Which research method do you prefer?', required: true,
        options: [
          { id: 'o1', label: 'Qualitative' },
          { id: 'o2', label: 'Quantitative' },
          { id: 'o3', label: 'Mixed Methods' },
        ],
      },
      {
        id: 'q3', type: 'checkbox', title: 'Which tools do you use for data analysis?', required: false,
        options: [
          { id: 'o1', label: 'SPSS' },
          { id: 'o2', label: 'R' },
          { id: 'o3', label: 'Python' },
          { id: 'o4', label: 'Excel' },
          { id: 'o5', label: 'NVivo' },
        ],
      },
      { id: 'q4', type: 'open_ended', title: 'What improvements would you suggest?', required: false },
    ],
  },
];

let responses: SurveyResponse[] = [];

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
