import React from 'react';
import img1 from '../images/girl1.jpg';
import img2 from '../images/wood2.jpg';
import img3 from '../images/wood1.jpg';
import img4 from '../images/home.jpg';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Rajesh Sharma',
      date: '15/02/24',
      rating: 4.8,
      text: 'The stay was truly magical and memorable. The cabin provided a perfect escape from city life. When it is quiet, you can hear the sounds of nature which is so soothing.',
      image: img1,
    },
    {
      name: 'Priya Patel',
      date: '28/01/24',
      rating: 5.0,
      text: "We had a wonderful experience at the cabin. The ambience was perfect for our anniversary celebration. The staff was very courteous and helpful. Will definitely visit again!",
      image: img2,
    },
    {
      name: 'Anil Verma',
      date: '10/12/23',
      rating: 4.9,
      text: "This was our second visit and it was even better than the first. The cabin is cozy, warm, private, and perfect for a family getaway. The kids loved exploring the surroundings.",
      image: img3,
    },
    {
      name: 'Sunita Desai',
      date: '05/03/24',
      rating: 4.7,
      text: "Beautiful cabin with modern amenities yet a rustic charm. Everything was super clean and comfortable. The kitchen was well-stocked and the view from the balcony was breathtaking.",
      image: img4,
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="container-custom">
        <h2 className="text-3xl font-semibold text-center mb-12">Happy clients</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full mr-4 overflow-hidden bg-green-700 flex items-center justify-center text-white text-xl font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-medium">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.date}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{testimonial.text}</p>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-2">{testimonial.rating}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
