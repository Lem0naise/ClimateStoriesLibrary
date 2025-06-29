import Image from "next/image";

export default function Stories() {
  return (
    <div className="min-h-fit pb-0 bg-white h-full">
      <div className="flex flex-row w-[80vw] ml-[10vw] h-[80%]">
        <div className="absolute ml-[-8vw] mt-[-4vw]">
          <Image src="/imgs/grass.webp" alt="" width={1200} height={400} className="w-screen" />
        </div>
        <div className="pl-0 h-fit box-border text-center text-[color:var(--darkgreen)] text-[calc(1vw+7px)] font-bold w-screen mt-[calc(10vw+80px)] min-h-[80vh]">
          <h1 className="text-[calc(2vw+50px)]">Weaving Our Stories</h1>
          
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
