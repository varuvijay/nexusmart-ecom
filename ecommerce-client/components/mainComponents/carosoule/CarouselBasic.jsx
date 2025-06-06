import {
  Carousel,
  CarouselContent,
  CarouselNavigation,
  CarouselIndicator,
  CarouselItem,
} from '@/components/motion-primitives/carousel';



export function CarouselBasic() {
  return (
    <div className='relative w-full '>
      <Carousel>
        <CarouselContent>
          <CarouselItem className='p-4 '>
            <div className='flex  items-center justify-center border border-black  dark:border-zinc-800 rounded rounded-xl contain-content'>
             <img src="https://img.freepik.com/free-vector/travel-landing-page-template-with-image_52683-30345.jpg?t=st=1745892055~exp=1745895655~hmac=52437f4342b755beed1cc852737ee629d9ec3d230b3d82f87fc13af173ae9ccf&w=1380" alt="" className="w-full h-[60vh] object-cover " />
            </div>
          </CarouselItem>
          <CarouselItem className='p-4'>
            <div className='flex  items-center justify-center border border-zinc-200 dark:border-zinc-800 rounded rounded-xl contain-content'>
             <img src="https://img.freepik.com/free-vector/travel-landing-page-template-with-image_52683-30345.jpg?t=st=1745892055~exp=1745895655~hmac=52437f4342b755beed1cc852737ee629d9ec3d230b3d82f87fc13af173ae9ccf&w=1380" alt="" className="w-full h-[60vh] object-cover " />
            </div>
          </CarouselItem>
          <CarouselItem className='p-2'>
            <div className='flex  items-center justify-center border border-zinc-200 dark:border-zinc-800 rounded rounded-xl contain-content'>
             <img src="https://img.freepik.com/free-vector/travel-landing-page-template-with-image_52683-30345.jpg?t=st=1745892055~exp=1745895655~hmac=52437f4342b755beed1cc852737ee629d9ec3d230b3d82f87fc13af173ae9ccf&w=1380" alt="" className="w-full h-[60vh] object-cover " />
            </div>
          </CarouselItem>
          <CarouselItem className='p-2'>
            <div className='flex  items-center justify-center border border-zinc-200 dark:border-zinc-800 rounded rounded-xl contain-content'>
             <img src="https://img.freepik.com/free-vector/travel-landing-page-template-with-image_52683-30345.jpg?t=st=1745892055~exp=1745895655~hmac=52437f4342b755beed1cc852737ee629d9ec3d230b3d82f87fc13af173ae9ccf&w=1380" alt="" className="w-full h-[60vh] object-cover " />
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselNavigation alwaysShow />
        <CarouselIndicator />
      </Carousel>
    </div>
  );
}
