const express = require('express');
const { insertTicket, getTickets, getTicketById, updateClientReply, updateStatusClose, deleteTicket } = require('../model/ticket/ticket.model');
const router = express.Router()
const { authGaurd } = require('../middleware/auth');
const { createNewTicketValidation, replyTicketMessageValidation } = require('../middleware/formValidation');

router.all((req, res, next) => {
    res.send({
        msg: "ticket router"
    })
})

router.post(
    "/", authGaurd,
    createNewTicketValidation,
    async (req, res) => {
        try {
            const { subject, sender, message } = req.body;

            const userId = req.headers.userId;

            const ticketObj = {
                clientId: userId,
                subject,
                conversations: [
                    {
                        sender,
                        message,
                    },
                ],
            };

            const result = await insertTicket(ticketObj);

            if (result._id) {
                return res.json({
                    status: "success",
                    message: "New ticket has been created!",
                });
            }

            res.json({
                status: "error",
                message: "Unable to create the ticket , please try again later",
            });
        } catch (error) {
            res.json({ status: "error", message: error.message });
        }
    }
);

router.get("/", authGaurd, async (req, res) => {
    try {
        const userId = req.headers.userId;
        const result = await getTickets(userId);

        return res.json({
            status: "success",
            result,
        });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

router.get("/:_id", authGaurd, async (req, res) => {
    try {
        const { _id } = req.params;

        const clientId = req.headers.userId;
        const result = await getTicketById(_id, clientId);

        return res.json({
            status: "success",
            result,
        });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});


router.put(
    "/:_id",
    authGaurd,
    replyTicketMessageValidation,
    async (req, res) => {
        try {
            const { message, sender } = req.body;
            const { _id } = req.params;
            const clientId = req.headers.userId;

            const result = await updateClientReply({ _id, message, sender });

            if (result._id) {
                return res.json({
                    status: "success",
                    message: "your message updated",
                });
            }
            res.json({
                status: "error",
                message: "Unable to update your message please try again later",
            });
        } catch (error) {
            res.json({ status: "error", message: error.message });
        }
    }
);

router.patch("/close-ticket/:_id", authGaurd, async (req, res) => {
    try {
      const { _id } = req.params;
      const clientId = req.headers.userId;
  
      const result = await updateStatusClose({ _id, clientId });
  
      if (result._id) {
        return res.json({
          status: "success",
          message: "The ticket has been closed",
        });
      }
      res.json({
        status: "error",
        message: "Unable to update the ticket",
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  });
  
  // Delete a ticket
  router.delete("/:_id", authGaurd, async (req, res) => {
    try {
      const { _id } = req.params;
      const clientId = req.headers.userId;
  
      const result = await deleteTicket({ _id, clientId });
  
      return res.json({
        status: "success",
        message: "The ticket has been deleted",
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  });

module.exports = router