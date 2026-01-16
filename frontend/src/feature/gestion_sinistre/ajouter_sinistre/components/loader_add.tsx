import Lottie from "lottie-react";
import loading from '../assets/Loading.json';




const LoaderAdd = () => {


  return (
    <div className='bg-red-200 w-full h-full pb-30' style={{backgroundColor: '#F5F5F5'}}>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Déclarer un sinistre</h1>
                <p className="text-gray-600">Nous sommes là pour vous accompagnez</p>
            </div>
            <div className='bg-white p-8 pt-12'>
                <div>
                    <h1 className='text-center'>Déclaration en cours...</h1>
                    <div className='flex justify-center'>
                        <Lottie animationData={loading}/>
                        {/* <img src={success} className='w-40 h-40'/> */}
                    </div>
                </div>
            </div>
          </main> 
        </div>
  )
}

export default LoaderAdd