const express = require("express");
const { verifyRefreshJwt, createJWT } = require("../helpers/helpersFun");
const router = express.Router();

const { getUserByEmail, getUserById } = require("../model/user/User.model");

//return refresh jwt
router.get("/", async (req, res, next) => {
    const authToken = req.headers['auth-token'];

    //TODO
    try {

        const decoded = await verifyRefreshJwt(authToken);
        if (decoded.id) {
            const userProf = await getUserById(decoded.id);

            if (userProf._id) {
                let tokenExp = userProf.refreshJWT.addedAt;
                const dBrefreshToken = userProf.refreshJWT.token;

                tokenExp = tokenExp.setDate(
                    tokenExp.getDate() + +process.env.JWT_REFRESH_SECRET_EXP_DAY
                );

                const today = new Date();

                if (dBrefreshToken !== authToken && tokenExp < today) {
                    return res.status(403).json({ message: "Forbidden" });
                }

                const accessJWT = await createJWT({
                   email: decoded.email,
                   id: decoded.id
                });

                return res.json({ status: "success", accessJWT });
            }
        }

        res.status(403).json({ message: "Forbidden" });
    }
    catch (Err) {
        next(Err)
    }
});

module.exports = router;