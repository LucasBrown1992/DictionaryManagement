Class DictionaryManagement.JsonResult Extends %RegisteredObject
{

Method QueryTResult(pRequest As %RegisteredObject) As %String
{
	Set jsonObject = ##class(%DynamicObject).%New()
	Set jsonObject.code=200
	Set jsonObject.data=pRequest
	Set jsonObject=jsonObject.%Set("success",1,"boolean")
	Set jsonObject.msg=""
	Set pResponse=jsonObject.%ToJSON()
	Quit pResponse
}

Method OperationTResult(pRequest As %RegisteredObject) As %String
{
	Set jsonObject = ##class(%DynamicObject).%New()
	Set jsonObject.code=200
	Set jsonObject.data=pRequest
	Set jsonObject=jsonObject.%Set("success",1,"boolean")
	Set jsonObject.msg="Operation successful"
	Set pResponse=jsonObject.%ToJSON()
	Quit pResponse
}

Method FResult(pRequest As %RegisteredObject) As %String
{
	Set jsonObject = ##class(%DynamicObject).%New()
	Set jsonObject.code=500
	Set jsonObject.data=""
	Set jsonObject=jsonObject.%Set("success",0,"boolean")
	Set jsonObject.message=pRequest
	Set pResponse=jsonObject.%ToJSON()
	Quit pResponse
}

}

