import React from 'react';
import Card from './Card';

const Projects = () => {
  const projects = [
    {
      title: 'Repo2GPT',
      description: 'Python script to summarize local and GitHub projects into a doc form usable for LLM-assisted programming and code review',
      image: '/path/to/repo2gpt/screenshot.jpg',
      link: 'https://github.com/user/repo2gpt',
    },
    {
      title: 'SREF Seed Vault',
      description: 'Midjourney v6 Style Reference Seed # Catalog with image examples and tags',
      image: '/path/to/sref-seed-vault/screenshot.jpg',
      link: 'https://github.com/user/sref-seed-vault',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12 card-container-projects">
      {projects.map((project, index) => (
        <Card key={index} className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <img src={project.image} alt={project.title} className="w-full h-48 object-cover mb-4 rounded-t-lg" />
          <div className="p-4">
            <h2 className="text-2xl font-semibold mb-2">{project.title}</h2>
            <p className="mb-4">{project.description}</p>
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Project</a>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Projects;
