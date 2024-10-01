"use client"

import React from "react";

export default function Home() {
  const [isSelectedSection, setIsSelectedSection] = React.useState<string | null>(null);
  function scrollToSection(id: string) {
    setIsSelectedSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // listen for scroll events to update the selected section
  React.useEffect(() => {
    function handleScroll() {
      const scrollPosition = window.scrollY;
      const sections = ["about", "program", "contact"];
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const element = document.getElementById(section);
        if (element) {
          const offset = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= offset && scrollPosition < offset + height) {
            setIsSelectedSection(section);
            break;
          }
        }
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-black text-white py-4 sticky top-0 backdrop-blur-sm bg-opacity-80 w-full">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">ACGC Guest Communication</h1>
          <nav>
            {
              ["about", "program", "contact"].map((section) => {
                return (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={"ml-4 px-2 py-1 rounded-md hover:bg-gray-800" + (isSelectedSection === section ? " bg-gray-800" : "")}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                )
              })
            }
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id={"about"} className="bg-[#EC128F] text-white py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold">Welcome to ACGC Guest Communication</h2>
          <p className="mt-4 text-xl">Your platform for the ultimate conference experience</p>
          <a href="#program" className="mt-8 inline-block px-8 py-4 bg-white text-black rounded-md shadow-md hover:bg-gray-200">Explore the Program</a>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-black mb-4">About the Conference</h2>
          <p className="text-lg text-gray-700">The ACGC Guest Communication Conference brings together industry experts to discuss the latest trends and innovations. Join us for inspiring talks and networking opportunities.</p>
        </div>
      </section>

      {/* Program Section */}
      <section id="program" className="py-20 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-black mb-4">Conference Program</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-black">Day 1: Keynote Speakers</h3>
              <p className="mt-2 text-gray-700">Join our keynote speakers as they share insights into guest communication strategies.</p>
            </div>
            <div className="bg-gray-200 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-black">Day 2: Workshops</h3>
              <p className="mt-2 text-gray-700">Hands-on workshops to help you implement effective communication strategies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Speakers Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-black mb-4">Meet the Speakers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-black">Speaker 1</h3>
              <p className="text-gray-700">Expert in communication strategies.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-black">Speaker 2</h3>
              <p className="text-gray-700">Innovator in guest experience technologies.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-black">Speaker 3</h3>
              <p className="text-gray-700">Specialist in hospitality communication.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-black mb-4">Get in Touch</h2>
          <p className="text-gray-700">For more information about the conference, feel free to reach out.</p>
          <a href="mailto:info@acgc-conference.com" className="mt-4 inline-block px-8 py-4 bg-[#EC128F] text-white rounded-md shadow-md hover:bg-pink-700">Contact Us</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 ACGC Guest Communication. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

