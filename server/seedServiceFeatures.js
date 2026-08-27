require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Service = require('./src/models/Service');

  const updates = [
    {
      slug: 'software-development',
      features: [
        'Custom SaaS Application Development',
        'CRM & ERP Systems',
        'E-Commerce Platforms',
        'API Design & Integration',
        'Mobile App Development (iOS & Android)',
        'Progressive Web Apps (PWA)',
        'Microservices Architecture',
        'Legacy System Modernization',
        'Quality Assurance & Testing',
      ],
      faqs: [
        {
          question: 'How long does a typical software project take?',
          answer: 'Project timelines vary based on scope and complexity. A typical MVP takes 8–12 weeks, while enterprise-grade systems can take 4–6 months. We establish clear milestones and timelines during the discovery phase.'
        },
        {
          question: 'Do you offer post-launch maintenance?',
          answer: 'Yes. We offer ongoing maintenance, monitoring, and support packages to ensure your software stays up-to-date, secure, and performant after launch.'
        },
        {
          question: 'What technologies do you use for development?',
          answer: 'We use modern, battle-tested stacks including React, Next.js, Node.js, Python, and cloud-native services on AWS, Azure, and Google Cloud. Technology choices are always aligned to your business needs and future scale.'
        },
      ]
    },
    {
      slug: 'digital-marketing',
      features: [
        'Search Engine Optimization (SEO)',
        'Social Media Marketing & Management',
        'Content Strategy & Creation',
        'Email Marketing Campaigns',
        'Pay-Per-Click Advertising (PPC)',
        'Conversion Rate Optimization (CRO)',
        'Analytics & Performance Reporting',
        'Brand Identity & Positioning',
        'Influencer & Affiliate Marketing',
      ],
      faqs: [
        {
          question: 'How soon will I see results from digital marketing?',
          answer: 'SEO typically shows measurable results within 3–6 months. Paid campaigns and social media campaigns can drive traffic and leads within the first 2–4 weeks.'
        },
        {
          question: 'Do you handle both organic and paid marketing?',
          answer: 'Yes. We build a holistic strategy covering both organic (SEO, content, social) and paid channels (Google Ads, Meta Ads) to maximize your reach and ROI.'
        },
        {
          question: 'Can I see regular reports on campaign performance?',
          answer: 'Absolutely. We provide detailed monthly reports with clear KPIs, campaign metrics, and actionable insights so you can see exactly how your investment is performing.'
        },
      ]
    },
    {
      slug: 'ai-agent-automations',
      features: [
        'Custom AI Chatbot Development',
        'Process Automation & Workflow Bots',
        'Natural Language Processing (NLP)',
        'Document Intelligence & OCR',
        'AI-Powered Customer Support',
        'Predictive Analytics & ML Models',
        'LLM Integration (OpenAI, Gemini, Claude)',
        'Computer Vision Solutions',
        '24/7 Automated Operations',
      ],
      faqs: [
        {
          question: 'Do I need a technical team to manage AI automations?',
          answer: 'No. We build AI systems with easy-to-use dashboards and interfaces so your business team can monitor and manage them without writing a single line of code.'
        },
        {
          question: 'Can AI automations integrate with my existing tools?',
          answer: 'Yes. We specialize in integrating AI with existing CRMs, ERPs, WhatsApp, Slack, email, and virtually any system with an API.'
        },
        {
          question: 'Are the AI agents secure and private?',
          answer: 'Yes. We follow best practices for AI safety, data privacy, and compliance. Your business data stays protected and is never used to train external models without explicit consent.'
        },
      ]
    },
    {
      slug: 'cloud-deployment',
      features: [
        'Cloud Migration (AWS, Azure, GCP)',
        'Infrastructure as Code (IaC)',
        'Kubernetes & Container Orchestration',
        'CI/CD Pipeline Setup',
        'Cloud Security & Compliance',
        'Serverless Architecture Design',
        'Cost Optimization & FinOps',
        'Disaster Recovery & Backups',
        'Performance Monitoring & Alerting',
      ],
      faqs: [
        {
          question: 'How much can cloud migration save my business?',
          answer: 'Well-planned cloud migrations typically reduce infrastructure costs by 20–40% while improving reliability and scalability. We conduct a cost analysis before any migration to establish clear ROI.'
        },
        {
          question: 'Do you support multi-cloud environments?',
          answer: 'Yes. We architect solutions that span AWS, Azure, and GCP, helping you avoid vendor lock-in and take advantage of each cloud provider\'s best-in-class services.'
        },
        {
          question: 'What happens if something goes wrong after deployment?',
          answer: 'We set up comprehensive monitoring, alerting, and disaster recovery plans for every deployment. Our support team is available to respond to critical incidents quickly.'
        },
      ]
    },
  ];

  for (const update of updates) {
    const result = await Service.updateOne(
      { slug: update.slug },
      { $set: { features: update.features, faqs: update.faqs } }
    );
    console.log(`Updated ${update.slug}: matched=${result.matchedCount}, modified=${result.modifiedCount}`);
  }

  mongoose.disconnect();
  console.log('Done!');
}).catch(e => console.error(e));
