import { festServices } from "../services/fest.service.js";

const createFest = async (req, res) => {
  try {
    // const db = getDB();

  
    // const result = 
    const result = await festServices.insertFestIntoDB(req.body, res, req.user.email);
    /* ========================================
       13. RESPONSE
    ======================================== */

    // return res.status(201).json({
    //   success: true,

    //   message:
    //     "Fest created successfully",

    //   data: {
    //     ...fest,

    //     _id: result.insertedId,
    //   },
    // });
    res.status(201).send({
      success: true,
      message: "Fest created successfully",
      data: result
    })
  } catch (error) {
    console.error(
      "Create Fest Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Something went wrong while creating the fest",
    });
  }
};

const getFests = async(req, res) => {
try{
  const result = await festServices.getFestsFromDB();
  res.status(200).send(result)
}catch(err){
  res.status(500).send(err)
}
}

const getFestById = async(req, res) => {
try{
  // console.log('fest id:', req.params.id);
  const result = await festServices.getFestByIdFromDB(req.params.id);
  res.status(200).send(result)
}catch(err){
  res.status(500).send(err)
}
}

export const festControllers = {
  createFest,
  getFests,
  getFestById
};