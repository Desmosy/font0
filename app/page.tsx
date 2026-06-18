import Image from "next/image";
import LandingNav from "@/components/LandingNav";
import LandingPromptBar from "@/components/LandingPromptBar";

export default function Landing() {
  return (
    <div className="mockup-landing">
      <Image
        src="/bg.png"
        alt=""
        fill
        priority
        className="mockup-bg"
        sizes="100vw"
      />
      <LandingNav />
      <div className="mockup-compose">
        <div className="mockup-folder-wrap">
          <Image
            src="/fonts-folder.png"
            alt="Fonts folder"
            width={1366}
            height={768}
            priority
            className="mockup-folder"
          />
        </div>
        <LandingPromptBar />
      </div>
    </div>
  );
}
