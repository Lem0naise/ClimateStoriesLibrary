import Image from "next/image";

export default function About() {
  return (
    <div className="min-h-fit pb-0 bg-[color:var(--background)] transition-colors duration-300">
      <div className="mx-auto py-10 px-5 text-white">
        <div className="bg-[rgba(0,0,0,0.2)] rounded-[15px] backdrop-blur-sm border-[5px] border-[rgba(140,198,63,0.2)] text-center p-10 mb-8">
          <h1 className="text-[color:var(--lightgreen)] mb-6 text-[clamp(32px,5vw,56px)]">
            About the Climate Stories Library
          </h1>
          <p className="text-[clamp(16px,1.8vw,22px)] leading-relaxed opacity-90 max-w-[600px] mx-auto">
            We believe every voice matters in the climate conversation. Our mission is to amplify stories from those at the frontlines of the climate and nature crisis.
          </p>
        </div>

        <section className="bg-[rgba(0,0,0,0.2)] rounded-[15px] backdrop-blur-sm border-[5px] border-[rgba(140,198,63,0.2)] p-9 mb-8 rounded-xl">
          <h2 className="text-[color:var(--lightgreen)] mb-6 text-[clamp(20px,2.5vw,32px)] block">
            Our Aims
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
            {[
              { title: "Direct Storytelling", desc: "To enable those at the frontlines of the climate and nature crisis to tell their story directly and easily to a global audience." },
              { title: "Amplify Voices", desc: "To amplify the voices of those who are often less heard, or not heard at all." },
              { title: "Build Connections", desc: "To build solidarity and connections between individuals and grassroots movements and to encourage seeing the world through the lenses of others." },
              { title: "Global Collaboration", desc: "We aim to develop a network of collaborators around the world with whom we can co-create this project." }
            ].map((aim, index) => (
              <div key={index} className="bg-[rgba(255,255,255,0.05)] p-6 rounded-lg border border-[rgba(140,198,63,0.1)]">
                <h3 className="text-[color:var(--lightgreen)] mb-3 text-[clamp(16px,1.4vw,20px)] block">
                  {aim.title}
                </h3>
                <p className="leading-relaxed opacity-90">
                  {aim.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[rgba(0,0,0,0.2)] rounded-[15px] backdrop-blur-sm border-[5px] border-[rgba(140,198,63,0.2)] p-9 mb-8 rounded-xl">
          <h2 className="text-[color:var(--lightgreen)] mb-6 text-[clamp(20px,2.5vw,32px)] block">
            Future Developments
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
            <div className="bg-[rgba(255,255,255,0.05)] p-6 rounded-lg border border-[rgba(140,198,63,0.1)]">
              <h3 className="text-[color:var(--lightgreen)] mb-3 text-[clamp(16px,1.4vw,20px)] block">
                🎨 Artistic Responses
              </h3>
              <p className="leading-relaxed opacity-90">
                Create a platform of artistic responses to the stories, making art which in itself further raises awareness of the reality of how the climate crisis is interwoven with other social inequities.
              </p>
            </div>
            <div className="bg-[rgba(255,255,255,0.05)] p-6 rounded-lg border border-[rgba(140,198,63,0.1)]">
              <h3 className="text-[color:var(--lightgreen)] mb-3 text-[clamp(16px,1.4vw,20px)] block">
                🤝 Research & Activism
              </h3>
              <p className="leading-relaxed opacity-90">
                Lead to the co-creation of research and activism surrounding issues of local justice.
              </p>
            </div>
          </div>
        </section>

        <div className="bg-[rgba(0,0,0,0.2)] rounded-[15px] backdrop-blur-sm border-[5px] border-[rgba(140,198,63,0.2)] p-9 mb-8 rounded-xl">
          <h2 className="text-[color:var(--lightgreen)] mb-6 text-[clamp(20px,2.5vw,32px)] block">
            Why Focus on Climate?
          </h2>
          <p className="leading-relaxed opacity-90">
            We see the climate crisis as just one of many symptoms of a current way of being, particularly by a global minority. A way of being in the world that has also caused, and is causing, other forms of social injustice.
          </p>
          <p className="leading-relaxed opacity-90">
            As part of wider forms of unfair disadvantage, the climate crisis is one of the symptoms that affects all of us but in different ways. It connects us globally and, in doing so, it is an issue that can be used to connect with other health and wellbeing inequities, entangled with the climate crisis, which will differ for individuals from different localities and backgrounds.
          </p>
        </div>

        <div className="bg-[rgba(0,0,0,0.2)] rounded-[15px] backdrop-blur-sm border-[5px] border-[rgba(140,198,63,0.2)] p-9 mb-8 rounded-xl">
          <h2 className="text-[color:var(--lightgreen)] mb-6 text-[clamp(20px,2.5vw,32px)] block">
            Meet the Team
          </h2>
          <p className="team-intro leading-relaxed opacity-90 mb-6">We are a small team of teachers and scientists who care about communicating the reality of the climate and nature crisis as a social justice issue.</p>
          
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
            <div className="bg-[rgba(255,255,255,0.05)] p-6 rounded-lg border border-[rgba(140,198,63,0.1)]">
              <div className="flex items-center mb-4">
                <Image src="/imgs/p1.webp" alt="Juliet Nolan" width={150} height={150} className="rounded-full mr-4" />
                <div className="member-info">
                  <h3 className="text-[color:var(--lightgreen)] text-[clamp(18px,2vw,24px)] mb-2">Juliet Nolan</h3>
                  <p className="leading-relaxed opacity-90 text-[clamp(14px,1.2vw,18px)]">Juliet is a Geographer turned Primary School teacher, with time spent as a children&apos;s book editor along the way. She believes in the power of storytelling and art to spark empathy and understanding - and hopefully to prompt action. You can also find her on BlueSky / X as <a target="_blank" href="https://MPForNature.bsky.social" className="text-[color:var(--lightgreen)] underline">mpfornature.bsky.social</a> and <a target="_blank" href="https://x.com/MPforNature" className="text-[color:var(--lightgreen)] underline">@MPForNature</a></p>
                </div>
              </div>
            </div>
            
            <div className="bg-[rgba(255,255,255,0.05)] p-6 rounded-lg border border-[rgba(140,198,63,0.1)]">
              <div className="flex items-center mb-4">
                <Image src="/imgs/p2.webp" alt="Jennie Lord" width={150} height={150} className="rounded-full mr-4" />
                <div className="member-info">
                  <h3 className="text-[color:var(--lightgreen)] text-[clamp(18px,2vw,24px)] mb-2">Jennie Lord</h3>
                  <p className="leading-relaxed opacity-90 text-[clamp(14px,1.2vw,18px)]">Jennie is an ecologist, working at a global health institute. She is amid trying to (un)(re)learn about what it means to be a scientist &apos;in&apos;, instead of &apos;outside&apos; society. She will probably still be on this journey way into retirement. You can find her at <a target="_blank" href="https://jenniesuz.bsky.social" className="text-[color:var(--lightgreen)] underline">@jenniesuz.bsky.social</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[rgba(0,0,0,0.2)] rounded-[15px] backdrop-blur-sm border-[5px] border-[rgba(140,198,63,0.2)] p-9 mb-8 rounded-xl">
          <h2 className="text-[color:var(--lightgreen)] mb-6 text-[clamp(20px,2.5vw,32px)] block">
            Advisory Group
          </h2>
          <p className="leading-relaxed opacity-90 mb-4">An advisory group of individuals from countries on the frontlines of the climate crisis is helping us shape this project so that it is as useful as possible to as many people as possible. The eventual aim is for the Climate Stories Library to become a tool for collaboration between countries and activism. If you are interested in becoming a Global Advisor, please contact us at the email address below.</p>
          
          <h3 className="text-[color:var(--lightgreen)] text-[clamp(18px,2vw,24px)] mb-4">
            Global Advisors include:
          </h3>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
            <div className="bg-[rgba(255,255,255,0.05)] p-6 rounded-lg border border-[rgba(140,198,63,0.1)]">
              <div className="flex items-center mb-4">
                <Image src="/imgs/p3.webp" alt="Priyadarshan Kumar" width={120} height={120} className="rounded-full mr-4" />
                <div className="advisor-info">
                  <h3 className="text-[color:var(--lightgreen)] text-[clamp(16px,1.4vw,20px)] mb-2">Priyadarshan Kumar</h3>
                  <h4 className="text-[color:var(--lightgreen)] text-[clamp(14px,1.2vw,18px)] mb-2">A schoolteacher from Bihar, India</h4>
                  <p className="leading-relaxed opacity-90 text-[clamp(12px,1vw,16px)]">Priyadarshan teaches at the Savitribai Phule Memorial School for Dalit children in Darbhanga, India, and leads community activities to improve water and health in his village.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[rgba(255,255,255,0.05)] p-6 rounded-lg border border-[rgba(140,198,63,0.1)]">
              <div className="flex items-center mb-4">
                <Image src="/imgs/p4.webp" alt="Joseph Masembe" width={120} height={120} className="rounded-full mr-4" />
                <div className="advisor-info">
                  <h3 className="text-[color:var(--lightgreen)] text-[clamp(16px,1.4vw,20px)] mb-2">Joseph Masembe</h3>
                  <h4 className="text-[color:var(--lightgreen)] text-[clamp(14px,1.2vw,18px)] mb-2">Founder of Little Hands Go Green</h4>
                  <p className="leading-relaxed opacity-90 text-[clamp(12px,1vw,16px)]">Little Hands Go Green is a Ugandan child-led civic organisation that teaches and mentors children to become the drivers of environmental conservation in their schools and communities.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="bg-[rgba(0,0,0,0.2)] rounded-[15px] backdrop-blur-sm border-[5px] border-[rgba(140,198,63,0.2)] text-center p-9 mb-8 rounded-xl">
          <h2 className="text-[color:var(--lightgreen)] mb-6 text-[clamp(20px,2.5vw,32px)] block">
            Contact Us
          </h2>
          <p>
            Contact us by email at{' '}
            <a 
              href="mailto:juliet@climatestorieslibrary.com" 
              className="text-[color:var(--lightgreen)] underline font-semibold hover:text-white"
            >
              juliet@climatestorieslibrary.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
