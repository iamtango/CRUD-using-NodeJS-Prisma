express --no-view . OR npx express-generator

After installing Prisma create prisma folder in thet create schema.prisma file to define the schema of the DB
I have use the sqlite DB as provider
after that define the schema or models
npx prisma migrate dev to generate the migrations file

Here i use JWT token for generate the Token

### How to Start the application

- `npm run dev` It help to run the program
- `npx prisma init` it help to initialized the prisma in the project
- `npx prisma studio` it help to display the GUI for DB
- `npx prisma generate dev` it help to generate the migration file
- `npx prisma generate` Modifying Models and using prisma generate (adding more fields/columns)
