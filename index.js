import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


async function getBook(book){
  try{
    const result = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(book)}`)
    const data = result.data;
    const firstDataIndex = data.docs[0]
    console.log(data.docs[0])

    return {
      title: firstDataIndex.title,
      seriesName: firstDataIndex.series_name?. [0] || "Series Unknown",
      author: firstDataIndex.author_name?.[0] || "Author Unknown",
      isbnID: firstDataIndex.isbn || "No isbnID",
      coverId: firstDataIndex.cover_i,
      
    }

  } catch (err){
    console.log(err)
  };
}

app.get("/", (req, res) =>{
    res.render("index.ejs",)
})

app.post("/book", async (req, res) =>{
  const book_title = req.body.title
  console.log(book_title)
  const book = await getBook(book_title)
  if (!book){
    console.log("Book not found")
    return res.redirect("/")
  }
  console.log(book)


  res.redirect("/")
})







app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
