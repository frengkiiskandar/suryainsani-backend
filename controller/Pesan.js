import pesan from "../models/PesanModels.js";

export const getPesan =async(req,res)=>{
    try {
        const response = await pesan.findAll()
        if(response.length ===0) return res.status(404).json({msg:"pesan kosong"})
        res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:"terjadi kesalahan pada server"})
    }
}

export const createPesan = async(req, res)=>{
    const {nama, email, telp, subjek, message} = req.body
    try {

        const findUser = await pesan.findOne({
            where :{
                email, telp
            }
        })
        if(findUser) return res.status(400).json({msg:"pesan sudah pernah dikirim, edit untuk mengirim ulang ?"})
        const response = await pesan.create({
            nama,email,telp, subjek, pesan : message
        })
        res.status(201).json({msg:"pesan berhasil dikirim"})
    } catch (error) {
         console.log(error);
        return res.status(500).json({msg:"terjadi kesalahan pada server"})
    }
}