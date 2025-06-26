import Image from "next/image";

export default function About() {
  return (
    <div id="main" className="noPadding">
      <div className="about-container">
        <div className="about-header green-backdrop">
          <h1>About the Climate Stories Library</h1>
          <p className="about-subtitle">
            We believe every voice matters in the climate conversation. Our mission is to amplify stories from those at the frontlines of the climate and nature crisis.
          </p>
        </div>

        <div className="about-section green-backdrop">
          <h2>Our Aims</h2>
          <div className="aims-grid">
            <div className="aim-item">
              <h3>Direct Storytelling</h3>
              <p>To enable those at the frontlines of the climate and nature crisis to tell their story directly and easily to a global audience.</p>
            </div>
            <div className="aim-item">
              <h3>Amplify Voices</h3>
              <p>To amplify the voices of those who are often less heard, or not heard at all.</p>
            </div>
            <div className="aim-item">
              <h3>Build Connections</h3>
              <p>To build solidarity and connections between individuals and grassroots movements and to encourage seeing the world through the lenses of others.</p>
            </div>
            <div className="aim-item">
              <h3>Global Collaboration</h3>
              <p>We aim to develop a network of collaborators around the world with whom we can co-create this project.</p>
            </div>
          </div>
        </div>

        <div className="about-section green-backdrop">
          <h2>Future Developments</h2>
          <div className="future-grid">
            <div className="future-item">
              <h3>🎨 Artistic Responses</h3>
              <p>Create a platform of artistic responses to the stories, making art which in itself further raises awareness of the reality of how the climate crisis is interwoven with other social inequities.</p>
            </div>
            <div className="future-item">
              <h3>🤝 Research & Activism</h3>
              <p>Lead to the co-creation of research and activism surrounding issues of local justice.</p>
            </div>
          </div>
        </div>

        <div className="about-section green-backdrop">
          <h2>Why Focus on Climate?</h2>
          <p>We see the climate crisis as just one of many symptoms of a current way of being, particularly by a global minority. A way of being in the world that has also caused, and is causing, other forms of social injustice.</p>
          <p>As part of wider forms of unfair disadvantage, the climate crisis is one of the symptoms that affects all of us but in different ways. It connects us globally and, in doing so, it is an issue that can be used to connect with other health and wellbeing inequities, entangled with the climate crisis, which will differ for individuals from different localities and backgrounds.</p>
        </div>

        <div className="about-section green-backdrop">
          <h2>Meet the Team</h2>
          <p className="team-intro">We are a small team of teachers and scientists who care about communicating the reality of the climate and nature crisis as a social justice issue.</p>
          
          <div className="team-grid">
            <div className="team-member">
              <Image src="/imgs/p1.webp" alt="Juliet Nolan" width={150} height={150} />
              <div className="member-info">
                <h3>Juliet Nolan</h3>
                <p>Juliet is a Geographer turned Primary School teacher, with time spent as a children&apos;s book editor along the way. She believes in the power of storytelling and art to spark empathy and understanding - and hopefully to prompt action. You can also find her on BlueSky / X as <a target="_blank" href="https://MPForNature.bsky.social">mpfornature.bsky.social</a> and <a target="_blank" href="https://x.com/MPforNature">@MPForNature</a></p>
              </div>
            </div>
            
            <div className="team-member">
              <Image src="/imgs/p2.webp" alt="Jennie Lord" width={150} height={150} />
              <div className="member-info">
                <h3>Jennie Lord</h3>
                <p>Jennie is an ecologist, working at a global health institute. She is amid trying to (un)(re)learn about what it means to be a scientist &apos;in&apos;, instead of &apos;outside&apos; society. She will probably still be on this journey way into retirement. You can find her at <a target="_blank" href="https://jenniesuz.bsky.social">@jenniesuz.bsky.social</a></p>
              </div>
            </div>
          </div>
        </div>

        <div className="about-section green-backdrop">
          <h2>Advisory Group</h2>
          <p>An advisory group of individuals from countries on the frontlines of the climate crisis is helping us shape this project so that it is as useful as possible to as many people as possible. The eventual aim is for the Climate Stories Library to become a tool for collaboration between countries and activism. If you are interested in becoming a Global Advisor, please contact us at the email address below.</p>
          
          <h3 className="advisors-title">Global Advisors include:</h3>
          <div className="advisors-grid">
            <div className="advisor-member">
              <Image src="/imgs/p3.webp" alt="Priyadarshan Kumar" width={120} height={120} />
              <div className="advisor-info">
                <h3>Priyadarshan Kumar</h3>
                <h4>A schoolteacher from Bihar, India</h4>
                <p>Priyadarshan teaches at the Savitribai Phule Memorial School for Dalit children in Darbhanga, India, and leads community activities to improve water and health in his village.</p>
              </div>
            </div>
            
            <div className="advisor-member">
              <Image src="/imgs/p4.webp" alt="Joseph Masembe" width={120} height={120} />
              <div className="advisor-info">
                <h3>Joseph Masembe</h3>
                <h4>Founder of Little Hands Go Green</h4>
                <p>Little Hands Go Green is a Ugandan child-led civic organisation that teaches and mentors children to become the drivers of environmental conservation in their schools and communities.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="about-section contact-section green-backdrop">
          <h2>Contact Us</h2>
          <p>Contact us by email at <a href="mailto:juliet@climatestorieslibrary.com" className="contact-link">juliet@climatestorieslibrary.com</a></p>
        </div>
      </div>
    </div>
  );
}
