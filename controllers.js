const User = require('./models.js');
const sha256 = require('sha256');

const toTableData = allData => {
    return allData.map(i=>({
        name: i.name, 
        email: i.email,
        status: i.status,
        registrationDate: i.registrationDate,
        lastLoginDate: i.lastLoginDate,
        id: i.id,
    }))
}

const getStandartResponse = async (email, password) =>{
    const allData = await User.find();
    const currUser = allData.find(i=>i.email===email);
    const resp = {status: 'not-found', allData: []};
    if (currUser && currUser.password === sha256(password)){
        resp.status = currUser.status;
        if (resp.status === 'active') {
            currUser.lastLoginDate = new Date();
            currUser.save();
            resp.allData = allData;
        }
    }
    return resp;
}

const validateEmail = async email => {
    const unique = !(await User.findOne({email}));
    if(email.includes('@') && unique){
        return true;
    }
}

const regFailMsg = {
    result: 'fail', 
    message: 'user with this email is already exists',
};

class UserController{
    async createUser(req, res){
        try {
            const userData = req.body;
            userData.password = sha256(userData.password);
            const success = await validateEmail(userData.email);
            if (!success){
                res.json(regFailMsg);
                return
            }
            const allData = await User.find();
            const lastId = allData.reduce((accum, i)=>{
                return (i.id > accum)? i.id : accum
            }, 0)
            const user = await User.create({
                ...userData,
                id: lastId+1,
                registrationDate: new Date(),
                lastLoginDate: new Date(),
                status: 'active'
            });
            user.save();
            const tableData = toTableData([...allData, user]);
            res.json({result: 'success', tableData});
        } catch (e) {
            console.log(e);
        }
    }

    async getAllUsers(req, res){
        try{
            const {email, password} = req.params;
            const {allData, status} = await getStandartResponse(email, password);
            const tableData = toTableData(allData);
            res.json({status, tableData});
        } catch (e) {
            console.log(e);
        }
    }

    async changeStatus(req, res){
        try{
            const { email, password } = req.params;
            const { ids, changeTo } = req.body;
            const { allData, status } = await getStandartResponse(email, password);
            if (status !== 'active'){
                res.json({tableData: [], status});
                return
            }
            ids.forEach(id=>{
                const user = allData.find(i=>i.id===id);
                user.status = changeTo;
                user.save();
            })
            const tableData = toTableData(allData);
            const newStatus = allData.find(i=>i.email===email).status;
            res.json({tableData, status: newStatus});
        } catch (e) {
            console.log(e);
        }
    }

    async deleteUsers(req, res){
        try{
            const { email, password } = req.params;
            const user = await User.findOne({
                email, 
                password: sha256(password)
            });
            if (user?.status!=='active'){
                res.json({
                    status: user?.status || 'not-found', 
                    tableData: [],
                });
                return
            }
            const { ids } = req.body;
            await User.deleteMany({id: ids});
            const allData = await User.find();
            const userUpdated = allData.find(i=>i.id===user.id);
            const status = userUpdated?.status || 'not-found';
            res.json({status, tableData: toTableData(allData)});
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new UserController()
