export default function Share() {
  return (
    <div id="main" className="noPadding">
      <div className="story-container">
        <div className="story-header green-backdrop">
          <h1>Share Your Climate Story</h1>
          <p className="story-subtitle">Your voice matters. Every story helps build understanding and connection across our global community.</p>
        </div>

        <div className="story-content">
          <section className="story-section green-backdrop">
            <h2>How to Share Your Story</h2>
            <div className="steps-grid">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Record Your Video</h3>
                  <p>Use any device like your phone. Keep it concise - around 2 minutes maximum. You can always upload more videos if you have more to share!</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Introduce Yourself</h3>
                  <p>Start by saying your name, where you&apos;re from, and what aspect of climate change you&apos;re discussing.</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Keep It Clear</h3>
                  <p>Try to limit background noise and speak clearly. Good audio helps your story reach more people.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="story-section green-backdrop">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-grid">
              <div className="faq-item">
                <h3>Which language should my story be in?</h3>
                <p>Use your own language! If you&apos;re able to, you can also provide translations in English, Spanish, or French to make your story accessible to more people.</p>
              </div>
              <div className="faq-item">
                <h3>Will my story be used for other purposes?</h3>
                <p>We&apos;ll always ask for your permission first. If schools or organizations want to use your story for art or events, or if we feature it in our &quot;Contact a Politician&quot; series, we&apos;ll contact you beforehand.</p>
              </div>
              <div className="faq-item">
                <h3>My story seems small compared to major disasters!</h3>
                <p>Every story matters. We aim to collect everything from small local observations in someone&apos;s garden over decades, to major changes in livelihoods at the frontlines of the climate crisis. No story is too small.</p>
              </div>
            </div>
          </section>

          <section className="story-section submit-section green-backdrop">
            <h2>Ready to Share?</h2>
            <p>We&apos;d love to hear from you. Get in touch to submit your climate story:</p>
            <div className="contact-options">
              <a href="mailto:juliet@climatestorieslibrary.com" className="contact-button primary">
                📧 Email Your Story
              </a>
              <a target="_blank" href="https://www.instagram.com/climatestorieslibrary" className="contact-button secondary">
                📱 Message on Instagram
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
