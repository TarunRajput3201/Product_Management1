const productModel=require("../models/productModel")
const {uploadFile}=require("./awsController")
const { validateString,
     validateNumber, 
     validateRequest, 
     validateEmail, 
     validNumber, 
     regxName, 
     convertToArray, 
     isValidPincode, 
     validatePassword,
     imageExtValidator,
     validateObjectId} = require("../validator/validations")
const { findByIdAndUpdate } = require("../models/userModel")

let createProduct=async function(req,res){
try{let bodyData=req.body
    

if(validateRequest(bodyData)){return res.status(400).send({status:false,message:"please provide data in body"})}
let {title,description,price,currencyId,currencyFormat,isFreeShipping,style,availableSizes,installments,prductImage}=bodyData

if(!title){return res.status(400).send({status:false,message:"please provide title"})}

if(!description){return res.status(400).send({status:false,message:"please provide description"})}


if(!price){return res.status(400).send({status:false,message:"please provide the price"})}
if(!validNumber(price)|| !validNumber(price.toString())){return res.status(400).send({status:false,message:"price must be a number"})}

if("currencyId" in bodyData){
if(!validateString(currencyId)){ bodyData.currencyId="INR"}
if(currencyId!=="INR" && currencyId.trim().length!==0){return res.status(400).send({status:false,message:"please provide 'INR' as currencyId"})}
}
else{return res.status(400).send({status:false,message:"please provide currencyId"})}

if("currencyFormat" in bodyData){
if(!validateString(currencyFormat)){ bodyData.currencyFormat="₹"}
if(currencyFormat!=="₹" && currencyFormat.trim().length!==0){return res.status(400).send({status:false,message:"please provide '₹' as currencyFormat"})}
}
else{return res.status(400).send({status:false,message:"please provide currencyFormat"})}

if("installments" in bodyData){
if(!validateString(installments))(bodyData.installments=0)
if(!validNumber(installments)|| !validNumber(installments.toString())){return res.status(400).send({status:false,message:"installments must be a number"})}
}

if(!validateString(availableSizes)){return res.status(400).send({ status: false, message:  "please select atleast one from  ['S', 'XS', 'M', 'X', 'L', 'XXL', 'XL']"  })}  
        else{  let size = availableSizes.split(",").map(x => (x))
          let items=[]       
         let availableSize = ["S", "XS", "M", "X", "L", "XXL", "XL"]
         for(let i=0;i<size.length;i++){
            if(availableSize.includes(size[i])){
                items.push(size[i])
            }
            else{return res.status(400).send({ status: false, message:"please select from  ['S', 'XS', 'M', 'X', 'L', 'XXL', 'XL'] only"  }) }
         }
         bodyData.availableSizes = items
        }

        let product = req.files;
        if (product && product.length > 0) {
            if(!imageExtValidator(product[0].originalname)){return  res.status(400).send({status:false, message: "only image file is allowed" })}
            let uploadedFileURL = await uploadFile(product[0]);
            bodyData.productImage = uploadedFileURL
        } else {
            return res.status(400).send({ status: false, message: "please provide profile image " });
        }
        let isDuplicateTitle = await productModel.findOne({ title: title })
        if (isDuplicateTitle) { return res.status(400).send({ status: false, message: "this title already exists" }) }


      
        let createdData = await productModel.create(bodyData)
        res.status(201).send({ status: true, message: "user registered successfully", data: createdData })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })
}
}




const getProduct = async function(req,res){
    try{let {size,name,priceGreaterThan,priceLessThan,priceSort} = req.query

    let obj = {
              isDeleted:false,    
             };
        
    let pric = {}
    
    let obj1 = {}

if(size){
    if(!["S", "XS","M","X", "L","XXL", "XL"].includes(size)){return res.status(400).send({status:false,massege:"please provide size from [S, XS, M, X, L, XXL, XL] only"})}
    obj.availableSizes = size
}

if(name){
    obj.title = name
}

if(priceGreaterThan){
    pric.$gt=priceGreaterThan
    obj.price=pric
}
if(priceLessThan){
    pric.$lt=priceLessThan
    obj.price = pric
}

if(priceSort){
    if(!(priceSort == -1 || priceSort == 1)){return res.status(400).send({status:false,massege:"please provide sort value 1 or -1"})}
    obj1.price=priceSort
}
    
let products = await productModel.find(obj).sort(obj1)
if(products.length == 0){return res.status(400).send({status:false,massege:"No Products available"})}

   return res.status(200).send({status:true,message:"Success",data:products})
    }
    catch(err){
        console.log(err)
        return res.status(500).send({status:false,message:err.message})
    }
}


let getProductById=async function(req,res){
try{let productId=req.params.productId 
if(!validateObjectId(productId)){return res.status(400).send({ status: false, message:"please enter a valid objectId"})}
 let data=await productModel.findOne({_id:productId,isDeleted:false})
 if(!data){return res.status(404).send({ status: false, message:"No product with this productId or deleted"})}
 res.status(200).send({ status: true, data:data })}
 catch (err) {
    return res.status(500).send({ status: false, message: err.message })
}

}
let deleteProductById=async function(req,res){
    try{let productId=req.params.productId 
        if(!validateObjectId(productId)){return res.status(400).send({ status: false, message:"please enter a valid objectId"})}
         let data=await productModel.findOne({_id:productId,isDeleted:false})
         if(!data){return res.status(404).send({ status: false, message:"No product with this productId or deleted"})}
         
         let deletedData=await productModel.findOneAndUpdate({_id:productId},{$set:{isDeleted:true,deletedAt:new Date}})
         res.status(200).send({ status: true, message:"product deleted succesfully"})}
         catch (err) {
            return res.status(500).send({ status: false, message: err.message })
        }
        

}

module.exports={createProduct,getProduct,getProductById,deleteProductById}