import Image from "next/image";

export default function Stories() {
  return (
    <div id="main" className="white">
      <div className="flexDiv">
        <div id="grass">
          <Image src="/imgs/grass.webp" alt="" width={1200} height={400} />
        </div>
        <div id="stories">
          <h1>Weaving Our Stories</h1>
          
          <p>Stories will appear shortly.</p>
          <div className="coverStory" id="weAreListening">
            <Image src="" alt="" width={0} height={0} />
            <div className="coverStory-Text">
              <p className="coverStory-Title"></p>
              <p className="coverStory-Description"></p>
            </div> 
          </div>
        </div>
      </div>
    </div>
  );
}
