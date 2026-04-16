import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GraduationCap } from 'lucide-react';
import type { InstitutionalHeader, RespondentIdentity } from '@/types/survey';

interface Props {
  value: RespondentIdentity;
  onChange: (value: RespondentIdentity) => void;
  header?: InstitutionalHeader;
}

const RespondentIdentityForm = ({ value, onChange, header }: Props) => {
  const update = (field: keyof RespondentIdentity, v: string) => {
    onChange({ ...value, [field]: v });
  };

  const meta: string[] = [];
  if (header?.researcherName) meta.push(`Researcher: ${header.researcherName}`);
  if (header?.researcherPhone) meta.push(`Phone: ${header.researcherPhone}`);
  if (header?.researcherEmail) meta.push(`Email: ${header.researcherEmail}`);
  if (header?.advisorName) meta.push(`Advisor: ${header.advisorName}`);

  return (
    <Card className="p-6 mb-6 border-primary/20">
      {/* Institutional Header — fully driven by survey config */}
      {header && (
        <div className="flex items-start gap-3 mb-6 pb-6 border-b border-border">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            {header.university && (
              <h2 className="font-bold text-base text-foreground">{header.university}</h2>
            )}
            {header.school && <p className="text-sm text-muted-foreground">{header.school}</p>}
            {header.department && (
              <p className="text-sm text-muted-foreground">{header.department}</p>
            )}
            {(header.researchTitle || header.purposeStatement) && (
              <div className="mt-3 text-xs text-muted-foreground space-y-1">
                {header.researchTitle && (
                  <p>
                    This survey is part of the research titled <em>"{header.researchTitle}"</em>.
                  </p>
                )}
                {header.purposeStatement && <p>{header.purposeStatement}</p>}
              </div>
            )}
            {meta.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">{meta.join(' · ')}</p>
            )}
          </div>
        </div>
      )}

      {/* Respondent Identity Fields */}
      <div>
        <h3 className="font-semibold mb-1">Respondent Information</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Your information will remain confidential and is used solely for academic verification.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="r-name">Full Name</Label>
            <Input
              id="r-name"
              value={value.fullName}
              onChange={e => update('fullName', e.target.value)}
              placeholder="Your full name"
              maxLength={120}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="r-org">Institution / Company</Label>
            <Input
              id="r-org"
              value={value.organization}
              onChange={e => update('organization', e.target.value)}
              placeholder="e.g. Your university or company"
              maxLength={150}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="r-position">Position / Role</Label>
            <Input
              id="r-position"
              value={value.position}
              onChange={e => update('position', e.target.value)}
              placeholder="e.g. Project Manager, Engineer"
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="r-exp">Years of Relevant Experience</Label>
            <Input
              id="r-exp"
              value={value.yearsExperience}
              onChange={e => update('yearsExperience', e.target.value)}
              placeholder="e.g. 6–10 years"
              maxLength={30}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="r-email">Email</Label>
            <Input
              id="r-email"
              type="email"
              value={value.email}
              onChange={e => update('email', e.target.value)}
              placeholder="you@example.com"
              maxLength={150}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="r-phone">Phone</Label>
            <Input
              id="r-phone"
              value={value.phone}
              onChange={e => update('phone', e.target.value)}
              placeholder="e.g. +1 555 123 4567"
              maxLength={30}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="r-notes">Open Comments (optional)</Label>
            <Textarea
              id="r-notes"
              value={value.notes}
              onChange={e => update('notes', e.target.value)}
              placeholder="Any additional remarks you would like to share..."
              rows={3}
              maxLength={1000}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RespondentIdentityForm;
