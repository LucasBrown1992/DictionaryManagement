Class DictionaryManagement.DictTable Extends %Persistent
{

Property TableName As %String;

Property Remark As %String;

Property CreateTime As %String;

Property ModifyTime As %String;

Storage Default
{
<Data name="DictTableDefaultData">
<Value name="1">
<Value>%%CLASSNAME</Value>
</Value>
<Value name="2">
<Value>TableName</Value>
</Value>
<Value name="3">
<Value>Remark</Value>
</Value>
<Value name="4">
<Value>CreateTime</Value>
</Value>
<Value name="5">
<Value>ModifyTime</Value>
</Value>
</Data>
<DataLocation>^DictionaryManage9383.DictTableD</DataLocation>
<DefaultData>DictTableDefaultData</DefaultData>
<ExtentSize>0</ExtentSize>
<IdLocation>^DictionaryManage9383.DictTableD</IdLocation>
<IndexLocation>^DictionaryManage9383.DictTableI</IndexLocation>
<StreamLocation>^DictionaryManage9383.DictTableS</StreamLocation>
<Type>%Storage.Persistent</Type>
}

}

