import { Vortex } from "react-loader-spinner";
const Loader = () => {
  return (
    <Vortex
      visible={true}
      height="80"
      width="80"
      ariaLabel="vortex-loading"
      wrapperStyle={{}}
      wrapperClass="vortex-wrapper"
      colors={["red", "green", "blue", "gold", "white", "purple"]}
    />
  );
};

export default Loader;
