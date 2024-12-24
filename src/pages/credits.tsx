import Button from "@/components/animata/button/duolingo";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export function Credits() {
  const navigate = useNavigate();

  return (
    <>
      <div className="z-10 relative h-full flex flex-col justify-between">
        <div className="pt-8 pb-4 flex justify-evenly items-center text-3xl font-bold">
          <div className="w-1/5 px-4 h-[2px] bg-[#003746]" />
          <p className="font-inter font-black text-[#003746] text-stroke-white-2">
            CRÉDITOS
          </p>
          <div className="w-1/5 px-4 h-[2px] bg-[#003746]" />
        </div>

        <div className=" grid grid-cols-1 justify-items-center gap-6 px-4">
          <InfoContainer>
            <Information
              title="IDEALIZADORA"
              name="Marciane"
              insta="marciane1000"
            />
            <Animation src="thinking.lottie" />
          </InfoContainer>
          <InfoContainer>
            <Animation src="coding.lottie" />
            <Information
              title="DESENVOLVEDOR"
              name="Pedro Ryan"
              insta="p.ryan_crn"
            />
          </InfoContainer>
          <InfoContainer>
            <Information
              title={`VOZ\nE ONOMATOPEIAS`}
              name="Sandra Puliezi"
              insta="institutolermais"
            />
            <Animation src="speaking.lottie" />
          </InfoContainer>
          <InfoContainer>
            <div className="flex items-center w-1/3 motion-preset-pulse-sm motion-duration-2000">
              <img src="/new-logo.png" alt="Logo CESI" />
            </div>
            <Information
              title={"APOIO"}
              name={`Centro Educacional\nSonho Infantil`}
              insta="cesi_infantil"
            />
          </InfoContainer>
        </div>

        <div className="px-8 pt-4 pb-8">
          <Button variants="white" onClick={() => navigate("/")}>
            <p className="flex items-center justify-center gap-2">
              {/* <ArrowLeft size={24} /> */}
              Voltar
            </p>
          </Button>
        </div>
      </div>
      {/* Sun rays background */}
      <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden sun-rays">
        <div className="fixed h-full w-full " />
      </div>
    </>
  );
}

function Animation({ src }: { src: string }) {
  return (
    <div className="flex items-center overflow-visible h-full w-1/3 pointer-events-none">
      <div className={"w-full h-full"} style={{ scale: "1.5" }}>
        <DotLottieReact
          src={`/animations/${src}`}
          loop
          autoplay
          renderConfig={{
            autoResize: true,
          }}
        />
      </div>
    </div>
  );
}

function InfoContainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center items-center gap-6 px-4 py-1 w-full">
      {children}
    </div>
  );
}

type InformationProps = {
  title: string;
  name: string;
  insta: string;
};
function Information({ title, name, insta }: InformationProps) {
  return (
    <div className="text-black flex flex-col items-center w-auto">
      <div className="text-[#003746] font-inter text-xl font-black text-center text-stroke-white-2 whitespace-pre-line">
        {title}
      </div>
      <div className="text-xl font-bold text-[#13819F] text-center text-stroke-white-2 whitespace-pre-line ">
        {name}
      </div>
      <a
        href={`https://www.instagram.com/${insta}/`}
        className="text-lg font-semibold text-[#003746] text-stroke-white-1"
      >
        @{insta}
      </a>
    </div>
  );
}
