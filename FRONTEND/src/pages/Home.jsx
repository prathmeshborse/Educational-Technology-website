// Icons Import
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

// Image and Video Import
import Banner from "../assets/Images/banner.mp4";

// Component Imports
import HighlightText from "../components/core/HomePage/HighlightText";
import CTAButton from "../components/core/HomePage/Button";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import ExploreMore from "../components/core/HomePage/ExploreMore";
import TimelineSection from "../components/core/HomePage/TimeLineSection";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import ReviewSlider from "../components/common/ReviewSlider";
import Footer from "../components/common/Footer";

function Home() {
  return (
    <div>

        {/* Section 1 */}
        <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-white">
            <Link to="/signup">
                <div className="group mt-16 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 p-[2px] shadow-lg shadow-yellow-500/30 transition-all duration-300 hover:scale-105 hover:shadow-yellow-400/50">
                    <div className="flex items-center gap-3 rounded-full bg-richblack-900 px-8 py-3 font-semibold tracking-wide transition-all duration-300 group-hover:bg-richblack-800">
                        <span>Become an Instructor</span>
                        <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                </div>
            </Link>

            {/* Heading */}
            <div className="text-center text-4xl font-semibold">
                Empower Your Future with <HighlightText text={"Coding Skills"} />
            </div>

            {/* Sub Heading */}
            <div className="-mt-3 w-[90%] text-center text-lg font-bold text-richblack-300">
                With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-row gap-7">
                <CTAButton active={true} linkto={"/signup"}> Learn More </CTAButton>
                <CTAButton active={false} linkto={"/login"}> Book a Demo </CTAButton>
            </div>

            {/* Video */}
            <div className="mx-3 my-4 max-w-6xl rounded-2xl border border-richblack-700 bg-richblack-800 p-1 shadow-[0_0_30px_rgba(59,130,246,0.25),0_20px_60px_rgba(0,0,0,0.5)]">
                <video className="w-full rounded-xl" muted loop autoPlay playsInline>
                    <source src={Banner} type="video/mp4" />
                </video>
            </div>

            {/* Code Section 1  */}
            <div>
                <CodeBlocks position={"lg:flex-row"} 
                    heading={
                        <div className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl">
                            Unlock your
                            <HighlightText text=" coding potential " />
                            with our online courses.
                        </div>
                    }
                    subheading={ "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}
                    ctabtn1={{btnText: "Try it Yourself", link: "/signup", active: true, }}
                    ctabtn2={{ btnText: "Learn More", link: "/signup", active: false, }}
                    codeColor={"text-yellow-25"}
                    codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a> </nav> </body>`}
                    backgroundGradient={<div className="codeblock absolute"></div>}
                />
            </div>

            {/* Code Section 2 */}
            <div>
                <CodeBlocks position={"lg:flex-row-reverse"}
                    heading={
                        <div className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl">
                            Start
                            <HighlightText text={" coding in seconds"} />
                        </div>
                    }
                    subheading={ "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson." }
                    ctabtn1={{ btnText: "Continue Lesson", link: "/signup", active: true, }}
                    ctabtn2={{ btnText: "Learn More", link: "/signup", active: false, }}
                    codeColor={"text-yellow-25"}
                    codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\nconst Home = () => {\n\treturn ( <div>Home</div> )\n}\nexport default Home;`}
                    backgroundGradient={<div className="codeblock absolute"></div>}
                />
            </div>
            
            {/* Explore Section */}
            <ExploreMore />
        </div>
        
        {/* Section 2 */}
        <div className="bg-pure-greys-5 text-richblack-700">
            <div className="homepage_bg h-[320px]">

                <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">

                    <div className="lg:h-[150px]"></div>
                    <div className="flex flex-row gap-7 text-white lg:mt-8">

                        <CTAButton active={true} linkto={"/signup"}>
                            <div className="flex items-center gap-2">
                                Explore Full Catalog <FaArrowRight />
                            </div>
                        </CTAButton>

                        <CTAButton active={false} linkto={"/login"}>
                            Learn More
                        </CTAButton>

                    </div>
                </div>
            </div>
        
            {/* /// */}
            <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 ">

                {/* Job that is in Demand - Section 1 */}
                <div className="mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">

                    <div className="text-4xl font-semibold lg:w-[45%] ">
                        Get the skills you need for a{" "}
                        <HighlightText text={"job that is in demand."} />
                    </div>

                    <div className="flex flex-col items-start gap-10 lg:w-[50%]">
                        <div className="text-[17px] font-semibol">
                            The modern StudyNotion is the dictates its own terms. Today, to
                            be a competitive specialist requires more than professional
                            skills.
                        </div>
                        <CTAButton active={true} linkto={"/signup"}>
                            <div className="">Learn More</div>
                        </CTAButton>
                    </div>

                </div>

                {/* Timeline Section - Section 2 */}
                <TimelineSection />

                {/* Learning Language Section - Section 3 */}
                <LearningLanguageSection />
                
            </div>
        </div>
        

        {/* Section 3 */}
        <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
            {/* Become a instructor section */}
            <InstructorSection />

            {/* Reviws from Other Learner */}
            <h1 className="text-center text-4xl font-semibold mt-8"> Reviews from other learners </h1>
            
            <ReviewSlider />
        </div>

        {/* Footer */}
        <Footer />
    </div>
  )
};

export default Home;