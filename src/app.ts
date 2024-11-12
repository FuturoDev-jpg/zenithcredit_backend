import express, {Request, Response} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cadastroRoutes from './routes/cadastroRoutes'

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 3000
const DATABASE = process.env.DATABASE as string

app.use(cors())
app.use(express.json())
app.use('/api/cadastros', cadastroRoutes)

app.get('/', (req, res) => {
  res.json('Hello World!')
})

app.listen(PORT, () => console.log("Server rodando na porta 3000"))
mongoose.connect(DATABASE).then(() => console.log("Conectada na Database da Zenith Credit"))