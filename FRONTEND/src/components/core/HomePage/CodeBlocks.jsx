import React from "react";
import CTAButton from "./Button";
import { TypeAnimation } from "react-type-animation";
import { FaArrowRight } from "react-icons/fa";

const CodeBlocks = ({ position, heading, subheading, ctabtn1, ctabtn2, codeblock, backgroundGradient, codeColor}) => {
  return (
    <div className={`flex ${position} items-start justify-between gap-16 py-16`}>

      {/* Left Section */}
      <div className="flex w-full flex-col gap-8 lg:w-[50%]">

        {heading}

        <p className="max-w-[90%] text-base font-medium leading-7 text-richblack-300">
          {subheading}
        </p>

        <div className="mt-2 flex flex-wrap gap-5">
          <CTAButton active={ctabtn1.active} linkto={ctabtn1.link}>
            <div className="flex items-center gap-2">
              {ctabtn1.btnText}
              <FaArrowRight />
            </div>
          </CTAButton>

          <CTAButton active={ctabtn2.active} linkto={ctabtn2.link}>
            {ctabtn2.btnText}
          </CTAButton>
        </div>

      </div>

      {/* Right Section */}
      <div className="relative w-full rounded-2xl border border-richblack-700 bg-richblack-900 shadow-[0_0_40px_rgba(31,162,255,0.15),0_20px_60px_rgba(0,0,0,0.5)] lg:w-[700px]">

        {backgroundGradient}

        {/* Editor Header */}
        <div className="flex items-center gap-2 border-b border-richblack-700 px-5 py-3">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
        </div>

        {/* Code Area */}
        <div className="flex px-4 py-5">

          {/* Line Numbers */}
          <div className="flex w-[12%] flex-col items-center font-mono text-richblack-500 select-none">
            {Array.from({ length: 11 }, (_, i) => (
              <p key={i}>{i + 1}</p>
            ))}
          </div>

          {/* Code */}
          <div className={`w-[88%] font-mono text-sm leading-7 ${codeColor}`}>
            <TypeAnimation
              sequence={[codeblock, 2000, ""]}
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
              style={{
                whiteSpace: "pre-line",
                display: "block",
              }}
            />
          </div>

        </div>
      </div>

    </div>
  );
};

export default CodeBlocks;