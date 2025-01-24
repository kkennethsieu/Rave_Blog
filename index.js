import express from "express"
import bodyParser from "body-parser"
import multer from "multer"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path'
import methodOverride from "method-override";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 3000

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended:true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'))
let submissions = [
    {id: "1", author:"Kenneth Sieu",title:"Kinetic Field EDC 2023", story:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",file:"images/blog_1.jpg",date: new Date().toLocaleString("en-US")},
    {id: "2", author:"Kenneth Sieu",title:"Northcoast Fest EDC 2022", story:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",file:"images/blog_2.jpg",date: new Date().toLocaleString("en-US")},
    {id: "3", author:"Kenneth Sieu",title:"Ultra Miami 2025", story:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",file:"images/blog_3.jpg",date: new Date().toLocaleString("en-US")},
    {id: '4', author:"Kenneth Sieu",title:"Kinetic Field 2023", story:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",file:"images/blog_4.jpeg",date: new Date().toLocaleString("en-US")},
    {id: '5', author:"Kenneth Sieu",title:"Northcoast Fest EDC 2022", story:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",file:"images/blog_5.jpg",date: new Date().toLocaleString("en-US")},
    {id: '6', author:"Kenneth Sieu",title:"Ultra Miami 2025", story:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",file:"images/blog_6.jpg",date: new Date().toLocaleString("en-US")},
]

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        const uploadPath = path.join(__dirname, 'public/uploads');
        console.log("Saving file to:", uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        console.log("Generated filename:", uniqueName); 
        cb(null, uniqueName);
    }
});

const upload = multer({storage})

app.get("/", (req,res)=>{
    res.render("index.ejs" ,{ submissions })
})


app.get("/create", (req,res)=>{
    res.render("create.ejs")
})

app.get("/edit/:id", (req, res) => {
    const submissionId = req.params.id;
    const submission = submissions.find(sub => sub.id === submissionId);    
    
    if (submission) {
        res.render("edit.ejs", { submission });
    } else {
        res.status(404).send("Submission not found.");
    }
});



app.post("/submit",upload.single('image'),(req,res,next)=>{
    if (req.file) {
        console.log("File uploaded to:", req.file.path);
    } else {
        console.log("No file uploaded");
    }
    const data = {
        id: Date.now().toString(),
        author: req.body["name"],
        title: req.body["title"],
        story: req.body["story"],
        file: req.file ? `/uploads/${req.file.filename}` : null,
        date: new Date().toLocaleString("en-US", { 
            year: "numeric", 
            month: "long", 
            day: "numeric", 
            hour: "2-digit", 
            minute: "2-digit" 
        })
    }
    submissions.push(data)
    res.render("index.ejs",{ submissions })
})


app.post("/update/:id", upload.single('image'), (req, res) => {
    const submission = submissions.find(submission => submission.id === req.params.id);
    if (submission) {
        submission.author = req.body.name;
        submission.title = req.body.title;
        submission.story = req.body.story;

        if (req.file) {
            submission.file = `/uploads/${req.file.filename}`;
        }

        submission.date = new Date().toLocaleString("en-US", { 
            year: "numeric", 
            month: "long", 
            day: "numeric", 
            hour: "2-digit", 
            minute: "2-digit" 
        });

        res.redirect("/");
    } else {
        res.status(404).send("Submission not found.");
    }
});

app.post("/delete/:id", (req, res) => {
    const submissionId = req.params.id;
    submissions = submissions.filter(submission => submission.id !== submissionId);
    res.redirect("/");  
});



app.listen(port,()=>{
    console.log(`Server has started on port ${port}.`)
})

