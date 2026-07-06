import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const port = 3000;

const password = process.env.dbPassword;

const db = new pg.Client({
	user: "postgres",
	host: "localhost",
	database: "Booknotes",
	password: password,
	port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// let books = [{
//     title: "Harry Potter and the Philosopher's Stone",
//     seriesName: 'Harry Potter',
//     author: 'J. K. Rowling',
//     isbnID: 'No isbnID',
//     coverId: 15155833
// }]

async function getAllBooks(){
	try{
		const result = await db.query("SELECT * FROM books order by ID ASC")
		let books = result.rows
		books.forEach(book =>{
		book.date_read = book.date_read.toLocaleDateString("en-GB");
		});
		return books
	} catch (err){
		console.log(err)
		return []
	}
}

async function getBook(book){
	try{
	const result = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(book)}`)
	const data = result.data;
	const firstDataIndex = data.docs[0]
	console.log(data.docs[0])

	return {
		title: firstDataIndex.title,
		seriesName: firstDataIndex.series_name?.[0] || "Series Unknown",
		author: firstDataIndex.author_name?.[0] || "Author Unknown",
		isbnID: firstDataIndex.isbn || "No isbnID",
		coverId: firstDataIndex.cover_i,
	}

	} catch (err){
	console.log(err)
	};
}


app.get("/", async (req, res) =>{
	const books = await getAllBooks()
	console.log(books)
		res.render("index.ejs", {
			books : books,
		})
})

app.post("/book", async (req, res) =>{
	try{
		const bookTitle = req.body.title
		const date = req.body.dateread || new Date();
		const rating = req.body.rating
		const review = req.body.review

		const book = await getBook(bookTitle)

	if (!book){
		console.log("Book not found")
		return res.redirect("/")
	}

	await db.query("INSERT INTO books (author, title, series_name, cover_id, date_read, rating, review) VALUES ($1, $2, $3, $4, $5, $6, $7)",
		[book.author, book.title, book.seriesName, book.coverId, date, rating, review]);

	console.log("Book inserted:", book);
	res.redirect("/")
	} catch (err){
		console.log(err)
	}
});

app.get("/new", async (req, res) =>{
	res.render("book-form.ejs")
})

app.get("/edit/:id", async (req, res) =>{
	const bookId = req.params.id
	const result = await db.query("SELECT * FROM books WHERE id = $1",[bookId])
	const book = result.rows[0]
	console.log(book)

	res.render("book-form.ejs", {
		book: book,
	})
})

app.post("/edit", async (req, res) => {
	console.log(req.body)
	const bookId = req.body.updateItemId
	const {title, review, rating ,} = req.body;
	const dateread = req.body.dateread || new Date();

	await db.query("UPDATE books SET title = $1, review = $2, rating = $3, date_read = $4 where id = $5",
		[title,review,rating,dateread,bookId]
	)

	res.redirect("/")
})


app.post("/delete", async (req, res) => {
	console.log(req.body)
	const id = req.body.deleteItemId

	await db.query("DELETE FROM books WHERE id = $1",[id])
	console.log("Deleted book succesfully")

	res.redirect("/")
})

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});