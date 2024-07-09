import React from 'react';
import Card from './Card';

const Projects = () => {
  const projects = [
    {
      title: 'Repo2GPT',
      description: 'Python script to summarize local and GitHub projects into a doc form usable for LLM-assisted programming and code review. This tool streamlines the process of converting repository contents into a format that can be easily processed by language models, enhancing the efficiency of AI-assisted development and code analysis.',
      image: '/path/to/repo2gpt/screenshot.jpg',
      link: 'https://github.com/user/repo2gpt',
    },
    {
      title: 'SREF Seed Vault',
      description: 'Midjourney v6 Style Reference Seed # Catalog with image examples and tags. This project provides a comprehensive collection of style references for Midjourney v6, allowing users to explore various artistic styles and their corresponding seed numbers. It serves as a valuable resource for AI art enthusiasts and creators.',
      image: '/path/to/sref-seed-vault/screenshot.jpg',
      link: 'https://github.com/user/sref-seed-vault',
    },
  ];

  return (
    <div className="pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
      {projects.map((project, index) => (
        <Card key={index} title={project.title} content={
          <div className="flex flex-col h-full">
            <img src={project.image} alt={project.title} className="w-full h-48 object-cover mb-4 rounded-t-lg" />
            <p className="mb-4 flex-grow">{project.description}</p>
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded self-start mt-auto">
              View Project
            </a>
          </div>
        } className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full" />
      ))}
    </div>
  );
};

export default Projects;
