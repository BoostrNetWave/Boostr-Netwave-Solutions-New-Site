require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Blog = require('./src/models/Blog');
  const Career = require('./src/models/Career');
  const ClientProject = require('./src/models/ClientProject');

  console.log('Seeding Blogs...');
  await Blog.deleteMany({});
  const blogs = [
    {
      title: '7 SaaS Inbound Marketing: Strategies, Benefits, and Trends',
      slug: 'saas-inbound-marketing',
      excerpt: 'Explore SaaS inbound marketing strategies, benefits, challenges, and future trends.',
      content: '<p>Explore SaaS inbound marketing strategies, benefits, challenges, and future trends. Learn how to attract and retain customers with this comprehensive guide.</p>',
      category: 'Marketing',
      publishedAt: new Date('2024-08-14'),
      isPublished: true,
      readTime: 6,
      coverImage: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_ab2bf4654e_f72a7888aa152eab.png'
    },
    {
      title: 'Best ChatGPT Plugins for SaaS Businesses',
      slug: 'best-chatgpt-plugins-for-saas-businesses',
      excerpt: 'Discover the best ChatGPT plugins for SaaS businesses to enhance efficiency and automate tasks.',
      content: '<p>Discover the best ChatGPT plugins for SaaS businesses to enhance efficiency, automate tasks, and streamline operations. Explore plugins like WebPilot, AskYourPDF, Make A Sheet, and more, with insights on their features, use cases, and integration tips.</p>',
      category: 'Business & AI',
      publishedAt: new Date('2024-08-05'),
      isPublished: true,
      readTime: 5,
      coverImage: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_1472fbbb85_810e30e8e5495fb3.png'
    },
    {
      title: 'FOMO Marketing Strategy: Boost Engagement and Sales with Proven Tactics',
      slug: 'fomo-marketing-strategy',
      excerpt: 'Discover effective FOMO marketing strategies and examples that can boost your brand\'s engagement and sales.',
      content: '<p>Discover effective FOMO marketing strategies and examples that can boost your brand\'s engagement and sales. Learn how to leverage urgency, scarcity, and exclusivity to drive consumer action and enhance customer loyalty.</p>',
      category: 'Marketing',
      publishedAt: new Date('2024-07-31'),
      isPublished: true,
      readTime: 4,
      coverImage: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_445eafe19e_70fde5087b439136.png'
    },
    {
      title: '11 SaaS Marketing Metrics You Need to Track in 2024',
      slug: 'saas-marketing-metrics',
      excerpt: 'Discover the top SaaS marketing metrics you need to track in 2024 to optimize your strategies and drive growth.',
      content: '<p>Discover the top SaaS marketing metrics you need to track in 2024 to optimize your strategies and drive growth. Learn about CAC, churn rate, NPS, and more in our comprehensive guide.</p>',
      category: 'Marketing',
      publishedAt: new Date('2024-07-23'),
      isPublished: true,
      readTime: 7,
      coverImage: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_48dfc6b2ef_16726e538bb6ff33.png'
    },
    {
      title: 'Top 10 SaaS Marketing Tools for Generating Leads and Sales',
      slug: 'top-10-saas-marketing-tools',
      excerpt: 'Discover the top 10 SaaS marketing tools that drive leads and sales.',
      content: '<p>Discover the top 10 SaaS marketing tools that drive leads and sales. Learn about Google Analytics, SEMrush, HubSpot, and more. Enhance your digital marketing strategies with these powerful tools!</p>',
      category: 'Marketing',
      publishedAt: new Date('2024-07-19'),
      isPublished: true,
      readTime: 5,
      coverImage: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_b54187a22f_6f0f5d87da3d3938.png'
    },
    {
      title: 'What is SaaS Content Marketing: 7-Step Guide for 2024?',
      slug: 'saas-content-marketing',
      excerpt: 'Discover expert strategies for SaaS content marketing. Learn how to create engaging and relevant content consistently.',
      content: '<p>Discover expert strategies for SaaS content marketing. Learn how to create engaging and relevant content consistently to boost your brand and attract more customers.</p>',
      category: 'Marketing',
      publishedAt: new Date('2024-07-16'),
      isPublished: true,
      readTime: 8,
      coverImage: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_19ef541487_d1d1d016974b4a88.png'
    },
    {
      title: '7 Benefits Of Custom Software Development',
      slug: '7-benefits-of-custom-software-development',
      excerpt: 'The modern world is fast developing especially in the parts of technology and as…',
      content: '<p>The modern world is fast developing especially in the parts of technology and as... (Full content to be added)</p>',
      category: 'IT',
      publishedAt: new Date('2024-06-15'),
      isPublished: true,
      readTime: 5,
      coverImage: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_60a954bd82_39e545d763c8aa89.png'
    },
    {
      title: 'How We Ensure Quality In Your Software Projects?',
      slug: 'how-we-ensure-quality-in-your-software-projects',
      excerpt: 'Discover how we ensure quality in your software projects with our meticulous development processes and industry best practices.',
      content: '<p>Discover how we ensure quality in your software projects with our meticulous development processes and industry best practices.</p>',
      category: 'IT',
      publishedAt: new Date('2024-06-08'),
      isPublished: true,
      readTime: 4,
      coverImage: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_b54187a22f_6f0f5d87da3d3938.png'
    },
    {
      title: 'What Is Software Development Lifecycle (SDLC)?',
      slug: 'what-is-software-development-lifecycle',
      excerpt: 'Learn what is software development lifecycle (SDLC) and its importance in creating high-quality software efficiently.',
      content: '<p>Learn what is software development lifecycle (SDLC) and its importance in creating high-quality software efficiently.</p>',
      category: 'IT',
      publishedAt: new Date('2024-06-01'),
      isPublished: true,
      readTime: 6,
      coverImage: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_1472fbbb85_810e30e8e5495fb3.png'
    }
  ];
  await Blog.insertMany(blogs);
  console.log(`Inserted ${blogs.length} blogs`);

  console.log('Seeding Careers...');
  await Career.deleteMany({});
  const careers = [
    {
      title: 'Senior Full-Stack Engineer',
      slug: 'senior-full-stack-engineer',
      department: 'Engineering',
      location: 'Bhubaneswar / Remote',
      type: 'Full-time',
      experience: '5+ years',
      description: 'We are looking for a Senior Full-Stack Engineer to build scalable products for our clients.',
      responsibilities: ['Architect scalable systems', 'Mentor junior engineers', 'Code reviews'],
      requirements: ['Expertise in React and Node.js', 'Experience with cloud infrastructure (AWS/GCP)', 'Strong system design skills'],
      isActive: true
    },
    {
      title: 'Machine Learning Engineer',
      slug: 'machine-learning-engineer',
      department: 'AI & Data',
      location: 'Bhubaneswar',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Join our AI & Data team to build cutting-edge machine learning models for production systems.',
      responsibilities: ['Train and deploy ML models', 'Optimize inference pipelines', 'Collaborate with data scientists'],
      requirements: ['Python, PyTorch, or TensorFlow', 'Experience with MLOps', 'Strong mathematical foundation'],
      isActive: true
    },
    {
      title: 'DevOps / Site Reliability Engineer',
      slug: 'devops-sre',
      department: 'Cloud & Infra',
      location: 'Remote',
      type: 'Full-time',
      experience: '4+ years',
      description: 'Help us maintain zero-downtime infrastructure and optimize CI/CD pipelines.',
      responsibilities: ['Manage cloud infrastructure', 'Implement CI/CD pipelines', 'Monitor system health'],
      requirements: ['AWS, Docker, Kubernetes', 'Terraform or other IaC', 'Experience with high-availability systems'],
      isActive: true
    },
    {
      title: 'Product Designer (UI/UX)',
      slug: 'product-designer-ui-ux',
      department: 'Design',
      location: 'Bhubaneswar / Hybrid',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Design beautiful, intuitive interfaces for enterprise and SaaS products.',
      responsibilities: ['Create wireframes and prototypes', 'Conduct user research', 'Collaborate with frontend engineers'],
      requirements: ['Figma expertise', 'Strong portfolio', 'Understanding of web technologies'],
      isActive: true
    }
  ];
  await Career.insertMany(careers);
  console.log(`Inserted ${careers.length} careers`);

  console.log('Seeding Case Studies (ClientProjects)...');
  await ClientProject.deleteMany({});
  const clientProjects = [
    {
      title: 'Flowtransact',
      slug: 'flowtransact',
      category: 'Fintech',
      client: 'Flowtransact',
      location: 'Bhubaneswar',
      description: 'How Boostr Netwave rebuilt Flowtransact\'s green energy transaction platform for enterprise scale.',
      challenge: 'Flowtransact\'s original monolith couldn\'t handle peak transaction volume during renewable energy trading windows. Latency spikes and occasional downtime were putting client trust at risk as the company scaled into new regions.',
      solution: 'We decomposed the monolith into event-driven microservices, introduced a message queue for transaction processing, and migrated the data layer to a horizontally scalable cluster — all while keeping the existing platform live for users.',
      result: '4x Transaction Throughput, 0 Minutes of Downtime. Flowtransact now processes four times the transaction volume with sub-100ms latency at peak load.',
      clientQuote: 'Boostr Netwave didn\'t just deliver a product — they delivered a competitive advantage. Their AI pipeline reduced our processing time by 60%. Truly world-class engineering.',
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_4456573a0b_241e79a61f2eacd3.png',
      techStack: ['Node.js', 'React', 'Microservices', 'MongoDB'],
      isFeatured: true,
      isVisible: true
    },
    {
      title: 'MedPulse Systems',
      slug: 'medpulse-systems',
      category: 'Healthcare',
      client: 'MedPulse',
      location: 'Global',
      description: '10x traffic scale with zero outages across a regional hospital network.',
      challenge: 'The hospital network needed a robust system to handle patient data and traffic spikes without downtime.',
      solution: 'We built a high-availability cloud architecture with real-time data synchronization.',
      result: '10x traffic scale achieved with zero outages.',
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_5d4b025fde_5dacc386dcfc7279.png',
      techStack: ['Python', 'AWS', 'React'],
      isFeatured: true,
      isVisible: true
    },
    {
      title: 'LocalMarket OS',
      slug: 'localmarket-os',
      category: 'E-commerce',
      client: 'LocalMarket',
      location: 'National',
      description: '2.5x order volume growth within six months of launch.',
      challenge: 'Scaling the e-commerce platform to support rapid growth and high order volumes.',
      solution: 'Implemented a scalable microservices architecture optimized for fast checkout and inventory management.',
      result: '2.5x order volume growth successfully supported.',
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_781875bc24_3a2ba6d162c329f2.png',
      techStack: ['Node.js', 'Next.js', 'PostgreSQL'],
      isFeatured: true,
      isVisible: true
    }
  ];
  await ClientProject.insertMany(clientProjects);
  console.log(`Inserted ${clientProjects.length} case studies`);

  mongoose.disconnect();
  console.log('Seed completed successfully!');
}).catch(err => {
  console.error(err);
});
