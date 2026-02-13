Class DictionaryManagement.Rest Extends %CSP.REST
{

Parameter HandleCorsRequest = "true";

XData UrlMap [ XMLNamespace = "http://urlmap" ]
{
<Routes>
  <Route Url="/dictionaries/:Method" Method="POST" Call="dictionaries"/> 
  <Route Url="/dictionary-contents/:Method" Method="POST" Call="dictionaryContents"/>  
</Routes>
}

ClassMethod Status() As %Status
{
    Quit $$$OK
}

ClassMethod dictionaries(Method As %String) As %Status
{
	Do %response.SetHeader("Content-Type", "application/json;charset=UTF8")
	try{
	    
	   Set Request=##class(DictionaryManagement.RequestMsg).%New()
		Do %response.SetHeader("Content-Type", "application/json;charset=UTF8")
		Set Request.action=Method
	    Set content=$zcvt(%request.Content.Read(),"I","UTF8")
	 	Set tSC=Request.pArg.Insert(content) 	   
		Set tSC1=##class(DictionaryManagement.TableOperation).LookupTableOperation(Request,.out)
	   	set message=out.ResultContent
    }catch(ex){
		Set message="{""code"":500,""data"":"""",""success"":0,""msg"":""Internal server error""}" 
	}
    w $zcvt(message,"O","UTF8")
    Quit $$$OK
}

ClassMethod dictionaryContents(Method As %String) As %Status
{
	try{
		Set Request=##class(DictionaryManagement.RequestMsg).%New()
		Do %response.SetHeader("Content-Type", "application/json;charset=UTF8")
		Set Request.action=Method
	    Set content=$zcvt(%request.Content.Read(),"I","UTF8")
	 	Set tSC=Request.pArg.Insert(content) 
		Set tSC1=##class(DictionaryManagement.ValueOperation).LookupTableValueOperation(Request,.out) 	
	   	set message=out.ResultContent
    }catch(ex){
		Set message="{""code"":500,""data"":"""",""success"":0,""msg"":""Internal server error""}" 
	}
    w $zcvt(message,"O","UTF8")
    Quit $$$OK
}

}

