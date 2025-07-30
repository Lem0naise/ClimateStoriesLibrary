import Image from 'next/image';

export default function GlobalAdvisors() {
  return (
    <>
            <h3 className="text-[color:var(--lightgreen)] text-[clamp(16px,3.5vw,24px)] mb-4 font-semibold">
            Global Advisors include:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-[rgba(255,255,255,0.08)] p-4 md:p-6 rounded-lg border border-[rgba(140,198,63,0.2)]">
              <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4">
                <Image
                  src="/imgs/p3.webp"
                  alt="Priyadarshan Kumar"
                  width={100}
                  height={100}
                  className="rounded-full mb-3 sm:mb-0 sm:mr-4 flex-shrink-0"
                />
                <div className="text-center sm:text-left">
                  <h3 className="text-[color:var(--lightgreen)] text-[clamp(14px,3vw,20px)] mb-2 font-semibold">
                    Priyadarshan Kumar
                  </h3>
                  <h4 className="text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,16px)] mb-2 opacity-80">
                    A schoolteacher from Bihar, India
                  </h4>
                  <p className="text-[color:var(--lightgreen)] text-[clamp(11px,2.2vw,14px)] leading-relaxed opacity-90">
                    Priyadarshan teaches at the Savitribai Phule Memorial School
                    for Dalit children in Darbhanga, India, and leads community
                    activities to improve water and health in his village.
                  </p>
                </div>
              </div>
            </div>

            

            <div className="bg-[rgba(255,255,255,0.08)] p-4 md:p-6 rounded-lg border border-[rgba(140,198,63,0.2)]">
              <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4">
                <Image
                  src="/imgs/p4.webp"
                  alt="Joseph Masembe"
                  width={100}
                  height={100}
                  className="rounded-full mb-3 sm:mb-0 sm:mr-4 flex-shrink-0"
                />
                <div className="text-center sm:text-left">
                  <h3 className="text-[color:var(--lightgreen)] text-[clamp(14px,3vw,20px)] mb-2 font-semibold">
                    Joseph Masembe
                  </h3>
                  <h4 className="text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,16px)] mb-2 opacity-80">
                    Founder of Little Hands Go Green
                  </h4>
                  <p className="text-[color:var(--lightgreen)] text-[clamp(11px,2.2vw,14px)] leading-relaxed opacity-90">
                    Little Hands Go Green is a Ugandan child-led civic organisation
                    that teaches and mentors children to become the drivers of
                    environmental conservation in their schools and communities.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[rgba(255,255,255,0.08)] p-4 md:p-6 rounded-lg border border-[rgba(140,198,63,0.2)]">
              <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4">
                <Image
                  src="/imgs/yesua.jpeg"
                  alt="Yesua Aliki"
                  width={100}
                  height={100}
                  className="rounded-full mb-3 sm:mb-0 sm:mr-4 flex-shrink-0"
                />
                <div className="text-center sm:text-left">
                  <h3 className="text-[color:var(--lightgreen)] text-[clamp(14px,3vw,20px)] mb-2 font-semibold">
                    Yesua Aliki
                  </h3>
                  <h4 className="text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,16px)] mb-2 opacity-80">
                    Founder/Director of Reliable Refugee Storytellers Association
                  </h4>
                  <p className="text-[color:var(--lightgreen)] text-[clamp(11px,2.2vw,14px)] leading-relaxed opacity-90">
                    Yesua is a documentary photojournalist and Uganda gender equality award winner of 2022, a South Sudanese refugee and founder/director of the Reliable Refugee Storytellers Association. The Association is a youth-led media and citizen-journalism initiative based in Uganda's Bidibidi settlement empowering refugees to access information, tell their own stories, and advocate for refugee rights.
                  </p>
                </div>
              </div>
            </div>


            <div className="bg-[rgba(255,255,255,0.08)] p-4 md:p-6 rounded-lg border border-[rgba(140,198,63,0.2)]">
                <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4">
                  <Image
                    src="/imgs/Rosaline.jpg"
                    alt="Rosaline Parker"
                    width={100}
                    height={100}
                    className="rounded-full mb-3 sm:mb-0 sm:mr-4 flex-shrink-0"
                  />
                  <div className="text-center sm:text-left">
                    <h3 className="text-[color:var(--lightgreen)] text-[clamp(14px,3vw,20px)] mb-2 font-semibold">
                      Rosaline Parker
                    </h3>
                    <h4 className="text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,16px)] mb-2 opacity-80">
                      Advocate for Pacific cultures and climate justice
                    </h4>
                    <p className="text-[color:var(--lightgreen)] text-[clamp(11px,2.2vw,14px)] leading-relaxed opacity-90">
                      Rosaline Parker is a passionate advocate for Pacific cultures and climate justice. Her work is grounded in the strength of Indigenous knowledge systems, with a focus on empowering communities to lead climate solutions rooted in culture, connection, and resilience.
                    </p>
                  </div>
                </div>
              </div>
          </div>
          </>
  );}