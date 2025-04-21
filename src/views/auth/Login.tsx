import { Button } from "@/components/ui/button";
import vision from "../../assets/Vision.mp4";
import logo1 from "../../assets/black.png";

function Login() {
  return (
    <div className="flex h-screen w-full flex-row md:flex-col overflow-hidden">
      {/* Left side with video and text */}
      <div className="relative flex-1 flex flex-col justify-end items-center bg-black text-white">
        <video
          className="absolute inset-0 w-full h-full md:object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={vision} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Vision text */}
        <div className="md:hidden absolute top-0 left-0 right-0 z-10 text-center px-4 mt-4">
          <h2 className="text-xl md:text-2xl font-semibold">
            "To see every transformed life become a committed part of <br />
            the movement of building Christ-centered, Spirit-empowered, and mission-<br />
            driven churches in every campus, workplace, community, and nation.”
            <br />
            <span className="text-sm italic">— Vision</span>
          </h2>
        </div>

        {/* Mission text */}
        <div className="md:hidden relative z-10 text-center px-4 mb-4">
          <h2 className="text-xl md:text-2xl font-semibold">
            “To Know God more and make Him known.”
            <br />
            <span className="text-sm italic">— Mission</span>
          </h2>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="flex-1 flex justify-center md:justify-start md:items-start items-center bg-white px-6 md:px-10 md:py-24 py-8 md:mt-[-120px]">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img src={logo1} alt="Logo" className="h-36 md:h-18 w-auto" />
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username or Email
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your email or username"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>

          {/* Forgot password */}
          <div className="text-right text-sm">
            <a href="/forgot-password" className="text-indigo-600 hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Submit button */}
          <Button type="submit" className="w-full">
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
