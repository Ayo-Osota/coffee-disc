const Banner = (props) => {
    return (
        <div className="mt-64 -container banner">
        <h1 className='text-5xl font-bold md:text-8xl'>
          <span className="block text-coffee md:inline-block">Coffee</span> <span className="">Connoisseur</span> 
        </h1>
            <p className="mt-4 text-xl">
                Discover your local coffee shop
            </p>
            <button className="inline-flex mt-4 p-4 bg-orange-600" type="button" onClick={props.buttonHandler}>{props.buttonText}</button>
        </div>
    )
}

export default Banner;