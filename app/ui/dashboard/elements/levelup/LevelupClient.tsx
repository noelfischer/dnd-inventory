'use client'

const LevelupClient = () => {


    return (
        <div className="h-full w-full">
            <button className="group h-full w-full relative overflow-hidden bg-secondary text-black text-2xl transition-all duration-300
            before:absolute before:left-0 before:bottom-0 before:w-full before:h-0 hover:before:h-full 
            hover:text-white hover:font-bold hover:before:skew-y-0 hover:font-bold hover:scale-105 
            before:bg-green-500 before:transition-all before:duration-500 before:origin-bottom-left before:skew-y-6">
                <span className="relative z-10 h-full w-full group-hover:[text-shadow:_0_2px_0_rgb(0_0_0_/_40%)] delay-100 transition-all duration-300">Level Up</span>
            </button>

        </div>
    );
}

export default LevelupClient;