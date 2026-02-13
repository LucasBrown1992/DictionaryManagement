Class DictionaryManagement.TableOperation
{

ClassMethod LookupTableOperation(pInput As DictionaryManagement.RequestMsg, Output pOutput As DictionaryManagement.ResposeMsg) As %Status
{
	Set pOutput=##Class(DictionaryManagement.ResposeMsg).%New()
	Set ResultClass=##Class(DictionaryManagement.JsonResult).%New()
	Set method=pInput.action
	
	
	try{
		IF method="list"{
			set status=..LookupTableNameList(pInput,.pOutput)
		}ELSEIF method="create"{
			set status=..LookupTableAdd(pInput,.pOutput)
		}ELSEIF method="update"{
			set status=..LookupTableUpdate(pInput,.pOutput)
		}ELSEIF method="delete"{
			set status=..LookupTableDelete(pInput,.pOutput)
		}ELSEIF method="detail"{
			set status=..LookupTableDetail(pInput,.pOutput)
		}
		
	}catch(ex){
		Set resultStr=ResultClass.FResult(method_" error:"_ex.DisplayString())
		Set pOutput.ResultContent=resultStr
	}
	Quit $$$OK
}

ClassMethod LookupTableNameList(pInput As DictionaryManagement.RequestMsg, Output pOutput As DictionaryManagement.ResposeMsg) As %Status
{
	
	
	Set pOutput=##Class(DictionaryManagement.ResposeMsg).%New()
	Set ResultClass=##Class(DictionaryManagement.JsonResult).%New()
	Set dynamicObject = ##class(%DynamicObject).%New()
	Set dynamicArray = ##class(%DynamicArray).%New()
	Set resultStr=""
		
	Set request = pInput.pArg.GetAt(1)
	#Dim json As %DynamicObject =##class(%DynamicObject).%FromJSON(request)
	Set TableName=json.%Get("keyword")
	Set Size=json.%Get("pageSize")					
	Set Page=json.%Get("page")
	Set start = Size*(Page-1)+1
	Set end = Size * Page
	
	set select=""
	if TableName'=""{set select=select_" and TableName like '%"_TableName_"%'"}
	Set sqlStr="SELECT %VID as VID,* from (SELECT count(1) total,ID,TableName,Remark  FROM DictionaryManagement.DictTable where 1=1"_select_") WHERE %VID BETWEEN ? AND ?"
	Set statement = ##class(%SQL.Statement).%New()
	Set qStatus = statement.%Prepare(sqlStr)
	if qStatus'=1 {Set resultStr=ResultClass.FResult("insert error") Quit $$$OK}
	#dim rset As %SQL.StatementResult = statement.%Execute(start,end)
	#dim total AS %Integer=0
	while rset.%Next(){
		Set dynamicObj = ##class(%DynamicObject).%New()
		Do dynamicObj.%Set("id",rset.%Get("ID"))
		Do dynamicObj.%Set("name",rset.%Get("TableName"))
		Do dynamicObj.%Set("remark",rset.%Get("Remark"))
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

ClassMethod LookupTableAdd(pInput As DictionaryManagement.RequestMsg, Output pOutput As DictionaryManagement.ResposeMsg) As %Status
{
	
	Set pOutput=##Class(DictionaryManagement.ResposeMsg).%New()
	Set ResultClass=##Class(DictionaryManagement.JsonResult).%New()
	Set dynamicObject = ##class(%DynamicObject).%New()
	Set dynamicArray = ##class(%DynamicArray).%New()
	Set resultStr=""

	Set request = pInput.pArg.GetAt(1)
	#Dim json As %DynamicObject =##class(%DynamicObject).%FromJSON(request)
	Set TableName=json.%Get("name")
	Set Remark=json.%Get("remark")
	if TableName=""{Set resultStr=ResultClass.FResult("The name cannot be empty.") Set pOutput.ResultContent=resultStr Quit $$$OK}
	Set number=0
	&sql(select count(1) into :number from DictionaryManagement.DictTable where TableName=:TableName)
	if number>0{Set resultStr=ResultClass.FResult("Name duplication") Set pOutput.ResultContent=resultStr Quit $$$OK}
	set CreateTime=$zdt($h,3)
	set ModifyTime=$zdt($h,3)
	Set sqlStr="insert into DictionaryManagement.DictTable (TableName,Remark,CreateTime,ModifyTime) values (?,?,?,?)"
	Set statement = ##class(%SQL.Statement).%New()
	Set qStatus = statement.%Prepare(sqlStr)
	if qStatus'=1 {Set resultStr=ResultClass.FResult("insert error") Set pOutput.ResultContent=resultStr Quit $$$OK}
    #dim rset As %SQL.StatementResult = statement.%Execute(TableName,Remark,CreateTime,ModifyTime)
    
    set ^Ens.LookupTable(TableName)=""
    
  	Set resultStr=ResultClass.OperationTResult("")
	Set pOutput.ResultContent=resultStr
	Quit $$$OK
}

ClassMethod LookupTableUpdate(pInput As DictionaryManagement.RequestMsg, Output pOutput As DictionaryManagement.ResposeMsg) As %Status
{
	
	Set pOutput=##Class(DictionaryManagement.ResposeMsg).%New()
	Set ResultClass=##Class(DictionaryManagement.JsonResult).%New()
	Set dynamicObject = ##class(%DynamicObject).%New()
	Set dynamicArray = ##class(%DynamicArray).%New()
	Set resultStr=""

	
	Set request = pInput.pArg.GetAt(1)
	#Dim json As %DynamicObject =##class(%DynamicObject).%FromJSON(request)
	Set ID=json.%Get("id")
	Set TableName=json.%Get("name")
	Set Remark=json.%Get("remark")
	if TableName=""{Set resultStr=ResultClass.FResult("The name cannot be empty.") Set pOutput.ResultContent=resultStr Quit $$$OK}
	Set number=0,OldRemark=""
	&sql(select count(1),TableName into :number,:oldTableName from DictionaryManagement.DictTable where ID=:ID)
	if number=0{Set resultStr=ResultClass.FResult("Data does not exist.") Set pOutput.ResultContent=resultStr Quit $$$OK}
	set ModifyTime=$zdt($h,3)
	Set sqlStr="update DictionaryManagement.DictTable set TableName=?,Remark=?,ModifyTime=? where ID=?"
	Set statement = ##class(%SQL.Statement).%New()
	Set qStatus = statement.%Prepare(sqlStr)
	if qStatus'=1 {Set resultStr=ResultClass.FResult("update error") Set pOutput.ResultContent=resultStr Quit $$$OK}
    #dim rset As %SQL.StatementResult = statement.%Execute(TableName,Remark,ModifyTime,ID)
    if oldTableName'=TableName{
		set oldkey="",flag=1
		while(flag){
        	Set nextkey=$o(^Ens.LookupTable(oldTableName,oldkey))
        	if (""'=nextkey){
	        	set value= ^Ens.LookupTable(oldTableName,nextkey)
        		set ^Ens.LookupTable(TableName,nextkey)=value
        	}else{
	        	set flag=0
        	}
        	set oldkey=nextkey
    	}
    	
    	kill ^Ens.LookupTable(oldTableName)
    }
  	Set resultStr=ResultClass.OperationTResult("")
	Set pOutput.ResultContent=resultStr
	Quit $$$OK
}

ClassMethod LookupTableDelete(pInput As DictionaryManagement.RequestMsg, Output pOutput As DictionaryManagement.ResposeMsg) As %Status
{
	
	Set pOutput=##Class(DictionaryManagement.ResposeMsg).%New()
	Set ResultClass=##Class(DictionaryManagement.JsonResult).%New()
	Set dynamicObject = ##class(%DynamicObject).%New()
	Set dynamicArray = ##class(%DynamicArray).%New()

	
	Set request = pInput.pArg.GetAt(1)
	#Dim json As %DynamicObject =##class(%DynamicObject).%FromJSON(request)
	Set ID=json.%Get("id")
	Set number=0,TableName=""
	&sql(select count(1),TableName into :number,:TableName from DictionaryManagement.DictTable where ID=:ID)
	if number=0{Set resultStr=ResultClass.FResult("Data does not exist.") Set pOutput.ResultContent=resultStr Quit $$$OK}
	

	&sql(delete from DictionaryManagement.DictTable where ID=:ID)
  	kill ^Ens.LookupTable(TableName)

  	Set resultStr=ResultClass.OperationTResult("")
	Set pOutput.ResultContent=resultStr
	Quit $$$OK
}

ClassMethod LookupTableDetail(pInput As DictionaryManagement.RequestMsg, Output pOutput As DictionaryManagement.ResposeMsg) As %Status
{
	Set pOutput=##Class(DictionaryManagement.ResposeMsg).%New()
	Set ResultClass=##Class(DictionaryManagement.JsonResult).%New()
	Set dynamicObject = ##class(%DynamicObject).%New()

	Set dynamicArray = ##class(%DynamicArray).%New()
	Set resultStr=""
		
	Set request = pInput.pArg.GetAt(1)
	#Dim json As %DynamicObject =##class(%DynamicObject).%FromJSON(request)
	Set ID=json.%Get("id")


	
	Set sqlStr="SELECT TableName,Remark,CreateTime,ModifyTime FROM DictionaryManagement.DictTable where ID=?"
	Set statement = ##class(%SQL.Statement).%New()
	Set qStatus = statement.%Prepare(sqlStr)
	if qStatus'=1 {Set resultStr=ResultClass.FResult("error") Quit $$$OK}
	#dim rset As %SQL.StatementResult = statement.%Execute(ID)
	#dim total AS %Integer=0
	while rset.%Next(){
		Set dynamicObj = ##class(%DynamicObject).%New()
		Do dynamicObj.%Set("name",rset.%Get("TableName"))
		Do dynamicObj.%Set("remark",rset.%Get("Remark"))
		Do dynamicObj.%Set("ctime",rset.%Get("CreateTime"))
		Do dynamicObj.%Set("mtine",rset.%Get("ModifyTime"))
		set dynamicObject= dynamicObj
	}
	
    Set resultStr=ResultClass.QueryTResult(dynamicObject) 
	Set pOutput.ResultContent=resultStr
	
	
	Quit $$$OK
}

}

