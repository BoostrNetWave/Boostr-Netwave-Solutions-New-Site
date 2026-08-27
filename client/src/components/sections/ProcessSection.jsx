import React from 'react';

export default function ProcessSection({ data }) {
  return (
    <section className="py-24 bg-white border-y border-border">
      <div className="max-w-[1360px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="reveal">
            <span className="section-label">Our Process</span>
            <h2 className="font-display font-black text-ink tracking-tighter leading-[1] mt-4" style={{fontSize: 'clamp(2.5rem, 3vw, 3.5rem)'}}>How We Work.</h2>
          </div>
          <p className="reveal text-muted max-w-sm leading-relaxed">A streamlined, four-step approach to ensure we deliver exactly what your business needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {data.process.map((step, idx) => (
            <div key={step.id} className={`bg-soft border border-border p-8 rounded-[28px] reveal stagger-${idx + 1} hover:shadow-lg transition-all group`}>
              <div className="w-14 h-14 bg-white border border-border rounded-xl flex items-center justify-center mb-6 group-hover:border-blue transition-colors">
                <span className="text-xl font-black text-blue">0{idx + 1}</span>
              </div>
              <h4 className="font-black text-xl text-ink mb-3">{step.title}</h4>
              <p className="text-sm text-muted leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
