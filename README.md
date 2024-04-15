# Akeru.ai

Akeru is an open source AI platform built on top of the Akeru AI edge network. The network runs as a Bittensor Subnet, providing a transparent, safe and highly avaialble AI capacities.

## For developers

Akeru's AI features are all available through an API that we are currentlt working on. We are aiming at full compatibility with OpenAI's assistant API and are working on the following features:

- Retrieval: Enables the system to retrieve information or files to enhance its responses.
- Function Calling: Allows the system to call external functions or APIs to perform specific tasks.
- Conversation Management: Manages conversations between users and the system, organizing messages into threads and runs to facilitate interactions.
- Custom Instructions: Users can define custom instructions for the system, specifying its purpose, model, and tools to tailor its functionality.
- Data Input Optimization: Ensures the quality and relevance of data input for accurate and efficient responses.
- User Privacy: Implements robust data privacy protocols to protect user information and comply with relevant data protection laws.
- Testing and Iteration: Involves regularly testing the system in real-world scenarios and iterating based on feedback to improve performance and user experience.
- Comprehensive Documentation: Provides clear documentation on using the system to help users understand its functionalities and limitations.

## Bittensor Subnet design

Akeru's mission is to open AI technologies to everybody. At the core of this mission, we run our services on a fleet of Bittensor validators and miners. The subnet is open for everybody to participate in and offer their compute.

The subnet rewards miners in the following ways:

1. A dynamic supply and demand model rewards miners for offering highly popular Models
1. Validators select highly available and performing miners that are the closest to a request
1. Miners reputation is verified using a ZK watermarking and benchmarking system.

## API Architecture

The Akeru API is the entry point for any developers wanting to build over akeru.ai, the API is being built in compliance with popular providers like langchain and Vercel AI.

## Self hosting

Self hosting is planned for the API and UI. To self host validators and miners, see the next section.

## Validating and Mining

The subnet is in active development, guides will come for those topics

## Contributing requirements

TODO
