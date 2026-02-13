Class DictionaryManagement.RequestMsg Extends Ens.Request
{

Parameter XMLNAME = "REQUEST";

Property action As %String(XMLNAME = "ACTION");

Property pArg As list Of %String(MAXLEN = "", XMLNAME = "PARG", XMLPROJECTION = "element");

Property stream As %CSP.BinaryStream(XMLNAME = "STREAM");

Storage Default
{
<Data name="RequestMsgDefaultData">
<Subscript>"RequestMsg"</Subscript>
<Value name="1">
<Value>action</Value>
</Value>
<Value name="2">
<Value>pArg</Value>
</Value>
<Value name="3">
<Value>stream</Value>
</Value>
</Data>
<DefaultData>RequestMsgDefaultData</DefaultData>
<Type>%Storage.Persistent</Type>
}

}

