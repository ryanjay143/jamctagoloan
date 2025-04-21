
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import vision from "../../assets/Vision.mp4";
import logo1 from "../../assets/black.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faLock, faSignIn, faUser } from "@fortawesome/free-solid-svg-icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Array of Bible verses including Ephesians 2:8-9
const bibleVerses = [
  { text: "Those who trust in the Lord will find new strength.", ref: "Isaiah 40:31" },
  { text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13" },
  { text: "The Lord is my shepherd; I shall not want.", ref: "Psalm 23:1" },
  { text: "Trust in the Lord with all your heart.", ref: "Proverbs 3:5" },
  { text: "For I know the plans I have for you, declares the Lord.", ref: "Jeremiah 29:11" },
  { text: "Be strong and courageous. Do not be afraid.", ref: "Joshua 1:9" },
  { text: "Cast all your anxiety on Him because He cares for you.", ref: "1 Peter 5:7" },
  { text: "For by grace you have been saved through faith.", ref: "Ephesians 2:8" },
];

function Login() {
  const [verseIndex, setVerseIndex] = useState(0);

  // Auto-advance the verse every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setVerseIndex((prev) => (prev === bibleVerses.length - 1 ? 0 : prev + 1));
    }, 5000); // 5000ms = 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setVerseIndex((prev) => (prev === 0 ? bibleVerses.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setVerseIndex((prev) => (prev === bibleVerses.length - 1 ? 0 : prev + 1));
  };

  const verse = bibleVerses[verseIndex];

  return (
    <div className="flex h-screen w-full flex-col md:flex-row overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      {/* Left side with video and text */}
      <div className="relative md:hidden flex-1 flex flex-col justify-end items-center  bg-primary text-white">
        <video
          className="absolute inset-0 w-full h-full md:object-cover "
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={vision} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Vision and Mission text */}
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-between px-4 mt-4 md:mt-8">
          <div className="text-left">
            <h2 className="text-sm md:hidden md:text-xl lg:text-xs font-semibold">
              "To see every transformed life become a committed part of the movement of  <br />
              building Christ-centered, Spirit-empowered, and mission-driven churches in <br />
              every campus, workplace, community, and nation.”<br />
              <span className="text-lg italic">— Vision</span>
            </h2>
          </div>

          <div className="text-right">
            <h2 className="text-lg md:hidden md:text-xl lg:text-xs font-semibold">
              “To Know God more and make Him known.”<br />
              <span className="text-lg italic">— Mission</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="flex-1 flex md:bg-gray-300 bg-gray-300 justify-center md:justify-center md:items-center items-center  px-6 md:px-10 py-8 md:py-16">
        <div className="w-full max-w-md backdrop-blur-md p-8 rounded-2xl space-y-5 animate-fade-in-up">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img src={logo1} alt="Logo" className="h-24 md:h-36 w-auto" />
          </div>

          {/* Username */}
          <div className="relative">
            <Label htmlFor="username" className="block text-sm font-medium text-primary">
              Username or Email
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your email or username"
              className="mt-1 md:bg-white bg-white block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm transition duration-300"
            />
            <FontAwesomeIcon icon={faUser} className="absolute left-3 top-9 text-primary h-4 w-4" />
          </div>

          {/* Password */}
          <div className="relative">
            <Label htmlFor="password" className="block text-sm font-medium text-primary">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              className="mt-1 block md:bg-white bg-white w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm  sm:text-sm transition duration-300"
            />
            <FontAwesomeIcon icon={faLock} className="absolute left-3 top-9 text-primary h-4 w-4" />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-primary" />
              <span className="text-primary">Remember me</span>
            </label>
            <a href="/forgot-password" className="text-indigo-600 hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Submit button */}
          <Button type="submit" className="w-full transition duration-300 hover:bg-gray-800">
           <FontAwesomeIcon icon={faSignIn} /> Login
          </Button>

          {/* Scripture encouragement with arrows and auto-slideshow */}
          <div className="flex items-center justify-center space-x-2 mt-2">
            <button
              type="button"
              aria-label="Previous verse"
              onClick={handlePrev}
              className="p-1 rounded-full hover:bg-gray-200 transition"
            >
              <FontAwesomeIcon icon={faAngleLeft} className="h-5 w-5 text-gray-500" />
            </button>
            <p className="text-sm text-gray-500 italic text-center max-w-xs">
              "{verse.text}" — {verse.ref}
            </p>
            <button
              type="button"
              aria-label="Next verse"
              onClick={handleNext}
              className="p-1 rounded-full hover:bg-gray-200 transition"
            >
              <FontAwesomeIcon icon={faAngleRight} className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
