import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import ContentWrapper from "../contentWrapper/ContentWrapper";
import "./style.scss";

const socialData = [
  {
    id: 23,
    icon: <FaFacebookF />,
    url: "https://www.facebook.com/Vaskarchdas1233",
  },
  {
    id: 12,
    icon: <FaInstagram />,
    url: "https://www.instagram.com/vcdas_123/",
  },
  {
    id: 89,
    icon: <FaLinkedin />,
    url: "https://www.linkedin.com/in/vcdas/",
  },
];

const Footer = () => {
  return (
    <footer className="footer">
      <ContentWrapper>
        <div className="infoText">
          Explore an extensive collection of movies and TV shows with in-depth
          details, reviews, and ratings. Stay updated on the latest releases and
          rediscover timeless classics. Whether you're a casual viewer or a
          passionate cinephile, we bring the magic of cinema to your screen.
          Join our community and dive into the world of entertainment.
        </div>
        <div className="socialIcons">
          {socialData?.map(item => {
            return (
              <span
                key={item?.id}
                className="icon"
                onClick={() => window.open(item?.url, "_blank")}
              >
                {item?.icon}
              </span>
            );
          })}
        </div>
      </ContentWrapper>
    </footer>
  );
};

export default Footer;
