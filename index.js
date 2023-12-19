const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

let books = [
    {
        title: "Wide Sargasso Sea",
        author: "Jean Rhys",
        published: "October 1, 1966",
        id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
        genres: ["Classics", "Fiction", "Historical Fiction", "Literature", "Historical", "Feminism", "Literary Fiction" ]

    },
    {
        title: "Gravity's Rainbow",
        author: "Thomas Pynchon",
        published: "February 28, 1973",
        id: "b4a24dc8-126b-22d4-b713-624c7509cd4a",
        genres: ["Fiction", "Classics", "Science Fiction", "Literature", "Historical Fiction", "Novels", "American"]
    }
]

let authors = [
    {
        name: "Jean Rhys",
        id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
        born: "August 24, 1890"
    },
    {
        name: "Thomas Pynchon",
        id: "b4a24dc8-126b-22d4-b713-624c7509cd4a",
        born: "May 8, 1937"
    },
    {
        name: "Jerzy Kosinski", //Birthdate not available*
        id: "c2a58ba9-124c-23d5-a837-125a7746ba4d",
    }
]

//GraphQL schema that describes types
const typeDefs = ` 
    type Book {
        title: String!
        author: String!
        id: ID!
        published: String!
        genres: [String!]!
    }

    type Author {
        name: String!
        id: ID!
        bookCount: Int!
        born: String  #nullable
    }

    type Query {
        bookCount: Int!
        authorCount: Int!
        allBooks(author: String): [Book!]! #access optional author param with args.author
        allAuthors: [Author!]!
    }
` 

const resolvers = {
    Query: {
        bookCount: () => books.length,
        authorCount: () => authors.length,
        allBooks: (root, args) => {
            if (!args.author) {
                return books //if no author is specified in query, return all books
            }
            const filteredBooks = books.filter(book => book.author === args.author) //accessing author param here
            return filteredBooks
        },
        allAuthors: () => authors.map(author => ({
            ...author, //rest of author info (name)
            bookCount: books.filter(book => book.id === author.id).length
            //There could be two authors with same name,
            //Therefore, we check bookCount using unique IDs
        })),
    },
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

startStandaloneServer(server, {
    listen: { port: 4000 },
}).then(({ url }) => {
    console.log(`Server ready at ${url}`)
})