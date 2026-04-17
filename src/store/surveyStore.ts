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

const ASTU_HEADER = {
  university: 'Adama Science and Technology University',
  school: 'School of Civil Engineering and Architecture',
  department: 'Department of Construction Engineering and Management',
  researchTitle:
    'Success Factors and Their Interrelationships in Integrated Supply Chain and Logistics Management for Prefabricated Housing Projects in Ethiopia: An AHP–ISM–Quadrant Analysis Approach',
  purposeStatement:
    'Results will be used strictly for academic purposes and treated with full confidentiality.',
  researcherName: 'Redi Yasin',
  researcherPhone: '0923766115',
  advisorName: 'Fikreyesus Demeke (PhD)',
};

let surveys: Survey[] = [];

let responses: SurveyResponse[] = [];

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
