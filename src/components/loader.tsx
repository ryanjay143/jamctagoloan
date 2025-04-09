import '../components/loader.css'


const loader = () => {
  return (
    <div className='flex items-center justify-center h-96 top-1/2 left-1/2 absolute translate-x-[-50%] translate-y-[-50%]'>
        <div className="loader"></div> 
    </div>
    
  )
}

export default loader