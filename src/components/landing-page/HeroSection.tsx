"use client";
import { useRouter } from "next/navigation";
import Button from "./Button";

const HeroSection = () => {
        const router = useRouter();
        return (
                <div
                        id="hero"
                        className="heroBackgroundPic pt-[100px] w-full h-[80vh] md:h-[120vh] px-5 md:px-20 text-white flex justify-around items-center"
                >
                        <div className="md:w-[90%] text-center">
                                <h1 className="text-[50px] md:text-[60px] leading-[55px] md:leading-none">
                                        Embark on a travel adventure with us
                                </h1>
                                <p className="text-xl md:text-3xl mt-0 md:mt-5">
                                        Get the best deals at affordable price
                                </p>
                                <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-5 md:mt-8">
                                        <Button
                                                btnStyles="md:text-[20px] bg-transparent hover:bg-customBlue hover:text-white text-white border border-white px-4 md:px-10 py-2 rounded-3xl cursor-pointer transition duration-500 ease-in-out"
                                                btnType="button"
                                                btnContent="Book Flight"
                                                handleSubmit={() => router.push("/#bookflight")}
                                        />
                                        <Button
                                                btnStyles="md:text-[20px] bg-customBlue hover:bg-cyan-600 text-white border border-customBlue px-4 md:px-10 py-2 rounded-3xl cursor-pointer transition duration-500 ease-in-out"
                                                btnType="button"
                                                btnContent="Travel Packages"
                                                handleSubmit={() => router.push("/travel-packages")}
                                        />
                                </div>
                        </div>
                </div>
        );
};

export default HeroSection;
