db.studentlist.insertMany([
    {
    id: '1651629015660',
    firstName: 'Dominic - Student 1',
    lastName: 'Dayta',
    email: 'domdayta1@gmail.com',
    password: '$2b$10$/xlJJ7cQq3dyAlC1PUbP3uVM.YSx5ECsixwh7u/lvmfg10IMcabXO',
    treatment: false,
    superUser: false
    },
    {
    id: '1651629015661',
    firstName: 'Dominic - Student 2',
    lastName: 'Dayta',
    email: 'domdayta2@gmail.com',
    password: '$2b$10$/xlJJ7cQq3dyAlC1PUbP3uVM.YSx5ECsixwh7u/lvmfg10IMcabXO',
    treatment: true,
    superUser: false
    },
    {
    id: '1651629015662',
    firstName: 'Dominic - Teacher',
    lastName: 'Dayta',
    email: 'domdayta3@gmail.com',
    password: '$2b$10$/xlJJ7cQq3dyAlC1PUbP3uVM.YSx5ECsixwh7u/lvmfg10IMcabXO',
    treatment: false,
    superUser: true
    }
])

db.progress.insert({
    id: '1651629015660',
    lesson: 'pretest',
    dateCompleted: '1651629015660'
})