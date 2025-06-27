// import React from "react";
// import { Container, Row, Col, Image } from "react-bootstrap";
// // import aboutImg from "../assets/about.jpg"; // Use a relevant image

// const AboutPage = () => {
//   return (
//     <div className="about-page py-5">
//       <Container>
//         <Row className="align-items-center">
//           <Col md={6} className="mb-4 mb-md-0">
//             {/* <Image src={aboutImg} alt="About EasyCook" fluid rounded /> */}
            
//            <img
//             //  src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80"
//              src="https://plus.unsplash.com/premium_photo-1723892428471-c57c4c49b7d1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hlZiUyMGtpdGNoZW4lMjBob21lfGVufDB8fDB8fHww"
//            alt="Cooking"
//              className="img-fluid rounded shadow"
//            />
//           </Col>
//           <Col md={6}>
//             <h2 className="mb-4 text-brown">About EasyCook</h2>
//             <p className="text-muted">
//               <strong>EasyCook</strong> is a platform that connects passionate home chefs with food lovers looking
//               for fresh, homemade meals prepared right in their homes. Whether it's a cozy breakfast, a
//               healthy lunch, or a delightful dinner, our chefs deliver a personalized dining experience
//               tailored to your taste.
//             </p>
//             <p className="text-muted">
//               Our mission is to make home-cooked food accessible and bring people together over authentic, freshly prepared dishes.
//               With flexible booking options and verified chefs, EasyCook ensures every meal is safe, special, and delicious.
//             </p>
//             <p className="text-muted">
//               We believe in empowering local culinary talent and creating memorable food moments across homes.
//             </p>
//           </Col>
//         </Row>

//          <Row>
//             <div className="bg-light p-4 rounded text-center mt-5">
//         <h5 className="fw-semibold">Have questions or need help?</h5>
//         <p className="mb-1">Feel free to reach out to us at:</p>
//         <a href="mailto:easycook.help@gmail.com" className="text-navyBlue fw-bold">
//           easycook.help@gmail.com
//         </a>
//       </div>
//          </Row>
//       </Container>
//     </div>
//   );
// };

// export default AboutPage;

import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
// import aboutImg from "../assets/about.jpg"; // Use a relevant image

const AboutPage = () => {
  return (
    <div className="about-page py-5">
      <Container>
        <Row className="mb-5">
          <Col>
            <h1 className="text-center mb-4 text-brown">Welcome to EasyCook</h1>
            <p className="text-muted text-center mx-auto" style={{ maxWidth: "750px" }}>
              At EasyCook, we’re transforming everyday meals into personalized dining experiences by connecting you with talented home chefs. Whether you're craving comfort food or planning a special evening, our chefs bring the taste of home right to your doorstep.
            </p>
          </Col>
        </Row>

        <Row className="align-items-center mb-5">
          <Col md={6} className="mb-4 mb-md-0">
           <Image src={"../images/aboutEasycook.avif"} alt="About EasyCook" fluid rounded />
            {/* <img
              src="https://plus.unsplash.com/premium_photo-1723892428471-c57c4c49b7d1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hlZiUyMGtpdGNoZW4lMjBob21lfGVufDB8fDB8fHww"
              alt="Cooking"
              className="img-fluid rounded shadow"
            /> */}
          </Col>
          <Col md={6}>
            <h2 className="mb-4 text-brown">About EasyCook</h2>
            <p className="text-muted">
              <strong>EasyCook</strong> is a platform that connects passionate home chefs with food lovers looking
              for fresh, homemade meals prepared right in their homes. Whether it's a cozy breakfast, a
              healthy lunch, or a delightful dinner, our chefs deliver a personalized dining experience
              tailored to your taste.
            </p>
            <p className="text-muted">
              Our mission is to make home-cooked food accessible and bring people together over authentic, freshly prepared dishes.
              With flexible booking options and verified chefs, EasyCook ensures every meal is safe, special, and delicious.
            </p>
            <p className="text-muted">
              We believe in empowering local culinary talent and creating memorable food moments across homes.
            </p>
          </Col>
        </Row>

        {/* Contact Section */}
        <Row>
          <Col>
            <div className="bg-light p-4 rounded text-center mt-4">
              <h5 className="fw-semibold mb-2">Have questions or need help?</h5>
              <p className="mb-1 text-muted">We're here for you Monday to Saturday, 9AM - 6PM.</p>
              <p className="mb-2 text-muted">Feel free to reach out to us at:</p>
              <a href="mailto:easycook.help@gmail.com" className="text-navyBlue fw-bold">
                easycook.help@gmail.com
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutPage;
