"use client";
import styles from "./page.module.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import HowItWorks from "@/app/Landing/HowItWorks";
import LandingBody from "./Landing/LandingBody";

const Home = () => {
  return (
    <div className={styles.landingPage}>
      <Header />
      <LandingBody />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Home;
