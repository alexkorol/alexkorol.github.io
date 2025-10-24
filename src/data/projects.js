const projects = [
  {
    id: 'repo2gpt',
    title: 'Repo2GPT',
    description:
      'Python script to summarize local and GitHub projects into a doc form usable for LLM-assisted programming and code review. This tool streamlines the process of converting repository contents into a format that can be easily processed by language models, enhancing the efficiency of AI-assisted development and code analysis.',
    image: '/images/projects/repo2gpt.png',
    link: 'https://github.com/alexkorol/repo2GPT',
    challenge:
      'Manual context gathering for large codebases was too slow to keep up with fast-paced client requests and pair-programming sessions with generative AI tools.',
    approach:
      'Built a configurable Python CLI that walks repositories, prioritises important files, and produces structured narrative briefs optimised for language models. Added heuristics for ignoring build artefacts, collapsing vendor folders, and highlighting project entry points.',
    impact:
      'Cut the preparation time for AI-assisted reviews from hours to minutes and enabled repeatable documentation updates for frequently changing repositories.',
    stack: ['Python', 'Typer', 'GitPython', 'OpenAI API'],
  },
  {
    id: 'sref-seed-vault',
    title: 'SREF Seed Vault',
    description:
      'Midjourney v6 Style Reference Seed # Catalog with image examples and tags. This project provides a comprehensive collection of style references for Midjourney v6, allowing users to explore various artistic styles and their corresponding seed numbers. It serves as a valuable resource for AI art enthusiasts and creators.',
    image: '/images/projects/seedvault.png',
    link: 'https://alexkorol.github.io/seedvault',
    githubRepo: 'https://github.com/alexkorol/seedvault',
    challenge:
      'Creative teams struggled to reproduce Midjourney image prompts consistently because there was no browsable index of proven style seeds.',
    approach:
      'Curated a searchable gallery that pairs Midjourney seed numbers with rendered examples, descriptive tags, and usage notes. Implemented responsive cards so artists can scan styles quickly on desktop or mobile.',
    impact:
      'Improved prompt consistency for collaborators and boosted repeat usage of documented seeds by making experimentation data easy to access.',
    stack: ['React', 'JavaScript', 'CSS Grid', 'Netlify'],
  },
];

export default projects;
