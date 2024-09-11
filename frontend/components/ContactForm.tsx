"use client";

import { FC } from "react";
import { useForm } from "react-hook-form";
import { sendEmail } from "@/utils/send-email";

export type FormData = {
  name: string;
  email: string;
  message: string;
};

const ContactForm: FC = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();

  function onSubmit(data: FormData) {
    sendEmail(data);
    reset();
  }

  return (
    <div className="bg-amber-300 mt-12 md:mt-20 lg:mt-28 flex flex-col md:block lg:px-80 md:px-56 items-center font-Kanit transition-all duration-500 ease-in md:static md:z-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5">
          <label
            htmlFor="name"
            className="mb-3 block text-lg md:text-xl lg:text-2xl font-medium text-stone-800"
          >
            Full Name
          </label>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full rounded-md border border-gray-300 bg-white py-3 px-6 text-lg md:text-xl lg:text-2xl font-medium text-gray-700 outline-none focus:border-purple-500 focus:shadow-md"
            {...register("name", { required: true })}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="email"
            className="mb-3 block text-lg md:text-xl lg:text-2xl font-medium text-stone-800"
          >
            Email Address
          </label>
          <input
            type="email"
            placeholder="example@domain.com"
            className="w-full rounded-md border border-gray-300 bg-white py-3 px-6 text-lg md:text-xl lg:text-2xl font-medium text-gray-700 outline-none focus:border-purple-500 focus:shadow-md"
            {...register("email", { required: true })}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="message"
            className="mb-3 block text-lg md:text-xl lg:text-2xl font-medium text-stone-800"
          >
            Message
          </label>
          <textarea
            rows={4}
            placeholder="Type your message"
            className="w-full resize-none rounded-md border border-gray-300 bg-white py-3 px-6 text-lg md:text-xl lg:text-2xl font-medium text-gray-700 outline-none focus:border-purple-500 focus:shadow-md"
            {...register("message", { required: true })}
          ></textarea>
        </div>
        <div className="flex items-center justify-center">
          <button className="px-6 py-2 md:mt-6 border-2 border-stone-800 bg-purple-800 text-amber-300 rounded-2xl text-xl md:text-xl lg:text-2xl shadow-lg hover:bg-purple-900">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
