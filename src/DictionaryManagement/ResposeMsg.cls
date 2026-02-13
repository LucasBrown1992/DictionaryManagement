Class DictionaryManagement.ResposeMsg Extends Ens.Response
{

Parameter XMLNAME = "RESPONSE";

Property ResultCode As %String(XMLNAME = "RESULT_CODE");

Property ResultDescribe As %String(MAXLEN = 512, XMLNAME = "RESULT_DESCRIBE");

Property ResultContent As %String(MAXLEN = "", XMLNAME = "RESULT_CONTENT");

Property ResultStream As %CSP.BinaryStream(XMLNAME = "RESULT_STREAM");

Storage Default
{
<Data name="ResposeMsgDefaultData">
<Subscript>"ResposeMsg"</Subscript>
<Value name="1">
<Value>ResultCode</Value>
</Value>
<Value name="2">
<Value>ResultDescribe</Value>
</Value>
<Value name="3">
<Value>ResultContent</Value>
</Value>
<Value name="4">
<Value>ResultStream</Value>
</Value>
</Data>
<DefaultData>ResposeMsgDefaultData</DefaultData>
<Type>%Storage.Persistent</Type>
}

}

