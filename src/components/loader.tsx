import '../components/loader.css';
import logo from '../assets/jamc_logo.png';

const Loader = () => {
  return (
    <div className='flex items-center justify-center h-96 top-1/2 left-1/2 absolute translate-x-[-50%] translate-y-[-50%]'>
      <div className="loader">
        <img src={logo} alt="Logo" className="loader-image" />
      </div>
    </div>
  );
}

export default Loader;