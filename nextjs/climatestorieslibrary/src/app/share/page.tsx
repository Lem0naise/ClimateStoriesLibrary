export default function Share() {
  return (
    <div className="min-h-fit pb-0 bg-[color:var(--background)] transition-colors duration-300">
      <div className="mx-auto py-10 px-5 text-white">
        <div className="bg-[rgba(0,0,0,0.2)] rounded-[15px] backdrop-blur-sm border-[5px] border-[rgba(140,198,63,0.2)] text-center mb-12 p-10">
          <h1 className="text-[color:var(--lightgreen)] mb-5 text-[clamp(28px,4vw,48px)]">
            Share Your Climate Story
          </h1>
          <p className="text-[clamp(16px,1.5vw,20px)] opacity-90 leading-relaxed max-w-[600px] mx-auto">
            Your voice matters. Every story helps build understanding and connection across our global community.
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-[rgba(0,0,0,0.2)] rounded-[15px] backdrop-blur-sm border-[5px] border-[rgba(140,198,63,0.2)] p-9 rounded-xl">
            <h2 className="text-[color:var(--lightgreen)] mb-6 text-[clamp(20px,2.5vw,32px)] block">
              How to Share Your Story
            </h2>
            <div className="grid gap-6">
              {[
                { num: "1", title: "Record Your Video", desc: "Use any device like your phone. Keep it concise - around 2 minutes maximum. You can always upload more videos if you have more to share!" },
                { num: "2", title: "Introduce Yourself", desc: "Start by saying your name, where you're from, and what aspect of climate change you're discussing." },
                { num: "3", title: "Keep It Clear", desc: "Try to limit background noise and speak clearly. Good audio helps your story reach more people." }
              ].map((step, index) => (
                <div key={index} className="flex items-start gap-5 p-5 bg-[rgba(255,255,255,0.05)] rounded-lg border border-[rgba(140,198,63,0.1)]">
                  <div className="bg-[color:var(--lightgreen)] text-[color:var(--darkgreen)] w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-[color:var(--lightgreen)] mb-2 text-[clamp(16px,1.2vw,20px)] block">
                      {step.title}
                    </h3>
                    <p className="leading-relaxed opacity-90">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[rgba(0,0,0,0.2)] rounded-[15px] backdrop-blur-sm border-[5px] border-[rgba(140,198,63,0.2)] p-9 rounded-xl">
            <h2 className="text-[color:var(--lightgreen)] mb-6 text-[clamp(20px,2.5vw,32px)] block">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                { question: "Which language should my story be in?", answer: "Use your own language! If you're able to, you can also provide translations in English, Spanish, or French to make your story accessible to more people." },
                { question: "Will my story be used for other purposes?", answer: "We'll always ask for your permission first. If schools or organizations want to use your story for art or events, or if we feature it in our 'Contact a Politician' series, we'll contact you beforehand." },
                { question: "My story seems small compared to major disasters!", answer: "Every story matters. We aim to collect everything from small local observations in someone's garden over decades, to major changes in livelihoods at the frontlines of the climate crisis. No story is too small." }
              ].map((faq, index) => (
                <div key={index} className="p-5 bg-[rgba(255,255,255,0.05)] rounded-lg border border-[rgba(140,198,63,0.1)]">
                  <h3 className="text-[color:var(--lightgreen)] mb-2 text-[clamp(16px,1.2vw,20px)]">
                    {faq.question}
                  </h3>
                  <p className="leading-relaxed opacity-90">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[rgba(0,0,0,0.2)] rounded-[15px] backdrop-blur-sm border-[5px] border-[rgba(140,198,63,0.2)] text-center p-9 rounded-xl">
            <h2 className="text-[color:var(--lightgreen)] mb-6 text-[clamp(20px,2.5vw,32px)] block">
              Ready to Share?
            </h2>
            <p>We'd love to hear from you. Get in touch to submit your climate story:</p>
            <div className="flex gap-5 justify-center mt-6 flex-wrap">
              <a 
                href="mailto:juliet@climatestorieslibrary.com" 
                className="inline-flex items-center gap-2.5 py-4 px-8 rounded-lg no-underline font-semibold text-base transition-all duration-300 bg-[color:var(--lightgreen)] text-[color:var(--darkgreen)] hover:bg-[color:var(--darkgreen)] hover:text-[color:var(--lightgreen)] hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(140,198,63,0.3)]"
              >
                📧 Email Your Story
              </a>
              <a 
                target="_blank" 
                href="https://www.instagram.com/climatestorieslibrary" 
                className="inline-flex items-center gap-2.5 py-4 px-8 rounded-lg no-underline font-semibold text-base transition-all duration-300 bg-transparent text-[color:var(--lightgreen)] border-2 border-[color:var(--lightgreen)] hover:bg-[color:var(--lightgreen)] hover:text-[color:var(--darkgreen)] hover:-translate-y-0.5"
              >
                📱 Message on Instagram
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
