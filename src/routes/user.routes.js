const express = require('express')
const { insertUser, deleteAllUsers, getUserByEmail, saveRefreshToken, getUserById, updatePassword } = require('../model/user/user.model')
const router = express.Router()
const { hashPassword, checkPass, createJWT, createRefreshJWT } = require('../helpers/helpersFun')
const { authGaurd } = require('../middleware/auth')
const { emailProcessor } = require('../helpers/email')
const { setPasswordRestPin, getPinByEmailPin, deletePin } = require('../model/resetPass/resetPass.model')
const { resetPassReqValidation, updatePassValidation } = require('../middleware/formValidation')
const { deleteKey } = require('../helpers/redis')

router.all('/', (req, res, next) => {

    res.send({
        msg: "user router"
    })
})

router.post('/signup', async (req, res, next) => {
    try {
        let { name, email, company, password, address } = req.body
        password = await hashPassword(password)
        await insertUser({ name, email, company, password, address })
        res.json({
            msg: "user insert successfully"
        })
    }
    catch (err) {
        next(err)
    }
})

router.delete('/deleteAll', async (req, res, next) => {
    try {
        await deleteAllUsers()
        res.json({
            msg: "all Users are deleted",
        })
    }
    catch (err) {
        next(err)
    }
})

router.post('/login', async (req, res, next) => {
    try {
        let { email, password } = req.body
        let error = null
        if (!email || !password) {
            error = new Error("email and password is required")
            error.status = 400
            throw error
        }
        let user = await getUserByEmail(email)
        console.log(user)
        if (!user || !user._id) {
            error = new Error("Invalid Email!")
            error.status = 400
            throw error
        }
        let passCmp = await checkPass(password, user.password)
        if (!passCmp) {
            error = new Error("Invalid Password!")
            error.status = 400
            throw error
        }
        let token = await createJWT({
            email,
            id: user._id
        })
        let refreshToken = await createRefreshJWT({
            email,
            id: user._id
        }, '30d')

        await saveRefreshToken(user._id, refreshToken)
        return res.send({
            msg: "Login Successfully!",
            token,
            refreshToken
        })

    }
    catch (err) {
        next(err)
    }
})

router.get('/details', authGaurd, async (req, res, next) => {
    try {
        console.log(req.headers)
        let user = await getUserById(req.headers.userId)
        res.json({
            user,
        })
    }
    catch (err) {
        next(err)
    }
})

router.post("/reset-password",resetPassReqValidation, async (req, res) => {
    const { email } = req.body;

    const user = await getUserByEmail(email);

    if (user && user._id) {
        /// crate// 2. create unique 6 digit pin
        const setPin = await setPasswordRestPin(email);
        await emailProcessor({
            email,
            pin: setPin.pin,
            type: "request-new-password",
        });
    }

    res.json({
        status: "success",
        message:
            "If the email is exist in our database, the password reset pin will be sent shortly.",
    });
});

router.patch("/reset-password", updatePassValidation, async (req, res) => {
    const { email, pin, newPassword } = req.body;

    const getPin = await getPinByEmailPin(email, pin);
    console.log(getPin)
    // 2. validate pin
    if (getPin?._id) {
        const dbDate = getPin.addedAt;
        const expiresIn = 1;

        let expDate = dbDate.setDate(dbDate.getDate() + expiresIn);

        const today = new Date();

        if (today > expDate) {
            return res.json({ status: "error", message: "Invalid or expired pin." });
        }

        // encrypt new password
        const hashedPass = await hashPassword(newPassword);

        const user = await updatePassword(email, hashedPass);

        if (user._id) {
            // send email notification
            await emailProcessor({ email, type: "update-password-success" });

            ////delete pin from db
            deletePin(email, pin);

            return res.json({
                status: "success",
                message: "Your password has been updated",
            });
        }
    }
    res.json({
        status: "error",
        message: "Unable to update your password. plz try again later",
    });
});

router.delete("/logout", authGaurd, async (req, res) => {
	const authorization = req.headers['auth-token'];
	//this data coming form database
	const _id = req.headers.userId;

	// 2. delete accessJWT from redis database
    deleteKey(authorization)

	// 3. delete refreshJWT from mongodb
	const result = await saveRefreshToken(_id, "");

	if (result?._id) {
		return res.json({ status: "success", message: "Loged out successfully" });
	}

	res.json({
		status: "error",
		message: "Unable to logg you out, plz try again later",
	});
});

module.exports = router