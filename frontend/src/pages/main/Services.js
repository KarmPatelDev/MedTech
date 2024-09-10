import React from 'react'
import data from '../../assets/servicesData';
import Layout from '../../components/layouts/Layout'

const Services = () => {
  return (
    <Layout>
        <div className='space-y-16 w-11/12 max-w-[1200px] mx-auto mt-5'>
          {
            data.map( (item) => (
                <div className="space-y-8" key={item.id}>
                
                    <div className="flex items-center gap-8">
                        <img src={item.image} alt="" className="h-[8rem] w-[8rem]"/>
                        <h1 className="text-3xl font-bold text-[#3462f6b7]">{item.title}</h1>
                    </div>
                    <div className="">
                        <p className="text-xl font-thin flex text-gray-500">{item.info}</p>
                    </div>
              
                </div>
            ))
          }
        </div>
    </Layout>
  );
};

export default Services
