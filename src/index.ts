import dotenv from 'dotenv'
import {app} from "./settings";
import {blogRoute} from "./routes/blog-route";
import {postRoute} from "./routes/post-route";
import {BlogType} from "./types/blog/output";
import {PostType} from "./types/post/output";
import {testingRouter} from "./testing-router";
import {MongoClient} from "mongodb";
import {authRouter} from "./routes/auth-route";
import {usersRouter} from "./routes/users-route";
import {commentsRoute} from "./routes/comments-route";
import {emailRouter} from "./routes/email-router";
import { Request, Response } from 'express';

// app.use('/testing',testingRouter)

dotenv.config()
const mongoURI = process.env.MONGO_URL || 'mongodb://localhost:27017'
console.log(mongoURI,'mongoURI')

const client = new MongoClient(mongoURI);

async function runDb() {
    try {
        await client.connect()
    } catch (e) {
        await client.close()
    }
}

const port = process.env.PORT || 5001

app.use('/blogs', blogRoute)
app.use('/posts', postRoute)
app.use('/testing', testingRouter)
app.use('/auth', authRouter)
app.use('/users', usersRouter)
app.use('/comments', commentsRoute)
app.use('/', emailRouter)

const dbBlogs = client.db('node-blogs')

const blogCollection = dbBlogs.collection<BlogType>('blogs')
const postCollection = dbBlogs.collection<PostType>('post')
const commentsCollection = dbBlogs.collection('comments')
const usersCollection = dbBlogs.collection<any>('users')

export default async function handler(req: Request, res: Response) {
    await runDb()
    return app(req, res)
}

export { blogCollection, postCollection, commentsCollection, usersCollection }
