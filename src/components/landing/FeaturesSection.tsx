import { BarChart3, CheckSquare, FileDown, Link2, Lock, Smartphone } from 'lucide-react';

const features = [
  {
    icon: CheckSquare,
    title: 'Multiple Question Types',
    description: 'Likert scales, multiple choice, checkboxes, dropdowns, and open-ended questions.',
  },
  {
    icon: Link2,
    title: 'Easy Distribution',
    description: 'Share via unique links. Public or private surveys with anonymous options.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Clean, responsive interface that works perfectly on any device.',
  },
  {
    icon: BarChart3,
    title: 'Built-in Analytics',
    description: 'Automatic charts, statistics, and frequency tables for your responses.',
  },
  {
    icon: FileDown,
    title: 'Export Anywhere',
    description: 'Download data in CSV, Excel, or PDF format. SPSS-ready exports.',
  },
  {
    icon: Lock,
    title: 'Secure & Private',
    description: 'Data privacy compliance with input validation and secure storage.',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need for
            <span className="gradient-text"> Academic Research</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From survey creation to data analysis, our platform covers the entire research workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
