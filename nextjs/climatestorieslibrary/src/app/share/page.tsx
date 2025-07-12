'use client';

import { useState } from 'react';
import { createSubmission } from '@/utils/useSupabase';

export default function Share() {
  const [isConsentExpanded, setIsConsentExpanded] = useState(false);
  const [consentChecks, setConsentChecks] = useState({
    shareStory: false,
    dataProcessing: false,
    privacyPolicy: false
  });
  const [userDetails, setUserDetails] = useState({
    name: '',
    location: '',
    email: '',
    tel: '',
    occupation: '',
    details: ''
  });
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const allConsentsChecked = Object.values(consentChecks).every(checked => checked);
  const hasContactMethod = userDetails.email || userDetails.tel;
  const requiredDetailsComplete = userDetails.location && (isAnonymous || userDetails.name) && hasContactMethod;

  const handleSubmitAndUpload = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const submissionData = {
        email: userDetails.email || null,
        tel: userDetails.tel || null,
        name: isAnonymous ? null : userDetails.name,
        location: userDetails.location,
        occupation: userDetails.occupation || null,
        more_about: userDetails.details || null,
        approved: false,
        agreed_policy_version: 'v1.0' // Manually update this when privacy policy changes
      };

      const { error } = await createSubmission(submissionData);

      if (error) {
        setSubmissionError(error);
        setIsSubmitting(false);
        return;
      }

      setSubmissionComplete(true);
      setIsSubmitting(false);

      // Wait a moment to show success message, then open Dropbox
      setTimeout(() => {
        window.open('https://www.dropbox.com/request/cjsyirAt7qn6jMBq4Vqm', '_blank');
      }, 1500);

    } catch (error) {
      console.error('Error submitting data:', error);
      setSubmissionError('Failed to save your information. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-fit pb-[10vh] bg-[color:var(--background)] transition-colors duration-300">
      <div className="max-w-full md:max-w-[80vw] mx-auto py-4 md:py-10 px-3 md:px-5 text-green-600">
        <div className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] text-center p-3 md:p-10 pt-2 md:pt-2 pb-4 md:pb-10 mb-4 md:mb-4">
          <h1 className="text-[color:var(--lightgreen)] text-[clamp(24px,6vw,50px)] mb-2 md:mb-5 font-bold">
            Share Your Climate Story
          </h1>
          <p className="text-[color:var(--lightgreen)] text-[clamp(12px,3vw,18px)] leading-relaxed opacity-90 max-w-[700px] mx-auto mb-2">
            Your voice matters. Every story helps build understanding and connection across our global community. Your story might be the one that really impacts one particular listener and inspires them to act. 
          </p>
        </div>

        <div className="space-y-4 md:space-y-8">
          <section className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] p-4 md:p-9">
            <h2 className="text-[color:var(--lightgreen)] text-[clamp(18px,4vw,32px)] mb-4 md:mb-6 font-bold">
              How to Share Your Story
            </h2>
            <div className="grid gap-4 md:gap-6">
              {[
                 { num: "1", title: "Plan What You Will Say", desc: "Keep it simple - no need to explain in detail the underlying causes, but say how you have been impacted." },
                { num: "2", title: "Record Your Video", desc: "Use any device, such as your phone. Keep the video short - approximately 2 minutes. The shorter the better! You can always upload several videos if you have more to share!" },
                { num: "3", title: "Introduce Yourself", desc: "Some people like to start with their name - others prefer to use their occupation: e.g, 'I am a farmer from...' or 'I am a grandmother from...'. You can also use a pseudonym." },
                { num: "4", title: "Keep It Clear", desc: "Try to limit background noise and speak clearly. Good audio helps your story reach more people." }
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
                { question: "My story seems small compared to major disasters!", answer: "Every story matters. We aim to collect everything from small local observations in someone's garden over decades, to major changes in livelihoods at the frontlines of the climate crisis. No story is too small." },
                { question: "Should my video be portrait or landscape?", answer: "Whichever format works best for you! Landscape will allow you to capture more detail." }
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
              Thank you for wanting to share your story with the Climate Stories Library!
            </p>

            {/* Upload Process */}
            <div className="mb-6 md:mb-8 text-left">
              <div className="bg-[rgba(255,255,255,0.05)] rounded-lg border border-[rgba(140,198,63,0.2)] overflow-hidden">
                <button
                  onClick={() => setIsConsentExpanded(!isConsentExpanded)}
                  className="cursor-pointer w-full p-4 md:p-6 flex items-center justify-between text-[color:var(--lightgreen)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                >
                  <span className="text-[clamp(16px,3.5vw,22px)] font-semibold">Upload Your Story Here</span>
                </button>

                {true && (
                  <div className="p-4 md:p-6 border-t border-[rgba(140,198,63,0.2)]">
                    {/* Consent Form */}
                    <div className="mb-6">
                      <h3 className="text-[color:var(--lightgreen)] text-[clamp(16px,3vw,20px)] font-semibold mb-4">
                        Consent & Permissions
                      </h3>
                      <div className="space-y-3 text-[clamp(12px,2.5vw,14px)]">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={consentChecks.shareStory}
                            onChange={(e) => setConsentChecks(prev => ({...prev, shareStory: e.target.checked}))}
                            className="mt-1 w-4 h-4 accent-[color:var(--lightgreen)]"
                          />
                          <span className="text-[color:var(--lightgreen)] opacity-90 leading-relaxed">
                            I confirm this video features only adults (18+), and I have the permission of every identifiable person in this video to share it publicly.
                          </span>
                        </label>


                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={consentChecks.privacyPolicy}
                            onChange={(e) => setConsentChecks(prev => ({...prev, privacyPolicy: e.target.checked}))}
                            className="mt-1 w-4 h-4 accent-[color:var(--lightgreen)]"
                          />
                          <span className="text-[color:var(--lightgreen)] opacity-90 leading-relaxed">
                            I have read and agree to the{' '}
                            <a 
                              href="/privacy-policy" 
                              target="_blank"
                              className="text-[color:var(--lightgreen)] underline hover:opacity-80 transition-opacity"
                            >
                              Privacy Policy
                            </a>
                            {' '}. I understand it explains how my story will be edited, stored on Dropbox and YouTube, and my rights to withdraw my consent.
                          </span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={consentChecks.dataProcessing}
                            onChange={(e) => setConsentChecks(prev => ({...prev, dataProcessing: e.target.checked}))}
                            className="mt-1 w-4 h-4 accent-[color:var(--lightgreen)]"
                          />
                          <span className="text-[color:var(--lightgreen)] opacity-90 leading-relaxed">
                            I give my explicit consent to process my information and publish my climate story on your website and social medial channels as described in your Privacy Policy.
                          </span>
                        </label>
                       

                      </div>
                    </div>

                   
           
                      <div className="mb-6 p-4 bg-[rgba(255,255,255,0.05)] rounded-lg border border-[rgba(140,198,63,0.1)]">
                        <h3 className="text-[color:var(--lightgreen)] text-[clamp(16px,3vw,20px)] font-semibold mb-4">
                          Your Details
                        </h3>
                        
                        {/* Anonymity Toggle */}
                        <div className="mb-6 p-4 bg-[rgba(255,255,255,0.05)] rounded-lg border border-[rgba(140,198,63,0.2)]">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isAnonymous}
                              onChange={(e) => {
                                setIsAnonymous(e.target.checked);
                                if (e.target.checked) {
                                  setUserDetails(prev => ({...prev, name: ''}));
                                }
                              }}
                              className="w-4 h-4 accent-[color:var(--lightgreen)]"
                            />
                            <span className="text-[color:var(--lightgreen)] text-[clamp(14px,3vw,18px)] font-medium">
                              I want to remain anonymous
                            </span>
                          </label>
                          <p className="text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,14px)] opacity-70 mt-2 ml-7">
                            {isAnonymous 
                              ? "Your story will be attributed only by location and/or occupation" 
                              : "If not, your story will be attributed with your preferred name and location"
                            }
                          </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          {!isAnonymous && (
                            <div>
                              <label className="block text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,14px)] mb-2 font-medium">
                                Preferred Introduction *
                              </label>
                              <input
                                type="text"
                                value={userDetails.name}
                                onChange={(e) => setUserDetails(prev => ({...prev, name: e.target.value}))}
                                className="w-full p-3 rounded-lg bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,14px)] focus:outline-none focus:border-[color:var(--lightgreen)]"
                                placeholder="How you want to be known"
                              />
                            </div>
                          )}
                          <div className={!isAnonymous ? "" : "md:col-span-2"}>
                            <label className="block text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,14px)] mb-2 font-medium">
                              Location *
                            </label>
                            <input
                              type="text"
                              value={userDetails.location}
                              onChange={(e) => setUserDetails(prev => ({...prev, location: e.target.value}))}
                              className="w-full p-3 rounded-lg bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,14px)] focus:outline-none focus:border-[color:var(--lightgreen)]"
                              placeholder="City, Country"
                            />
                          </div>
                        </div>

                        {/* Contact Information Section */}
                        <div className="mt-4 p-4 bg-[rgba(255,255,255,0.05)] rounded-lg border border-[rgba(140,198,63,0.2)]">
                          <h4 className="text-[color:var(--lightgreen)] text-[clamp(14px,3vw,18px)] font-semibold mb-3">
                            Contact Information *
                          </h4>
                          <p className="text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,14px)] opacity-80 mb-4">
                            Please provide at least one way for us to contact you:
                          </p>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <label className={`block text-[clamp(12px,2.5vw,14px)] mb-2 font-medium ${
                                !hasContactMethod ? 'text-orange-300' : 'text-[color:var(--lightgreen)]'
                              }`}>
                                Email {!userDetails.tel && '(required if no phone)'}
                              </label>
                              <input
                                type="email"
                                value={userDetails.email}
                                onChange={(e) => setUserDetails(prev => ({...prev, email: e.target.value}))}
                                className={`w-full p-3 rounded-lg bg-[rgba(255,255,255,0.1)] border text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,14px)] focus:outline-none focus:border-[color:var(--lightgreen)] ${
                                  !hasContactMethod ? 'border-orange-400' : 'border-[rgba(140,198,63,0.3)]'
                                }`}
                                placeholder="your.email@example.com"
                              />
                            </div>
                            <div>
                              <label className={`block text-[clamp(12px,2.5vw,14px)] mb-2 font-medium ${
                                !hasContactMethod ? 'text-orange-300' : 'text-[color:var(--lightgreen)]'
                              }`}>
                                Phone Number {!userDetails.email && '(required if no email)'}
                              </label>
                              <input
                                type="tel"
                                value={userDetails.tel}
                                onChange={(e) => setUserDetails(prev => ({...prev, tel: e.target.value}))}
                                className={`w-full p-3 rounded-lg bg-[rgba(255,255,255,0.1)] border text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,14px)] focus:outline-none focus:border-[color:var(--lightgreen)] ${
                                  !hasContactMethod ? 'border-orange-400' : 'border-[rgba(140,198,63,0.3)]'
                                }`}
                                placeholder="+44 ..."
                              />
                            </div>
                          </div>
                          {!hasContactMethod && (
                            <p className="text-orange-300 text-[clamp(11px,2vw,13px)] mt-2 opacity-90">
                              ⚠️ Please provide at least one contact method
                            </p>
                          )}
                        </div>

                        <div>
                            <label className="block text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,14px)] mb-2 font-medium mt-2">
                              Occupation (optional)
                            </label>
                            <input
                              type="text"
                              value={userDetails.occupation}
                              onChange={(e) => setUserDetails(prev => ({...prev, occupation: e.target.value}))}
                              className="w-full p-3 rounded-lg bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,14px)] focus:outline-none focus:border-[color:var(--lightgreen)]"
                              placeholder="e.g., Teacher, Farmer, Student"
                            />
                          </div>
                        <div>
                            <label className="block text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,14px)] mb-2 font-medium mt-2">
                              More About My Story (optional)
                            </label>
                            <input
                              type="textarea"
                              value={userDetails.details}
                              onChange={(e) => setUserDetails(prev => ({...prev, details: e.target.value}))}
                              className="w-full p-3 rounded-lg bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,14px)] focus:outline-none focus:border-[color:var(--lightgreen)]"
                              placeholder="Anything you forgot to say in your video?"
                            />
                          </div>
                      </div>
        

                    {!submissionComplete && (
                      <div className="text-center p-4 bg-[rgba(140,198,63,0.1)] rounded-lg border border-[rgba(140,198,63,0.3)]">
                        {submissionError && (
                          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                            <p className="text-red-300 text-[clamp(12px,2.5vw,14px]">
                              {submissionError}
                            </p>
                          </div>
                        )}
                        <p className="text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,14px)] mb-4 opacity-90">
                          Ready to submit your information and upload your video?
                        </p>
                        <button
                          onClick={handleSubmitAndUpload}
                          disabled={isSubmitting || (!allConsentsChecked || !requiredDetailsComplete)}
                          className={`inline-flex items-center gap-2.5 py-3 md:py-4 px-6 md:px-8 rounded-lg no-underline font-semibold text-[clamp(12px,3vw,16px)] transition-all duration-300 ${
                            isSubmitting 
                              ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                              : (!allConsentsChecked || !requiredDetailsComplete)
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                                : 'bg-[color:var(--lightgreen)] text-[color:var(--darkgreen)] hover:bg-[color:var(--darkgreen)] hover:text-[color:var(--lightgreen)] hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(140,198,63,0.3)]'
                          }`}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="animate-spin">⏳</span>
                              Saving...
                            </>
                          ) : (
                            <>
                              📤 Submit & Upload Video
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {submissionComplete && (
                      <div className="text-center p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                        <div className="mb-4">
                          <span className="text-4xl">✅</span>
                        </div>
                        <p className="text-black text-[clamp(14px,3vw,18px)] font-semibold mb-2">
                          Information Saved Successfully!
                        </p>
                        <p className="text-black text-[clamp(12px,2.5vw,14px)] opacity-90 mb-4">
                          Opening Dropbox upload page...
                        </p>
                        <a
                          href="https://www.dropbox.com/request/cjsyirAt7qn6jMBq4Vqm"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2.5 py-2 md:py-3 px-4 md:px-6 rounded-lg no-underline font-medium text-[clamp(12px,2.5vw,14px)] transition-all duration-300 bg-green-600 text-white hover:bg-green-700"
                        >
                          📤 Open Dropbox Upload (if not opened automatically)
                        </a>
                      </div>
                    )}
                    
                  </div>
                )}
                
                 <div className="mt-8 flex flex-col sm:flex-row gap-3 md:gap-5 justify-center items-center">
                        <a 
                          href="mailto:juliet@climatestorieslibrary.com" 
                          className="inline-flex items-center gap-2.5 py-3 md:py-4 px-6 md:px-8 rounded-lg no-underline font-semibold text-[clamp(12px,3vw,16px)] transition-all duration-300 bg-[color:var(--lightgreen)] text-[color:var(--darkgreen)] hover:bg-[color:var(--darkgreen)] hover:text-[color:var(--lightgreen)] hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(140,198,63,0.3)]"
                        >
                          📧 Email
                        </a>
                        <a 
                          className="
                          inline-flex items-center gap-2.5 py-3 md:py-4 px-6 md:px-8 rounded-lg no-underline font-semibold text-[clamp(12px,3vw,16px)] transition-all duration-300 bg-transparent text-[color:var(--lightgreen)] border-2 border-[color:var(--lightgreen)] hover:bg-[color:var(--lightgreen)] hover:text-[color:var(--darkgreen)] hover:-translate-y-0.5"
                        >
                          📧 WhatsApp: +44 7584 324473
                        </a>
                        <a 
                          target="_blank" 
                          href="https://www.instagram.com/climatestorieslibrary" 
                          className="inline-flex items-center gap-2.5 py-3 md:py-4 px-6 md:px-8 rounded-lg no-underline font-semibold text-[clamp(12px,3vw,16px)] transition-all duration-300 bg-[color:var(--lightgreen)] text-[color:var(--darkgreen)] hover:bg-[color:var(--darkgreen)] hover:text-[color:var(--lightgreen)] hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(140,198,63,0.3)]"
                        >
                          📱 Contact on Instagram
                        </a>
                      </div>
              </div>
              
            </div>

           
          </section>
        </div>
      </div>
    </div>
  );
}
