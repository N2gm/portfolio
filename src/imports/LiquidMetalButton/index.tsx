import imgCanvas from "./c3ca677886aae16442144f86796e58ec4821d2ca.png";

function Canvas() {
  return (
    <div className="absolute left-0 rounded-[100px] size-[48px] top-0" data-name="Canvas">
      <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none rounded-[100px] size-full" src={imgCanvas} />
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[48px] max-w-[48px] relative rounded-[100px] shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <Canvas />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] content-stretch flex flex-col items-start left-0 rounded-[100px] shadow-[0px_0px_0px_0px_rgba(0,0,0,0.3),0px_36px_14px_0px_rgba(0,0,0,0.02),0px_20px_12px_0px_rgba(0,0,0,0.08),0px_9px_9px_0px_rgba(0,0,0,0.12),0px_2px_5px_0px_rgba(0,0,0,0.15)] size-[48px] top-0" data-name="Container">
      <Container1 />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex flex-col h-[44px] items-center justify-center left-[7px] top-0 w-[30px]">
      <p className="[word-break:break-word] font-['Playfair_Display:Bold_Italic',sans-serif] font-bold h-[33px] italic leading-[30px] relative shrink-0 text-[14px] text-[rgba(255,255,255,0.82)] w-[29px]" dir="auto">
        Hire
      </p>
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-[#505050] relative rounded-[100px] shrink-0 size-[44px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Frame />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 p-[2px] size-[48px] top-0" data-name="Container">
      <Container3 />
    </div>
  );
}

export default function LiquidMetalButton() {
  return (
    <div className="relative size-full" data-name="LiquidMetalButton">
      <Container />
      <Container2 />
    </div>
  );
}