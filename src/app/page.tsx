import dynamic from "next/dynamic";

// Dynamically import with SSR disabled, fix window error
const Home = dynamic(() => import("./home/home"), {
  ssr: false,
});

const Page = () => {
  return <Home />;
};

export default Page;
