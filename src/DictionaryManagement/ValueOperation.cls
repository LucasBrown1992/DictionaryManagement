Class DictionaryManagement.ValueOperation
{

ClassMethod LookupTableValueOperation(pInput As DictionaryManagement.RequestMsg, Output pOutput As DictionaryManagement.ResposeMsg) As %Status
{
	Set pOutput=##Class(DictionaryManagement.ResposeMsg).%New()
	Set ResultClass=##Class(DictionaryManagement.JsonResult).%New()
	Set method=pInput.action
	
	
	
	try{ 
		IF method="list"{
			set status=..LookupTableValueList(pInput,.pOutput)
		}ELSEIF method="create"{
			set status=..LookupTableValueAdd(pInput,.pOutput)
		}ELSEIF method="update"{
			set status=..LookupTableValueUpdate(pInput,.pOutput)
		}ELSEIF method="delete"{
			set status=..LookupTableValueDelete(pInput,.pOutput)
		}ELSEIF method="detail"{
			set status=..LookupTableValueDetail(pInput,.pOutput)
		}ELSE{
			Set resultStr=ResultClass.FResult(method_" error")
			Set pOutput.ResultContent=resultStr
		}
		
	
	}catch(ex){
		Set resultStr=ResultClass.FResult(method_" error")
		Set pOutput.ResultContent=resultStr
	}
	Quit $$$OK
}

ClassMethod LookupTableValueList(pInput As DictionaryManagement.RequestMsg, Output pOutput As DictionaryManagement.ResposeMsg) As %Status
{
	
	Set pOutput=##Class(DictionaryManagement.ResposeMsg).%New()
	Set ResultClass=##Class(DictionaryManagement.JsonResult).%New()
	Set dynamicObject = ##class(%DynamicObject).%New()
	Set dynamicArray = ##class(%DynamicArray).%New()
	Set resultStr=""
	Set request = pInput.pArg.GetAt(1)
	#Dim json As %DynamicObject =##class(%DynamicObject).%FromJSON(request)
	Set dictId=json.%Get("dictId")
	Set keyword=json.%Get("keyword")
	Set Size=json.%Get("pageSize")					
	Set Page=json.%Get("page")
	Set start = Size*(Page-1)+1
	Set end = Size * Page
	
	set TableName=""
	&sql(select TableName into :TableName from DictionaryManagement.DictTable where ID=:dictId)
	if TableName=""{Set resultStr=ResultClass.FResult("Data does not exist.") Set pOutput.ResultContent=resultStr Quit $$$OK}
	
	Set select=" where TableName=?"
	if keyword'=""{
	   Set select = select_"and (KeyName like '%"_keyword_"%' or DataValue like '%"_keyword_"%')"
	}
	Set sqlStr="SELECT %VID as VID,* from (SELECT count(1) total,ID,DataValue, KeyName  FROM Ens_Util.LookupTable "_select_") WHERE %VID BETWEEN ? AND ?"
	#dim total AS %Integer=0
	Set statement = ##class(%SQL.Statement).%New()
	Set qStatus = statement.%Prepare(sqlStr)
	if qStatus'=1 {Set resultStr=ResultClass.FResult("") Set pOutput.ResultContent=resultStr Quit $$$OK}
	#dim rset As %SQL.StatementResult = statement.%Execute(TableName,start,end)
	    
	    
	while rset.%Next(){
		Set dynamicObj = ##class(%DynamicObject).%New()
		Do dynamicObj.%Set("id",rset.%Get("ID"))
		Do dynamicObj.%Set("dictId",dictId)
		Do dynamicObj.%Set("code",rset.%Get("KeyName"))
		Do dynamicObj.%Set("value",rset.%Get("DataValue"))
		Do dynamicArray.%Push(dynamicObj)
		set total=rset.%Get("total")
	}

    Set paginationObject = ##class(%DynamicObject).%New()
	Do paginationObject.%Set("total",total)
	Do paginationObject.%Set("page",Page)
	Do paginationObject.%Set("pageSize",Size)
	set totalPages=total/Size
	if totalPages["."{
		set totalPages=$p(totalPages,".")+1
	}
	Do paginationObject.%Set("totalPages",totalPages)
	
	Do dynamicObject.%Set("list",dynamicArray)
	Do dynamicObject.%Set("pagination",paginationObject)
	
    Set resultStr=ResultClass.QueryTResult(dynamicObject) 
	Set pOutput.ResultContent=resultStr
	
	Quit $$$OK
}

ClassMethod LookupTableValueAdd(pInput As DictionaryManagement.RequestMsg, Output pOutput As DictionaryManagement.ResposeMsg) As %Status
{
	
	Set pOutput=##Class(DictionaryManagement.ResposeMsg).%New()
	Set ResultClass=##Class(DictionaryManagement.JsonResult).%New()
	Set dynamicObject = ##class(%DynamicObject).%New()
	Set dynamicArray = ##class(%DynamicArray).%New()
	Set resultStr=""
 
	Set request = pInput.pArg.GetAt(1)
	#Dim json As %DynamicObject =##class(%DynamicObject).%FromJSON(request)
	Set dictId=json.%Get("dictId")
	Set Key=json.%Get("code")
	Set Value=json.%Get("value")
	set TableName=""
	&sql(select TableName into :TableName from DictionaryManagement.DictTable where ID=:dictId)
	if TableName=""{Set resultStr=ResultClass.FResult("Data does not exist.") Set pOutput.ResultContent=resultStr Quit $$$OK}
	Set number=0
	&sql(select count(1) into :number from Ens_Util.LookupTable where TableName=:TableName and KeyName=:Key)
	if number>0{Set resultStr=ResultClass.FResult("Duplicate primary key") Set pOutput.ResultContent=resultStr Quit $$$OK}
	Set ^Ens.LookupTable(TableName,Key)=Value	
	Set resultStr=ResultClass.OperationTResult("")

	Set pOutput.ResultContent=resultStr
	Quit $$$OK
}

ClassMethod LookupTableValueUpdate(pInput As DictionaryManagement.RequestMsg, Output pOutput As DictionaryManagement.ResposeMsg) As %Status
{
	
	Set pOutput=##Class(DictionaryManagement.ResposeMsg).%New()
	Set ResultClass=##Class(DictionaryManagement.JsonResult).%New()
	Set dynamicObject = ##class(%DynamicObject).%New()
	Set dynamicArray = ##class(%DynamicArray).%New()
	Set resultStr=""

	Set request = pInput.pArg.GetAt(1)
	#Dim json As %DynamicObject =##class(%DynamicObject).%FromJSON(request)
	Set ID=json.%Get("id")
	Set Key=json.%Get("code")
	Set Value=json.%Get("value")
    Set TableName=$p(ID,"||")
	
	Set number=0,oldKey=""
	&sql(select count(1),KeyName into :number,:oldKey from Ens_Util.LookupTable where ID=:ID)
	if number=0{Set resultStr=ResultClass.FResult("Data does not exist.") Set pOutput.ResultContent=resultStr Quit $$$OK}
	
	kill ^Ens.LookupTable(TableName,oldKey)
	Set ^Ens.LookupTable(TableName,Key)=Value
	
	Set resultStr=ResultClass.OperationTResult("")

	Set pOutput.ResultContent=resultStr
	Quit $$$OK
}

ClassMethod LookupTableValueDelete(pInput As DictionaryManagement.RequestMsg, Output pOutput As DictionaryManagement.ResposeMsg) As %Status
{
	
	Set pOutput=##Class(DictionaryManagement.ResposeMsg).%New()
	Set ResultClass=##Class(DictionaryManagement.JsonResult).%New()
	Set dynamicObject = ##class(%DynamicObject).%New()
	Set dynamicArray = ##class(%DynamicArray).%New()
	Set resultStr=""

	Set request = pInput.pArg.GetAt(1)
	#Dim json As %DynamicObject =##class(%DynamicObject).%FromJSON(request)
	Set ID=json.%Get("id")
	
	Set number=0
	&sql(select count(1) into :number from Ens_Util.LookupTable where ID=:ID)
	if number=0{Set resultStr=ResultClass.FResult("Data does not exist.") Set pOutput.ResultContent=resultStr Quit $$$OK}
	
    Kill ^Ens.LookupTable($p(ID,"||",1),$p(ID,"||",2))
	Set resultStr=ResultClass.OperationTResult("")

	
	Set pOutput.ResultContent=resultStr
	Quit $$$OK
}

ClassMethod LookupTableValueDetail(pInput As DictionaryManagement.RequestMsg, Output pOutput As DictionaryManagement.ResposeMsg) As %Status
{
	Set pOutput=##Class(DictionaryManagement.ResposeMsg).%New()
	Set ResultClass=##Class(DictionaryManagement.JsonResult).%New()
	Set dynamicObject = ##class(%DynamicObject).%New()

	Set dynamicArray = ##class(%DynamicArray).%New()
	Set resultStr=""
		
	Set request = pInput.pArg.GetAt(1)
	#Dim json As %DynamicObject =##class(%DynamicObject).%FromJSON(request)
	Set ID=json.%Get("id")


	
	Set sqlStr="SELECT KeyName,DataValue FROM Ens_Util.LookupTable where ID=?"
	Set statement = ##class(%SQL.Statement).%New()
	Set qStatus = statement.%Prepare(sqlStr)
	if qStatus'=1 {Set resultStr=ResultClass.FResult("error") Quit $$$OK}
	#dim rset As %SQL.StatementResult = statement.%Execute(ID)
	#dim total AS %Integer=0
	while rset.%Next(){
		Set dynamicObj = ##class(%DynamicObject).%New()
		Do dynamicObj.%Set("code",rset.%Get("KeyName"))
		Do dynamicObj.%Set("value",rset.%Get("DataValue"))
		set dynamicObject= dynamicObj
	}
    Set resultStr=ResultClass.QueryTResult(dynamicObject) 
	Set pOutput.ResultContent=resultStr
	
	
	Quit $$$OK
}

}

