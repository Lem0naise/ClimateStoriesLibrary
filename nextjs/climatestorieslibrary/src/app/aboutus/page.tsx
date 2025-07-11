import { Metadata } from 'next';
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: 'About Us - Climate Stories Library',
  description: 'Learn about the Climate Stories Library, a platform amplifying voices from the frontlines of the climate and nature crisis. Meet our team and discover our mission.',
  keywords: 'climate stories, climate crisis, environmental justice, storytelling, grassroots movements',
  openGraph: {
    title: 'About Us - Climate Stories Library',
    description: 'Learn about the Climate Stories Library - a platform amplifying voices from the frontlines of the climate crisis.',
    type: 'website',
    url: 'https://www.climatestorieslibrary.com/aboutus',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - Climate Stories Library',
    description: 'Learn about the Climate Stories Library - a platform amplifying voices from the frontlines of the climate crisis.',
  }
};


export default function About() {
  return (
    <div className="min-h-fit pb-[10vh] bg-[color:var(--background)] transition-colors duration-300">
      <div className="max-w-full md:max-w-[80vw] mx-auto py-4 md:py-10 px-3 md:px-5 text-green-600">
        <div className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] text-center p-3 md:p-10 pt-2 md:pt-2 pb-4 md:pb-10 mb-4 md:mb-8">
          <h1 className="text-[color:var(--lightgreen)] text-[clamp(24px,6vw,50px)] mb-2 md:mb-5 font-bold">
            About the Climate Stories Library
          </h1>
          <p className="text-[color:var(--lightgreen)] text-[clamp(12px,3vw,18px)] leading-relaxed opacity-90 max-w-[700px] mx-auto mb-4 md:mb-10">
            The Climate Stories Library provides a platform for individuals and grassroots groups to share their experiences of the climate and nature crisis, and other intersecting injustices. We believe every voice matters in the climate conversation.
          </p>

          <Link  
              href="../" 
              className="inline-block bg-[color:var(--lightgreen)] text-[color:var(--darkgreen)] py-3 md:py-4 px-6 md:px-9 rounded-lg no-underline font-semibold text-[clamp(12px,3vw,18px)] transition-all duration-300 hover:bg-[color:var(--darkgreen)] hover:text-[color:var(--lightgreen)] hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(140,198,63,0.3)]"
            >
              View All Stories
            </Link>
          
        </div>

        <section className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] p-4 md:p-9 mb-4 md:mb-8">
          <h2 className="text-[color:var(--lightgreen)] text-[clamp(18px,4vw,32px)] mb-4 md:mb-6 font-bold">
            Our Aims
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {[
              {
                title: "Direct Storytelling",
                desc: "To enable those at the frontlines of the climate and nature crisis to tell their story directly and easily to a global audience.",
              },
              {
                title: "Amplify Voices",
                desc: "To amplify the voices of those who are often less heard, or not heard at all.",
              },
              {
                title: "Build Connections",
                desc: "To build solidarity and connections between individuals and grassroots movements and to encourage seeing the world through the lenses of others.",
              },
              {
                title: "Global Collaboration",
                desc: "We aim to develop a network of collaborators around the world with whom we can co-create this project.",
              },
            ].map((aim, index) => (
              <div
                key={index}
                className="bg-[rgba(255,255,255,0.08)] p-4 md:p-6 rounded-lg border border-[rgba(140,198,63,0.2)]"
              >
                <h3 className="text-[color:var(--lightgreen)] text-[clamp(14px,3vw,20px)] mb-2 md:mb-3 font-semibold">
                  {aim.title}
                </h3>
                <p className="text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,16px)] leading-relaxed opacity-90">
                  {aim.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] p-4 md:p-9 mb-4 md:mb-8">
          <h2 className="text-[color:var(--lightgreen)] text-[clamp(18px,4vw,32px)] mb-4 md:mb-6 font-bold">
            Future Developments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-[rgba(255,255,255,0.08)] p-4 md:p-6 rounded-lg border border-[rgba(140,198,63,0.2)]">
              <h3 className="text-[color:var(--lightgreen)] text-[clamp(14px,3vw,20px)] mb-2 md:mb-3 font-semibold">
                Artistic Responses
              </h3>
              <p className="text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,16px)] leading-relaxed opacity-90">
                Create a platform of artistic responses to the stories, making art
                which in itself further raises awareness of the reality of how the
                climate crisis is interwoven with other social inequities.
              </p>
            </div>
            <div className="bg-[rgba(255,255,255,0.08)] p-4 md:p-6 rounded-lg border border-[rgba(140,198,63,0.2)]">
              <h3 className="text-[color:var(--lightgreen)] text-[clamp(14px,3vw,20px)] mb-2 md:mb-3 font-semibold">
                Grassroots Address Book
              </h3>
              <p className="text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,16px)] leading-relaxed opacity-90">
                A platform to connect grassroots climate and activist organisations with each other.
              </p>
            </div>
            <div className="bg-[rgba(255,255,255,0.08)] p-4 md:p-6 rounded-lg border border-[rgba(140,198,63,0.2)]">
              <h3 className="text-[color:var(--lightgreen)] text-[clamp(14px,3vw,20px)] mb-2 md:mb-3 font-semibold">
                Research & Activism
              </h3>
              <p className="text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,16px)] leading-relaxed opacity-90">
                Lead to the co-creation of research and activism surrounding issues
                of local justice.
              </p>
            </div>
            <div className="bg-[rgba(255,255,255,0.08)] p-4 md:p-6 rounded-lg border border-[rgba(140,198,63,0.2)]">
              <h3 className="text-[color:var(--lightgreen)] text-[clamp(14px,3vw,20px)] mb-2 md:mb-3 font-semibold">
                Contact A Politician
              </h3>
              <p className="text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,16px)] leading-relaxed opacity-90">
                Videos could be curated into a format ready to send to politicians and businesses to raise awareness.
              </p>
            </div>
          </div>
        </section>

        <div className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] p-4 md:p-9 mb-4 md:mb-8">
          <h2 className="text-[color:var(--lightgreen)] text-[clamp(18px,4vw,32px)] mb-4 md:mb-6 font-bold">
            Why Focus on Climate?
          </h2>
          <p className="text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,16px)] leading-relaxed opacity-90 mb-4">
            We see the climate crisis as just one of many symptoms of a current way
            of being, particularly by a global minority. A way of being in the
            world that has also caused, and is causing, other forms of social
            injustice.
          </p>
          <p className="text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,16px)] leading-relaxed opacity-90">
            As part of wider forms of unfair disadvantage, the climate crisis is
            one of the symptoms that affects all of us but in different ways. It
            connects us globally and, in doing so, it is an issue that can be used
            to connect with other health and wellbeing inequities, entangled with
            the climate crisis, which will differ for individuals from different
            localities and backgrounds.
          </p>
        </div>

        <div className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] p-4 md:p-9 mb-4 md:mb-8">
          <h2 className="text-[color:var(--lightgreen)] text-[clamp(18px,4vw,32px)] mb-4 md:mb-6 font-bold">
            Meet the Team
          </h2>
          <p className="text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,16px)] leading-relaxed opacity-90 mb-4 md:mb-6">
            We are a small team of teachers and scientists who care about
            communicating the reality of the climate and nature crisis as a social
            justice issue.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-[rgba(255,255,255,0.08)] p-4 md:p-6 rounded-lg border border-[rgba(140,198,63,0.2)]">
              <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4">
                <Image
                  src="/imgs/p1.webp"
                  alt="Juliet Nolan"
                  width={120}
                  height={120}
                  className="rounded-full mb-3 sm:mb-0 sm:mr-4 flex-shrink-0"
                />
                <div className="text-center sm:text-left">
                  <h3 className="text-[color:var(--lightgreen)] text-[clamp(16px,3.5vw,24px)] mb-2 font-semibold">
                    Juliet Nolan
                  </h3>
                  <p className="text-[color:var(--lightgreen)] text-[clamp(11px,2.2vw,14px)] leading-relaxed opacity-90">
                    Juliet is a Geographer turned Primary School teacher, with time
                    spent as a children&apos;s book editor along the way. She
                    believes in the power of storytelling and art to spark empathy
                    and understanding - and hopefully to prompt action. You can
                    also find her on BlueSky / X as{" "}
                    <a
                      target="_blank"
                      href="https://MPForNature.bsky.social"
                      className="text-[color:var(--lightgreen)] underline hover:opacity-70"
                    >
                      mpfornature.bsky.social
                    </a>{" "}
                    and{" "}
                    <a
                      target="_blank"
                      href="https://x.com/MPforNature"
                      className="text-[color:var(--lightgreen)] underline hover:opacity-70"
                    >
                      @MPForNature
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[rgba(255,255,255,0.08)] p-4 md:p-6 rounded-lg border border-[rgba(140,198,63,0.2)]">
              <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4">
                <Image
                  src="/imgs/p2.webp"
                  alt="Jennie Lord"
                  width={120}
                  height={120}
                  className="rounded-full mb-3 sm:mb-0 sm:mr-4 flex-shrink-0"
                />
                <div className="text-center sm:text-left">
                  <h3 className="text-[color:var(--lightgreen)] text-[clamp(16px,3.5vw,24px)] mb-2 font-semibold">
                    Jennie Lord
                  </h3>
                  <p className="text-[color:var(--lightgreen)] text-[clamp(11px,2.2vw,14px)] leading-relaxed opacity-90">
                    Jennie is an ecologist, working at a global health institute.
                    She is amid trying to (un)(re)learn about what it means to be
                    a scientist &apos;in&apos;, instead of &apos;outside&apos;
                    society. She will probably still be on this journey way into
                    retirement. You can find her at{" "}
                    <a
                      target="_blank"
                      href="https://jenniesuz.bsky.social"
                      className="text-[color:var(--lightgreen)] underline hover:opacity-70"
                    >
                      @jenniesuz.bsky.social
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] p-4 md:p-9 mb-4 md:mb-8">
          <h2 className="text-[color:var(--lightgreen)] text-[clamp(18px,4vw,32px)] mb-4 md:mb-6 font-bold">
            Advisory Group
          </h2>
          <p className="text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,16px)] leading-relaxed opacity-90 mb-4">
            An advisory group of individuals from countries on the frontlines of
            the climate crisis is helping us shape this project so that it is as
            useful as possible to as many people as possible. The eventual aim is
            for the Climate Stories Library to become a tool for collaboration
            between countries and activism. If you are interested in becoming a
            Global Advisor, please contact us at the email address below.
          </p>

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
          </div>
        </div>

        <section className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] text-center p-4 md:p-9 mb-4 md:mb-8">
          <h2 className="text-[color:var(--lightgreen)] text-[clamp(18px,4vw,32px)] mb-4 md:mb-6 font-bold">
            Contact Us
          </h2>
          <p className="text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,16px)] leading-relaxed opacity-90">
            Contact us by email at{" "}
            <a
              href="mailto:juliet@climatestorieslibrary.com"
              className="text-[color:var(--lightgreen)] underline font-semibold hover:opacity-70"
            >
              juliet@climatestorieslibrary.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
