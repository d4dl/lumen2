/*
 use KSI_Austin
 */
//Add a permission for somebody.
//DON'T FORGET TO use db
db.Person.insert({
    "_id": ObjectId("54c3f266c760e87742e5ef2d"),
    "Person": {
        "Email": "jdeford@gmail.com"
    },
    "Login": {
        "Password": "$1$s2zgbPjA$V/UWQhY/XrEUTEee3TM6C0",
        "Username": "jdeford@gmail.com",
        "SessionId": "vjh7o4je4t3and56bjsfaervb2",
        "Groups": [
            "admin"
        ]
    }
})

db.Person.insert({
    "_id": ObjectId("551d822dc760e8c22d90aecc"),
    "Person": {
        "Email": "ali@integrityacademy.org"
    },
    "Login": {
        "Password": "$6$rounds=5000$NtFrddLJgcA1wL7R$8LxIeWL81r93Jnii7anllSvlehZUN0i1xX2K7KWVXGs6nC4Yi0f88xtwzdYMGRuDtm5O3jBM4rJ8GIzvnQac20",
        "Username": "ali@integrityacademy.org",
        "Groups": [
            "admin"
        ]
    }
})

//Give admin privies
db.Person.update(
    { "_id": ObjectId("55833f78c760e841332922b6") },
    {
        $set: {
            "Login.Groups": [
                "admin"
            ]
        }
    }
)
//Give admin privies
db.Person.update(
    { "_id": ObjectId("55883fa6c760e8204dcf36df") },
    {
        $set: {
            "Login.Groups": [
                "admin"
            ]
        }
    }
)//Give admin privies


//Doesn't work yet but its close.
db.PermissionGroup.save({
    admin: {
        permissions: ["writeAll"]
    },
    superadmin: {
        children: ["admin"],
        permissions: ["createAll"]
    },
    user: {
        permissions: ["editOwnedApp"]
    },
    parent: {
        permissions: ["editOwnedApp", "editChildApp"]
    }
})

//It continues to amaze me how you delete the admin database from time to time.
//Stop doing that.  But, if you do it again here's how you fix it.
//1) edit mongodb.conf and remove security (the reference to the pem file)
//2) kill mongo process.  What a shame.
//3) start mongo again.
//4) Execute this:
use admin
db.createUser(
    {
        user: "quickmit",
        pwd: "XdAJfcQjCUGRPU2EZgCnwQc0fmG4lBToRDJFHN",
        roles: ["root"]
    }
)
//db.updateUser(
//"quickmit",
//{
//        pwd: "XdAJfcQjCUGRPU2EZgCnwQc0fmG4lBToRDJFHN",
//        roles: ["root"]
//    }
//)
//5) stop and restart mongo