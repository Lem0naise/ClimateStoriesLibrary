export default function Share() {
  return (
    <div className="min-h-fit pb-[10vh] bg-[color:var(--background)] transition-colors duration-300">
      <div className="max-w-full md:max-w-[80vw] mx-auto py-4 md:py-10 px-3 md:px-5 text-green-600">
        <div className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] text-center p-3 md:p-10 pt-2 md:pt-2 pb-4 md:pb-10 mb-4 md:mb-8">
          <h1 className="text-[color:var(--lightgreen)] text-[clamp(24px,6vw,50px)] mb-2 md:mb-5 font-bold">
            Share Your Climate Story
          </h1>
          <p className="text-[color:var(--lightgreen)] text-[clamp(12px,3vw,18px)] leading-relaxed opacity-90 max-w-[700px] mx-auto mb-4 md:mb-10">
            Your voice matters. Every story helps build understanding and connection across our global community.
          </p>
        </div>

        <div className="space-y-4 md:space-y-8">
          <section className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] p-4 md:p-9">
            <h2 className="text-[color:var(--lightgreen)] text-[clamp(18px,4vw,32px)] mb-4 md:mb-6 font-bold">
              How to Share Your Story
            </h2>
            <div className="grid gap-4 md:gap-6">
              {[
                { num: "1", title: "Record Your Video", desc: "Use any device like your phone. Keep it concise - around 2 minutes maximum. You can always upload more videos if you have more to share!" },
                { num: "2", title: "Introduce Yourself", desc: "Start by saying your name, where you're from, and what aspect of climate change you're discussing." },
                { num: "3", title: "Keep It Clear", desc: "Try to limit background noise and speak clearly. Good audio helps your story reach more people." }
              ].map((step, index) => (
                <div key={index} className="flex items-start gap-3 md:gap-5 p-3 md:p-5 bg-[rgba(255,255,255,0.08)] rounded-lg border border-[rgba(140,198,63,0.2)]">
                  <div className="bg-[color:var(--lightgreen)] text-[color:var(--darkgreen)] w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-lg flex-shrink-0">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-[color:var(--lightgreen)] text-[clamp(14px,3vw,20px)] mb-2 font-semibold">
                      {step.title}
                    </h3>
                    <p className="text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,16px)] leading-relaxed opacity-90">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] p-4 md:p-9">
            <h2 className="text-[color:var(--lightgreen)] text-[clamp(18px,4vw,32px)] mb-4 md:mb-6 font-bold">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3 md:space-y-4">
              {[
                { question: "Which language should my story be in?", answer: "Use your own language! If you're able to, you can also provide translations in English, Spanish, or French to make your story accessible to more people." },
                { question: "Will my story be used for other purposes?", answer: "We'll always ask for your permission first. If schools or organizations want to use your story for art or events, or if we feature it in our 'Contact a Politician' series, we'll contact you beforehand." },
                { question: "My story seems small compared to major disasters!", answer: "Every story matters. We aim to collect everything from small local observations in someone's garden over decades, to major changes in livelihoods at the frontlines of the climate crisis. No story is too small." }
              ].map((faq, index) => (
                <div key={index} className="p-3 md:p-5 bg-[rgba(255,255,255,0.08)] rounded-lg border border-[rgba(140,198,63,0.2)]">
                  <h3 className="text-[color:var(--lightgreen)] text-[clamp(14px,3vw,20px)] mb-2 font-semibold">
                    {faq.question}
                  </h3>
                  <p className="text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,16px)] leading-relaxed opacity-90">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] text-center p-4 md:p-9">
            <h2 className="text-[color:var(--lightgreen)] text-[clamp(18px,4vw,32px)] mb-4 md:mb-6 font-bold">
              Ready to Share?
            </h2>
            <p className="text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,16px)] leading-relaxed opacity-90 mb-4 md:mb-6">
              We'd love to hear from you. Get in touch to submit your climate story:
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-5 justify-center items-center">
              <a 
                href="mailto:juliet@climatestorieslibrary.com" 
                className="inline-flex items-center gap-2.5 py-3 md:py-4 px-6 md:px-8 rounded-lg no-underline font-semibold text-[clamp(12px,3vw,16px)] transition-all duration-300 bg-[color:var(--lightgreen)] text-[color:var(--darkgreen)] hover:bg-[color:var(--darkgreen)] hover:text-[color:var(--lightgreen)] hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(140,198,63,0.3)]"
              >
                📧 Email Your Story
              </a>
              <a 
                target="_blank" 
                href="https://www.instagram.com/climatestorieslibrary" 
                className="inline-flex items-center gap-2.5 py-3 md:py-4 px-6 md:px-8 rounded-lg no-underline font-semibold text-[clamp(12px,3vw,16px)] transition-all duration-300 bg-transparent text-[color:var(--lightgreen)] border-2 border-[color:var(--lightgreen)] hover:bg-[color:var(--lightgreen)] hover:text-[color:var(--darkgreen)] hover:-translate-y-0.5"
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
