import React from 'react';
import { Link } from 'react-router-dom';

// You'll need to add these images to your project
// Example path: /src/images/about-hero.jpg, /src/images/team-member1.jpg, etc.

const About = () => {
  // Team members data
  const teamMembers = [
    {
      name: "Het Gajera",
      role: "Founder & CEO",
      bio: "With over 15 years in hospitality and a passion for the outdoors, Het founded Cabin Finder to connect people with nature.",
      image: "https://t3.ftcdn.net/jpg/10/86/44/26/240_F_1086442605_8XCTOAwGVWcNI9f4Xe7tFC6NdDnjk6cW.jpg" // provided anime image
    },
    {
      name: "Parth Gopani",
      role: "Head of Operations",
      bio: "Parth ensures all our cabins meet our high standards and oversees the day-to-day operations of our platform.",
      image: "https://t4.ftcdn.net/jpg/06/22/22/17/240_F_622221708_Gg16ZdaNSixeaIORq9MuuT4w9VWTkYw4.jpg" // provided anime image
    },
    {
      name: "Vaibhav Vataliya",
      role: "Customer Experience",
      bio: "Vaibhav leads our customer support team, ensuring every guest has an exceptional experience from booking to checkout.",
      image: "https://t3.ftcdn.net/jpg/06/63/03/38/240_F_663033871_Y8Httv8rP0s8aNx92Us6pvAGdBLBJ6Yw.jpg" // provided anime image
    }
  ];

  // Values data
  const values = [
    {
      title: "Connection to Nature",
      description: "We believe in the restorative power of nature and strive to provide accommodations that connect people with the natural world.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#4d6a2d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      title: "Authentic Experiences",
      description: "Each cabin in our collection is carefully selected to offer authentic, unique experiences that create lasting memories.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#4d6a2d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      title: "Sustainability",
      description: "We are committed to promoting sustainable tourism and supporting properties that prioritize environmental responsibility.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#4d6a2d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Community Support",
      description: "By booking with us, you're supporting local economies and small businesses in rural and wilderness areas.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#4d6a2d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="bg-[#031D20] text-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542718610-a1d656d1884c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Story</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">Connecting people with extraordinary cabin experiences since 2015</p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">Our Mission</h2>
            <p className="text-xl leading-relaxed mb-10">
              At Cabin Finder, we believe that everyone deserves the opportunity to disconnect from the hustle of everyday life and reconnect with nature. 
              Our mission is to curate the finest collection of cabin retreats, making it easy for you to find the perfect getaway that nourishes your soul 
              and creates lasting memories with loved ones.
            </p>
            <div className="flex justify-center">
              <Link to="/cabins" className="bg-[#4d6a2d] hover:bg-[#3d5423] text-white py-3 px-8 rounded-md transition-colors duration-300">
                Explore Our Cabins
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 px-4 bg-[#052e32]">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {values.map((value, index) => (
              <div key={index} className="bg-[#031D20] p-8 rounded-lg shadow-lg text-center">
                <div className="flex justify-center mb-6">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-20 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Cabin in the woods" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold mb-6">How We Started</h2>
              <p className="text-lg mb-4">
                Cabin Finder began with a simple idea: to make it easier for people to find and book unique cabin getaways. 
                Our founder, Emma Thompson, was frustrated by the difficulty of finding authentic cabin experiences that 
                weren't commercialized or cookie-cutter.
              </p>
              <p className="text-lg mb-4">
                After a particularly challenging search for a mountain retreat in 2015, Emma decided to create a platform 
                dedicated exclusively to cabins – from rustic hideaways to luxury mountain lodges.
              </p>
              <p className="text-lg">
                What started as a small collection of 20 hand-picked properties has grown into a curated marketplace of over 
                1,500 unique cabins across North America, with plans to expand globally. Despite our growth, we remain committed 
                to our core values of authenticity, quality, and connection to nature.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 px-4 bg-[#052e32]">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-[#031D20] rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-[#4d6a2d] mb-4">{member.role}</p>
                  <p className="text-gray-300">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 text-center">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-4xl font-bold mb-6">Ready to Find Your Perfect Cabin?</h2>
          <p className="text-xl mb-10">
            Browse our collection of handpicked cabins and start planning your next adventure today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/cabins" className="bg-[#4d6a2d] hover:bg-[#3d5423] text-white py-3 px-8 rounded-md transition-colors duration-300">
              Explore Cabins
            </Link>
            <Link to="/contacts" className="bg-transparent border-2 border-white hover:bg-white hover:text-[#031D20] text-white py-3 px-8 rounded-md transition-colors duration-300">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
