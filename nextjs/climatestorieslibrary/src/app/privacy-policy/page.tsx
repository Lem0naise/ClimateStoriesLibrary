export default function PrivacyPolicy() {
  return (
    <div className="min-h-fit pb-[10vh] bg-[color:var(--background)] transition-colors duration-300">
      <div className="max-w-full md:max-w-[80vw] mx-auto py-4 md:py-10 px-3 md:px-5 text-green-600">
        <div className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] text-center p-3 md:p-10 pt-2 md:pt-2 pb-4 md:pb-10 mb-4 md:mb-4">
          <h1 className="text-[color:var(--lightgreen)] text-[clamp(24px,6vw,50px)] mb-2 md:mb-5 font-bold">
            Privacy Policy
          </h1>
          <p className="text-[color:var(--lightgreen)] text-[clamp(12px,3vw,18px)] leading-relaxed opacity-90 max-w-[700px] mx-auto mb-2">
            How we collect, use, and protect your personal information when you share your climate story.
          </p>
        </div>

        <div className="space-y-4 md:space-y-8">
          <section className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] p-4 md:p-9">
            <div className="space-y-6 text-[color:var(--lightgreen)]">
              <div>
                <h2 className="text-[clamp(18px,4vw,28px)] mb-4 font-bold">1. Information We Collect</h2>
                <div className="text-[clamp(12px,2.5vw,16px)] leading-relaxed opacity-90 space-y-3">
                  <p><strong>Personal Information:</strong> When you submit a climate story, we collect only what you provide us with:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>The name you provide us with</li>
                    <li>Email address if you provide it</li>
                    <li>Location if you provide it</li>
                    <li>Occupation if you provide it</li>
                    <li>Story details and context</li>
                  </ul>
                  <p><strong>Video Content:</strong> Your recorded climate story, which may include your voice, image, and any personal information you choose to share within the recording.</p>
                  <p>The stories you share about climate change may include sensitive information, such as your political opinions, philosophical beliefs, or health information. This is known as 'Special Category Data' under UK GDPR. We process this data only on the basis of your explicit consent.</p>
                </div>
              </div>

              <div>
                <h2 className="text-[clamp(18px,4vw,28px)] mb-4 font-bold">2. How We Use Your Information</h2>
                <div className="text-[clamp(12px,2.5vw,16px)] leading-relaxed opacity-90 space-y-3">
                  <p>We use your personal information to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Display your climate story on our website and social media channels</li>
                    <li>Attribute your story with your name and location (unless you request anonymity)</li>
                    <li>Contact you regarding your submission</li>
                    <li>Edit your story for length, clarity, or to add subtitles/translations</li>
                    <li>Send you updates about the Climate Stories Library project (with your consent)</li>
                    <li>Invite you to participate in related opportunities or events</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-[clamp(18px,4vw,28px)] mb-4 font-bold">3. Legal Basis for Processing</h2>
                <div className="text-[clamp(12px,2.5vw,16px)] leading-relaxed opacity-90 space-y-3">
                  <p>We process your personal data based on:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Your Consent:</strong> You explicitly consent to sharing your story and processing your data</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-[clamp(18px,4vw,28px)] mb-4 font-bold">4. Data Sharing and Disclosure</h2>
                <div className="text-[clamp(12px,2.5vw,16px)] leading-relaxed opacity-90 space-y-3">
                  <p>Your climate story and associated information will be:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Published on the Climate Stories Library website</li>
                    <li>Shared on our social media channels (Instagram, YouTube, etc.)</li>
                    <li>Made available to the general public worldwide</li>
                  </ul>
                  <p><strong>We do not sell or share your personal data with third parties for commercial purposes.</strong></p>
                  <p>We may share your information if required by law or to protect our rights and safety.</p>
                  <p>
                    We use Dropbox for the initial collection and storage of the video files you upload. Dropbox acts as a data processor for us. We use YouTube to host the videos, which are then embedded on our website. When you consent to publication, your video is uploaded to YouTube and governed by their terms.
                  </p>
                  <a href="https://www.dropbox.com/privacy">https://www.dropbox.com/privacy</a>
                    <br/>
                  <a href="https://policies.google.com/privacy">https://policies.google.com/privacy</a>
                </div>
              </div>

              <div>
                <h2 className="text-[clamp(18px,4vw,28px)] mb-4 font-bold">5. Data Security</h2>
                <div className="text-[clamp(12px,2.5vw,16px)] leading-relaxed opacity-90 space-y-3">
                  <p>We implement appropriate security measures to protect your personal information:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Secure data storage and transmission</li>
                    <li>Limited access to authorized personnel only</li>
                    <li>When we transfer your personal data out of the UK, to use service providers based outside the UK, a similar degree of protection is ensured, as required by UK GDPR.</li>
                  </ul>
                  <p>For the purposes of GDPR, we are the Data Controller of your personal information:</p>
                  <ul>
                    <li>Juliet Nolan</li>
                    <li>juliet@climatestorieslibrary.com</li>
                    <li>+44 7584 324473</li>
                    {/** <!-- <li>Address: TODO TODO</li>--> */}
                  </ul>
                </div>
              </div>
              

              <div>
                <h2 className="text-[clamp(18px,4vw,28px)] mb-4 font-bold">6. Your Rights</h2>
                <div className="text-[clamp(12px,2.5vw,16px)] leading-relaxed opacity-90 space-y-3">
                  <p>You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                    <li><strong>Rectification:</strong> Request correction of inaccurate information</li>
                    <li><strong>Erasure:</strong> Request deletion of your data (note: this may require removing your story from public display, and we cannot remove copies that may have been made while it was public)</li>
                    <li><strong>Portability:</strong> You may request a copy of your data, such as your original video file in a transferable format.</li>
                    <li><strong>Objection:</strong> Object to processing of your personal data</li>
                    <li><strong>Withdraw Consent:</strong> Withdraw your consent at any time</li>
                  </ul>
                  <p>To exercise these rights, contact us at <a href="mailto:juliet@climatestorieslibrary.com" className="underline hover:opacity-80">juliet@climatestorieslibrary.com</a></p>
                </div>
              </div>

              <div>
                <h2 className="text-[clamp(18px,4vw,28px)] mb-4 font-bold">7. Data Retention</h2>
                <div className="text-[clamp(12px,2.5vw,16px)] leading-relaxed opacity-90 space-y-3">
                  <p>We retain your personal data and climate story for the lifetime of the Climate Stories Library project to maintain the historical record of climate impacts. However, you may request removal at any time by contacting us.</p>
                </div>
              </div>

              <div>
                <h2 className="text-[clamp(18px,4vw,28px)] mb-4 font-bold">8. Children's Privacy</h2>
                <div className="text-[clamp(12px,2.5vw,16px)] leading-relaxed opacity-90 space-y-3">
                   <span>
                    Our services are <strong>not intended for children.</strong> You must be 18 years or older to submit a video. We do not knowingly collect personal data from children, and we do not accept video submissions that feature identifiable children.
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-[clamp(18px,4vw,28px)] mb-4 font-bold">9. Changes to This Policy</h2>
                <div className="text-[clamp(12px,2.5vw,16px)] leading-relaxed opacity-90 space-y-3">
                  <p>We may update this privacy policy from time to time. We will notify you of any significant changes through our website.</p>
                </div>
              </div>

              <div>
                <h2 className="text-[clamp(18px,4vw,28px)] mb-4 font-bold">10. Contact Information</h2>
                <div className="text-[clamp(12px,2.5vw,16px)] leading-relaxed opacity-90 space-y-3">
                  <p>If you have any questions about this privacy policy or how we handle your data, please contact us:</p>
                  <div className="bg-[rgba(255,255,255,0.05)] p-4 rounded-lg border border-[rgba(140,198,63,0.2)] mt-4">
                    <p><strong>Email:</strong> <a href="mailto:juliet@climatestorieslibrary.com" className="underline hover:opacity-80">juliet@climatestorieslibrary.com</a></p>
                    <p><strong>WhatsApp:</strong> +44 7584 324473</p>
                    <p><strong>Instagram:</strong> <a href="https://www.instagram.com/climatestorieslibrary" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">@climatestorieslibrary</a></p>
                  </div>
                  <p>
                    You have the right to withdraw consent at any time and lodge a complaint with the Information Commissioner's Office (ICO) or your local data protection authority if you believe your data protection rights have been breached. 
                  </p>
                </div>
              </div>

              <div className="border-t border-[rgba(140,198,63,0.2)] pt-6">
                <p className="text-[clamp(12px,2.5vw,14px)] opacity-70 text-center">
                  Last updated: 11-07-2025, v1.0
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
