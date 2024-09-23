"use client";

import { FC } from "react";
import { useForm } from "react-hook-form";
import { sendCompanyData } from "@/utils/send-company-data";

export type CompanyDetailsFormData = {
  company_name: string;
  company_website_url: string;
  job_description: string;
};

const CompanyDetailsForm: FC = () => {
  const { register, handleSubmit, reset } = useForm<CompanyDetailsFormData>();

  function onSubmit(data: CompanyDetailsFormData) {
    sendCompanyData(data);
    reset();
  }

  return (
    <div className="bg-amber-300 mt-12 lg:mt-10 flex flex-col md:block lg:px-16 md:px-10 items-center font-Kanit transition-all duration-500 ease-in md:static md:z-auto">
      <p className="w-full px-10 md:px-20 lg:px-36 mb-10 text-center text-base md:text-xl lg:text-2xl text-stone-800 transition-all duration-500 ease-in md:static md:z-auto leading-7 md:leading-10">
        First of all, let's gather some information about the <b>Company</b> and
        the <b>Vacancy</b> you are applying for:
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5">
          <label
            htmlFor="company_name"
            className="mb-3 block text-lg md:text-xl lg:text-2xl font-medium text-stone-800"
          >
            Company Name
          </label>
          <input
            id="company_name"
            type="text"
            placeholder="Company Name"
            className="w-full rounded-md border border-gray-300 bg-white py-3 px-6 text-lg md:text-xl lg:text-2xl font-medium text-gray-700 outline-none focus:border-purple-500 focus:shadow-md"
            {...register("company_name", { required: true })}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="company_name"
            className="mb-3 block text-lg md:text-xl lg:text-2xl font-medium text-stone-800"
          >
            Company Website
          </label>
          <input
            id="company_website_url"
            type="company_website_url"
            placeholder="https://www.company.com/"
            className="w-full rounded-md border border-gray-300 bg-white py-3 px-6 text-lg md:text-xl lg:text-2xl font-medium text-gray-700 outline-none focus:border-purple-500 focus:shadow-md"
            {...register("company_website_url", { required: true })}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="job_description"
            className="mb-3 block text-lg md:text-xl lg:text-2xl font-medium text-stone-800"
          >
            Job Description
          </label>
          <textarea
            id="job_description"
            rows={4}
            placeholder="Paste the Job Description here"
            className="w-full resize-y rounded-md border border-gray-300 bg-white py-3 px-6 text-lg md:text-xl lg:text-2xl font-medium text-gray-700 outline-none focus:border-purple-500 focus:shadow-md"
            {...register("job_description", { required: true })}
          ></textarea>
        </div>
        <div className="flex items-center justify-center">
          <button className="px-6 py-2 lg:py-3 md:mt-6 border-2 border-stone-800 bg-purple-800 text-amber-300 rounded-2xl text-xl md:text-2xl lg:text-3xl shadow-lg hover:bg-purple-900">
            Submit Data
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyDetailsForm;
