# Trainer Site Shopping Cart
Newest code in develop branch. Node server runs on port 3000, React client runs on 3001.
The server code relies on the NODE_ENV environment variable. In order to have it read the value locally as "development", either add `export NODE_ENV=development` to your `.zshrc` file (or whatever the Windows equivalent is) or add it to the server `.env` file in the project. If you add it directly to the project, make sure you don't have the `export` statement in your .zshrc (or windows equivalent) file.
