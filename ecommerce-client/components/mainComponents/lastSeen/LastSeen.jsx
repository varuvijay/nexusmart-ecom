import React from 'react'

const LastSeen = () => {
  return (
    <div className='border mt-10  w-full h-[40vh]  flex-center p-5 '>
        <div className=' flex-center gap-5 w-full  h-full'>
         {
         Array(5).fill(0).map((_,index)=>(
                <div key={index} className='border border-red-500 w-full h-full flex-center rounded-2xl contain-content '>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoBuMvSuYezLE9rwI-zOJeIOmcIGfDPqOvFA&s" alt="" className='object-center object-cover w-full h-full' />
                </div>
            ))
         }
        </div>
    </div>
  )
}

export default LastSeen