Class DictionaryManagement.Table Extends %Persistent
{

Property TableName As %String;

Property Remark As %String;

Property CreateTime As %String;

Property ModifyTime As %String;

Storage Default
{
<Data name="TableDefaultData">
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
<DataLocation>^DictionaryManagement.TableD</DataLocation>
<DefaultData>TableDefaultData</DefaultData>
<ExtentSize>0</ExtentSize>
<IdLocation>^DictionaryManagement.TableD</IdLocation>
<IndexLocation>^DictionaryManagement.TableI</IndexLocation>
<StreamLocation>^DictionaryManagement.TableS</StreamLocation>
<Type>%Storage.Persistent</Type>
}

}

