// 1. /login, поля які треба відрендерити в файлі hbs: firstName, lastName, email(унікальне поле), password, age, city
// просто зробити темплейт з цим усім і вводити свої дані які будуть пушитися в масив і редірект робити на сторінку з усіма юзерами /users і перевірка чи такий імейл не існує, якщо існує то редірект на еррор пейдж

// 2. /users просто сторінка з усіма юзерами, але можна по квері параметрам їх фільтрувати по age і city

// 3. /user/:id сторінка з інфою про одного юзера

// 4. зробити якщо не відпрацюють ендпоінти то на сторінку notFound редірект

const express = require('express');
const path = require('path');
const {engine} = require('express-handlebars');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'static')));
app.set('view engine', '.hbs');
app.engine('.hbs', engine({defaultLayout: false}));
app.set('views', path.join(__dirname, 'static'));


const users = [];
let error = '';


app.get('/login', (req, res) => {
    res.render('login')
});

app.get('/users',  ({query}, res) => {
    if(Object.keys(query).length){
        let filteredUsers = [...users];
        if (query.age) {
            filteredUsers = filteredUsers.filter(user => user.age === query.age);
        }
        if (query.city) {
            filteredUsers = filteredUsers.filter(user => user.city === query.city);
        }
        res.render('users', {users: filteredUsers});
        return;
    }
    res.render('users', {users})
});

app.get('/users/:userId', ({params}, res) => {
    const currentUser = users.find(user => user.id === +params.userId);
    if(!currentUser){
        error = 'Wrong user ID';
        res.render('error', {error});
        return
    }
    res.render('currentUser',  { currentUser });
})

app.get('/error', (req, res) => {
    res.render('error', {error});
})

app.post('/login', (req, res) => {
    const isEmailUnic = users.some(user => user.email === req.body.email);
    if (isEmailUnic) {
        error = 'User with this email already registered';
        res.redirect('/error');
        return;
    }
    users.push({...req.body, id: users.length ? users[users.length - 1].id + 1 : 1});
    res.redirect('/users');
});


app.use((req, res) => {
    res.render('notFound');
});

app.listen(5000, () => {
    console.log('Server has started');
});