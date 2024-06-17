const db = require('../models');
const Member = db.member;

async function getMember(req, res, next) {
    try {
        const memberId = req.params.id;
        const member = await Member.findById(memberId);
        res.status(200).json({ member: member });
    } catch (error) {
        next(error);
    }
}

async function getAllMembers (req, res, next) {
    try {
        const membersList = await Member.find();
        res.status(200).json({ membersList: membersList });
    } catch (error) {
        next(error);
    }
}

const addMember = async (req, res) => {
    const newMember = req.body

    Member.create(newMember, (err, member) => {
        if (err) {
            return res.status(400).json({ success: false, err });
        }

        return res.status(200).json({
            success: true,
            newMember: member
        });
    })
}

const updateMember = async (req, res) => {
    const memberId = req.params.id
    const updatedMember = req.body

    Member.findByIdAndUpdate(memberId,updatedMember, (err, member) => {
        if (err) {
            return res.status(400).json({ success: false, err });
        }

        return res.status(200).json({
            success: true,
            updatedMember: member
        });
    })
}

const deleteMember = async (req, res) => {
    const memberId = req.params.id

    Member.findByIdAndDelete(memberId, (err, member) => {
        if (err) {
            return res.status(400).json({ success: false, err });
        }

        return res.status(200).json({
            success: true,
            deletedMember: member
        });
    })
}

const memberController ={
    getMember,
    getAllMembers,
    addMember,
    updateMember,
    deleteMember
}

module.exports =memberController;