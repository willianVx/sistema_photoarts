<?php

ini_set("display_errors","OFF");
error_reporting(E_ALL);

if( !function_exists("html") )
{
	function html($createtag="")
	{
		return html::tag($createtag);
	}
}

class html
{
	public $element;
	public $elements;
	public static $tag;
	public static $singleTags = array('img', 'input', 'br', 'hr');
	public static $uncloseTags = array('link','meta');
	public static $debug;
	public static $cache=NULL;
	private static $magicSpecialIdentifier = "__special__";
	private static $magicSpecialMethods;
	private static $aliasCommandTable = array();
	
	private static $tagStore;

	function __construct()
	{
		if(is_null(self::$cache) === true) self::cache(true);
	}

	public static function debug($function="", $string="")
	{
		if( !html::$debug ) return;
		echo $function.": ".trim($string)."\n";
	}
	
	public static function cache($state=NULL){
		if(class_exists('cache') && is_null($state) === false){
			cache::enable($state);
			self::$cache = $state;
			return cache::is_enabled();
		}
		elseif(class_exists('cache') && is_null($state) === true){
			return self::$cache;
		}
		return html::$cache;
	}

	public static function clean()
	{
		self::$form = NULL;
	}

	public static function delete($name)
	{
		$name = self::getOrigin($name);
		if( isset(self::$form[$name]) ) unset(self::$form[$name]);
	}

	public static function tag($nodename=false)
	{
		return self::_createTag($nodename);
	}

	private static function _createTag($nodename=false)
	{
		$id = uniqid();
		if( !isset(self::$tag[$id]) ) self::$tag[$id] = new self();
		self::$tag[$id]->setElement($id);
		html::debug(__METHOD__, "Create node from $nodename");
		
		if(!self::$magicSpecialMethods){self::__selfInvestigate();}
		if( isset(self::$magicSpecialMethods[$nodename]) )
		{
			$callOperation = self::$magicSpecialIdentifier.$nodename;
			//Special Tags always start with namespace "special"
			return self::$callOperation($id,"special:".$nodename);
		}
		return self::$tag[$id]->_createNewTag($nodename);
	}
	
	private static function __selfInvestigate(){
		$self = new ReflectionClass(__CLASS__);
		foreach($self->getMethods() as $id => $methodData){
			if(strpos($methodData->name,self::$magicSpecialIdentifier) !== false){
				self::$magicSpecialMethods[substr($methodData->name,strlen(self::$magicSpecialIdentifier))] = $methodData->name;
			}
		}
		return true;
	}
	
	private static function __createSpecialName($function){
		$name = substr($function,strlen(self::$magicSpecialIdentifier));
		$prefix = strtolower(str_replace("_","",self::$magicSpecialIdentifier));
		return $prefix.":".$name;
	}
	
	//Definition of special commands
	private static function __special__alias($command,$alias)
	{
		self::$aliasCommandTable[$alias] = $command;
		return true;
	}

	private static function __special__control($args)
	{
		if(isset(self::$tagStore["control"][$args])){
			//echo "SPECIAL\n";
			//print_r(self::$tagStore["control"][$args]);
			$clone = unserialize(serialize(self::$tagStore["control"][$args]));
			//$clone = clone self::$tagStore["control"][$args];
			return $clone;
		}
		
		$tag = self::tag(self::__createSpecialName(__FUNCTION__));
		$tag->{'_name'}($args);
		//$tag->name($args);
		//This tag is in replacemode means. After restoring it, it should replace given values and attributes instead of create attributes
		$tag->inReplaceMode(true);
		self::$tagStore["control"][$args] = $tag;
		return $tag;
	}
	//End definition
	
	final public function setElement($id)
	{
		$this->element = $id;
	}

	public static function __callStatic($name, $args)
	{
		html::debug(__METHOD__,"$name");
		//Lookup alias table
		html::commandAlias($name);
		
		if(!self::$magicSpecialMethods){self::__selfInvestigate();}
		
		if( isset(self::$magicSpecialMethods[$name]) )
		{
			$name = self::$magicSpecialMethods[$name];
			html::debug(__METHOD__, "Call function $name");
			return call_user_func_array(array(__CLASS__,$name),$args);
		}
		
		$createdElement = self::tag($name);
		if(isset($args[0])){
			$createdElement->_analyzeParamterArray($args);
		}
		return $createdElement;
	}

	public function __call($method, $attribute)
	{
		html::debug(__METHOD__,"$method");
		//Lookup alias table
		$this->elements[$this->element] = new html_attribute;
		$this->elements[$this->element]->__parentElement($this->elements[$this->element]);
		return $this->elements[$this->element]->$method($attribute[0]);
	}
	
	private static function commandIsAlias($name){
		if(isset(self::$aliasCommandTable[$name]))return true;
	}
	public static function commandAlias(&$name){
		if(!html::commandIsAlias($name)) return false;
		//echo "$name => ";
		$alias = self::$aliasCommandTable[$name];
		//echo "$alias\n";
		$name = $alias;
		return true;
	}

}

class html_attribute
{

	private $tag;

	function _createNewTag($string)
	{
		if( $this->__braceCheck($string) === false )
		{
			$tag = $this->_nodename($string);
			return $tag;
		}
		else
		{
			$tag = $this->_parseFromString($string);
			if( is_array($tag->_content) && count($tag->_content) == 1 && is_object($tag->_content[0]) ) return $tag->_content[0];
			return $tag;
		}
	}
	
	public function inReplaceMode($state=true){
		$this->{"*inreplacemode"} = $state;
		return $this->tag();
	}

	public function appendTo(html_attribute $object)
	{
		$element = $object->tag();
		$element->addhtml($this->tag());
		return $this->tag();
	}
	
	public function appendDimension()
	{
		html::debug(__FUNCTION__, "Append Dimension");
		$this->{'*newdimension'}(true);
		return call_user_func_array(array($this,"append"),func_get_args());
	}
	
	public function append()
	{
		if(func_get_args())	foreach(func_get_args() as $object){
			$element = $this->tag();
			if($object instanceOf html_attribute){
				$element->addhtml($object->tag());
			}
			else {
				$element->addhtml($object);
			}
		}
		return $this->tag();
	}

	function __parentElement(html_attribute $object)
	{
		$this->tag = $object;
	}

	function removeReferrence()
	{
		$this->tag = null;
	}
	
	public function _analyzeParamterArray($arrayData){
		if($arrayData)foreach($arrayData as $id => $data){if($data instanceOf html_attribute){$this->tag()->append($data); unset($arrayData[$id]);}}
		if(!(count($arrayData)%2)) $isEven = true; else $isEven=false;
		if(!$isEven) $this->tag()->text(array_shift($arrayData));
		while($arrayData){
			$attribute = array_shift($arrayData);
			$value = array_shift($arrayData);
			$this->tag()->{$attribute}($value);
		}
		return $this->tag();
	}
	
	function _intoTag($string)
	{
		if( $this->__braceCheck($string) === false )
		{
			return $this->html($string);
		}
		else
		{
			return $this->_parseFromString($string);
		}
	}

	function _nodename($value)
	{
		return $this->setElementAttribute("nodename", $value);
	}

	function _parseFromString($string)
	{
		if(html::cache() && cache::has(__FUNCTION__.$string)) return cache::get(__FUNCTION__.$string);
		$createdElement = parse::html($string, $this->tag());
		if(html::cache()) cache::set(__FUNCTION__.$string,$createdElement);
		return $createdElement;
	}

	private function __braceCheck($string)
	{
		$string = trim($string);
		if( strpos($string, "<") !== false && strpos($string, ">") !== false )
		{
			return true;
		}
		else return false;
	}

	function __call($attribute, $value)
	{
		html::debug(__METHOD__,"$attribute");
		if(html::commandAlias($attribute)){
			return call_user_func_array(array($this,$attribute),$value);
		}
		//LE marker
		//echo "__call: ".$attribute."\n";
		return $this->setElementAttribute($attribute, $value);
	}

	function __set($attribute, $value)
	{
		html::debug(__METHOD__,"$attribute");
		html::commandAlias($attribute);
		//LE marker
		//echo "__set: ".$attribute."\n";
		if($this->parseAttr($attribute)){
			if(is_string($value)){$this->tag()->addtext($value);}
			if(is_object($value)){$this->tag()->append($value);}
			return $this->tag();
		}
		if(!isset($value)) $value = "";
		html::debug(__METHOD__, $attribute." = ".gettype($value)."(".$value.")");
		$attribute = strtolower($attribute);
		foreach( array("add", "remove") as $pre )
		{
			if( stripos($attribute, $pre) === 0 )
			{
				$attribute = substr($attribute, strlen("add"));
				break;
			}
			$pre = "set";
		}
		$createdElement = $this->{$pre."ElementAttribute"}($attribute, $value);
		return $createdElement;
	}

	private function addElementAttribute($attribute, $value)
	{
		if(isset($this->$attribute))
		html::debug(__METHOD__, "Attribute \$attrName==\"".$attribute."\" to append is: ".gettype($this->$attribute)."(".$attribute.")");
		html::debug(__METHOD__, "Value to append is: ".gettype($value)."(".$value.")");
		
		if( $attribute == "html" || $attribute == "text" )
		{
			$attrName = $attribute = "_content";
		}
		$attrName = $attribute;
		if(isset($this->$attribute)) $attrType = gettype($this->$attribute); else $attrType = "string";
		$addType = gettype($value);

		if( is_object($value) )
		{
			$this->__pushToArray($attribute, $value);
		}
		elseif( $addType == "string" && $attrType == "array" && $attrName == "_content" )
		{
			html::debug(__METHOD__, "Push STRING to _content ARRAYPUSH");
			$this->__pushToArray($attribute, html::tag()->{$attribute}($value));
		}
		elseif( $addType == "string" && $attrType == "string" )
		{
			html::debug(__METHOD__, "Append STRING to _content String");
			if(!isset($this->$attribute)) $this->$attribute = "";
			$this->$attribute .= ($this->$attribute && $value[strlen($value) - 1] != ">" && $attrName != "_content" ? " " : "").$value;
		}
		elseif( $attrType == "NULL" && $addType == "string" )
		{
			html::debug(__METHOD__, "Overwrite STRING in _content");
			$this->$attribute = $value;
		}
		else
		{
			trigger_error("Unhandled operation $attrName $attrType $addType", E_USER_ERROR);
		}
		return $this->tag();
	}

	private function __pushToArray($attribute, $element)
	{
		if( !isset($this->$attribute) ) $this->$attribute = array();
		if( !is_array($this->$attribute) ) $this->$attribute = array(html::tag()->text($this->$attribute));
		array_push($this->$attribute, $element);
	}
	
	private function __contentReplace($search,$replace){
		//echo "Look for [$search]\n";
		
		//if(is_array($replace)) die("What array what?!?");
		
		$currentObject = new ArrayIterator($this);
		foreach($currentObject as $key => $val){
			//echo $key.": ".$val."\n";
			//if($val === "#".$search){
			if(!is_array($val) && strpos($val,"#".$search) !== false){
				//echo "Found search: ".$key.": ".$val."\n";
				$this->$key = str_replace("#".$search,$replace,$this->$key);
				//$this->$key = $replace;
			}
			elseif(is_array($val)){
				foreach($val as $subObjects){
					$subObjects->__contentReplace($search,$replace);
				}
			}
		}

	}
	
	private function __contentRepeatReplace($search,$replaceArray,$parent=false){
		
		$currentObject = new ArrayIterator($this);
		foreach($currentObject as $key => $val){
			//echo $key.": ".$val."\n";
			//if($val === "#".$search){
			if(!is_array($val) && strpos($val,"#".$search) !== false){
				//echo "Found search: ".$key.": ".$val."\n";
				//echo "Matched: $val == #$search\n";
				//print_r($this);
				//echo "FROM\n";
				//print_r($parent);
				$masterNode = unserialize(serialize($this));
				if($parent instanceOf html_attribute) $parent->empty();
				foreach($replaceArray as $replaceId => $replaceData){
					$copyNode = unserialize(serialize($masterNode));
					$parent->append($copyNode);
					$copyNode->$key = str_replace("#".$search,$replaceData,$copyNode->$key);
					//$copyNode->$key = $replaceData;
				}
			}
			elseif(is_array($val)){
				foreach($val as $subObjects){
					$subObjects->__contentRepeatReplace($search,$replaceArray,$this);
				}
			}
		}
		
	}
	
	private static function array_depth(array $a){
		$m = 0;
		$x = explode(',', json_encode($a, JSON_FORCE_OBJECT)."\n\n");
		foreach($x as $r)	$m = (substr_count($r,':')>$m)?substr_count($r,':'):$m;
		return $m;
	}
	private static function is_assoc(array $a) {
		return (count(array_filter(array_keys($a),'is_string')) == count($a));
	}
	
	private function __collectArrayInformation(array $array){
		$this->__investigateArray($array,$dim=0,$info);
		$return["dimension"] = 0;
		$return["datalayer"] = 0;
		if($info)	foreach($info as $dim => $data){
			if(!$data["is_assoc"]){$return["dimension"]++;}else{$return["datalayer"]++;}
			if(isset($data["itemcount"]) && $data["itemcount"]) $return["itemcount"] = $data["itemcount"];
		}
		return $return;
	}
	private function __investigateArray(array $a,$dim=0,&$info=array()){
		$dim++;
		self::array_depth($a);
		$info[$dim]["is_assoc"] = self::is_assoc($a);
		if($info[$dim]["is_assoc"]){$info[$dim]["itemcount"] = count($a);}
		
		if(is_array($next = current($a))){
			$this->__investigateArray($next,$dim,$info);
		}
		return true;
	}
	
	private function __countDimensions(&$count,&$dimensionObjects){
		if(isset($this->{'*newdimension'}) && $this->{'*newdimension'}===true){
			$count++;
			$dimensionObjects[$count] = $this;
		}
		if(isset($this->_content) && is_array($this->_content)) foreach($this->_content as $sub) $sub->__countDimensions($count,$dimensionObjects);
		return true;
	}
	
	private function __getDimensions(){
		$this->__countDimensions($count,$objectsHoldingDimensions);
		$return["dimension"] = $count;
		$return["references"] = $objectsHoldingDimensions;
		return $return;
	}
	
	private function __extendDimensions(array $data){
		echo "Start Extensions\n";
		//print_r($this);
		//print_r($data);
		$currentDimension=1;
		$this->__createDimensionFromPattern($data,$currentDimension);
	}
	private function __createDimensionFromPattern(array $dimensionData,&$currentDimension){
		echo str_repeat("  ",$currentDimension-1)."Take a look at Dimension $currentDimension\n";
		
		if(count($this->{'&__dimensionpattern'})==$currentDimension){
			echo str_repeat("  ",$currentDimension-1)."Reached last Dimension\n";
			if($currentDimension > 1){
				echo str_repeat("  ",$currentDimension-1)."Make a copy of Dimension ".($currentDimension-1)."\n";
				//$dimensionPatternCopy = unserialize(serialize($this->{'&__dimensionpattern'}[$currentDimension-1]));
				//$dimensionPatternCopy->_content = array();
				$masterCopy = unserialize(serialize($this->{'&__dimensionpattern'}[$currentDimension]));
				$masterCopy->_content = array();
			}
					
			foreach($dimensionData as $dimensionWork){
				//print_r($dimensionWork);
				echo str_repeat("  ",$currentDimension-1)."Start work in Dimension $currentDimension\n";
				if(is_array($dimensionWork)){
					
					$dimensionCopy = unserialize(serialize($this->{'&__dimensionpattern'}[$currentDimension]));
					foreach($dimensionWork as $searchKey => $replaceData){
						echo str_repeat("  ",$currentDimension-1)."Copy Dimension Pattern $currentDimension\n";
						//foreach($dimensionCopy->_content as $contentNodes){
						echo str_repeat("  ",$currentDimension-1)."Search $searchKey Replace $replaceData in copy\n";
							$dimensionCopy->__contentReplace($searchKey,$replaceData);
						//}
						
					}
					
					echo str_repeat("  ",$currentDimension-1)."Append copy to previous Dimension\n";
					foreach($dimensionCopy->_content as $contentElements){
						$masterCopy->_content[] = $contentElements;
					}
					//print_r($dimensionPatternCopy);
					//print_r($masterCopy);
					
				}
				//return;
			}
			
			//print_r($dimensionPatternCopy);
			echo str_repeat("  ",$currentDimension-1)."Return Dimension ".($currentDimension-1)." copy\n";
			return $masterCopy;
		}
		else {
			echo str_repeat("  ",$currentDimension-1)."Dive deeper in Dimension\n";
			$currentDimension++;
			if(($currentDimension-1)>=1){
				$this->{'&__dimensionaccess'}[($currentDimension-1)]->_content = array();
				//print_r($newDimension);
			}
			foreach($dimensionData as $sendDimension){
				echo str_repeat("  ",$currentDimension-2)."Go sub\n";
				$newDimension = $this->__createDimensionFromPattern($sendDimension,$currentDimension);
				echo str_repeat("  ",$currentDimension-2)."Return\n";
				echo str_repeat("  ",$currentDimension-2)."Append to Dimension: ".($currentDimension-1)."\n";
				if(($currentDimension-1)>=1){
					$this->{'&__dimensionaccess'}[($currentDimension-1)]->_content[] = $newDimension;
					//print_r($newDimension);
				}
			}
		}
		
	}

	function setElementAttribute($attribute, $value)
	{
		html::debug(__METHOD__,"Set attribute $attribute to $value");
		//echo "--> Set $attribute\n";
		if(isset($this->{'*inreplacemode'}) && $this->{'*inreplacemode'}){
			if(is_string($value)){
				//echo $attribute." - ".$value."\n";
				$this->__contentReplace($attribute,$value);
			}
			elseif(is_array($value) && count($value)>1 && self::array_depth($value)==1){
				$this->__contentRepeatReplace($attribute,$value);
			}
			//To solve it, Im gonna do it ugly. This should be rewritten for better detection of multiparameter or multidimensional array.
			//The problem is: This function gets called twice. First with given array, then with each data seperatly.
			//Currently, Dimensions are restricted to cascading dimensions. It is not possible to feed to separate dimensions asyncron.
			elseif($attribute == "explode" && is_array($value) && count($value)>=1 && self::array_depth($value)>=1){
				if(isset($this->{'&__called'}) && $this->{'&__called'}){
					//print_r($this);
					$objectDimensions = $this->__getDimensions();
					$objectDimension = $objectDimensions["dimension"];
					$objectDimensionPattern = $objectDimensions["references"];
					$arrayDimensions = $this->__collectArrayInformation($value);
					$dataDimension = $arrayDimensions["dimension"];
					$dataLayer = $arrayDimensions["datalayer"];
					//echo $attribute."\n";

					if($objectDimension == $dataDimension && $dataLayer){
						
						ob_start();
						
						//print_r($objectDimensionPattern);
						$this->{'&__dimensionpattern'} = unserialize(serialize($objectDimensionPattern));
						$this->{'&__dimensionaccess'} = $objectDimensionPattern;
						//print_r($arrayDimensions);
						//print_r($objectDimensions);
						echo "(Object) Expected Dimension: ".$objectDimension."\n";
						echo "(Explode) Data Dimension: ".$dataDimension."\n";
						echo "(Explode) Attributes: ".$dataLayer."\n";
						$this->__extendDimensions($value);
						
						ob_end_clean();
					}
					elseif($objectDimension > $dataDimension){
						echo "Expect more dimensions in given data!\n";
					}
					$this->{'&__called'} = false;
				}
				if(isset($this->{'&__called'}) && $this->{'&__called'} === false)
					unset($this->{'&__called'});
				else
					$this->{'&__called'}++;
			}
		}

		if($attribute == "empty") return call_user_func(array($this,"__empty"));
		
		if( $value instanceOf html_attribute ){
			return $value->appendTo($this)->tag();
		}
		
		$attrName = $attribute;
		$addType = gettype($value);
		if( $attrName == "text" || $attrName == "html" ) $attrName = $attribute = "_content";

		if( isset($value) && is_array($value) && count($value) !== 0 )
		{
			$value = (isset($value) && is_array($value) && isset($value[0]) ? $value[0] : $value);
			$value = $this->__selfStateAttribute($attribute, $value);
		}
		
		$this->$attribute = $value;
		return $this->tag();
	}

	private function __selfStateAttribute($attribute, $value)
	{
		$selfStates = array("disabled", "checked");
		if( in_array($attribute, $selfStates) && $value != false )
		{
			return $attribute;
		}
		return $value;
	}
	
	public function __empty(){
		$this->tag()->html = "";
		return $this->tag();
	}

	public function toString()
	{
		return (string) $this->tag();
	}

	private static function __isSingeTag($nodeName)
	{
		return (bool) in_array($nodeName, html::$singleTags); #<==== new (some changes)
	}

	private static function __isUncloseTag($nodeName)
	{
		return (bool) in_array($nodeName, html::$uncloseTags); #<==== new
	}

	function __toString()
	{
		$tag = $this->tag()->toArray();
		$nodeName = $tag["nodename"];
		$tagContent = null;

		$isSingleTag = self::__isSingeTag($nodeName) | (bool) isset($tag["issingle"]);
		$isUncloseTag = self::__isUncloseTag($nodeName) | (bool) isset($tag["isunclose"]);
		
		if(strpos($nodeName,"special:") === 0){
			foreach($tag as $key => $val)if($key!="_content")unset($tag[$key]);
			$nodeName = "";
		}
		
		if( isset($tag["nodename"]) ) unset($tag["nodename"]);
		if( isset($tag["issingle"]) ) unset($tag["issingle"]);
		if( isset($tag["isunclose"]) ) unset($tag["isunclose"]);#<==== new

		if( !$isSingleTag && isset($tag["_content"]) )
		{
			if( isset($tag["_content"]) ) $tagContent = $tag["_content"];

			if( is_array($tagContent) )
			{
				$subNodes = $tagContent;
				$tagContent = "";
				foreach( $subNodes as $elNr => $subNode )
					$tagContent .= $subNode->toString();
			}
			if( isset($tag["_content"]) ) unset($tag["_content"]);
		}
		if( isset($tag["_content"]) ) unset($tag["_content"]);

		if( $nodeName ) $strTag = '<'.$nodeName.' ';
		if( $tag ) foreach( $tag as $attribute => $value )
				if( is_null($value) )
				{
					$strTag .= $attribute.'="'.$attribute.'"';
				}
				elseif($attribute[0] != "*")
				{
					$strTag .= $attribute.'="'.addcslashes(stripcslashes($value), '"').'" ';
				}

		if( $isSingleTag )
		{
			if( $nodeName ) $strTag .= "/>";
		}
		else
		{
			if(!isset($strTag)) $strTag = "";
			if( $nodeName ) $strTag = rtrim($strTag).">";#<==== fixed (war an einer falschen stelle)
			if( !$isUncloseTag )
			{ #<==== new
				$strTag .= $tagContent;
				if( $nodeName ) $strTag .= "</".$nodeName.">";
			}
		}
		return $strTag;
	}

	public function parseAttr($string)
	{
		html::debug(__METHOD__, $string);
		$regex = '([^ =]+)\\ *?=\\ *?("|\')((?:\\\\\\2+|[^\\2]*?)*?)\\2';
		$regex_full = '@'.$regex.'@s';

		while( preg_match($regex_full, $string, $mt) )
		{
			$this->{$mt[1]} = $mt[3];
			$string = preg_replace($regex_full, '', $string, 1);
			$hasModded=true;
		}

		$foo = preg_split('@\ +@s', trim($string));

		foreach( $foo as $attr )
		{
			if( preg_match('@^([^=]+)=([^ ]+)$@s', $attr, $mt) )
			{
				$this->{$mt[1]} = $mt[2];
			}
			else
			{
				if(property_exists($this,$attr))
					$this->{$attr} = null;
			}
			
		}
		if(!isset($hasModded)) $hasModded = false;
		return $hasModded;
	}

	function toArray()
	{
		foreach( $this->tag as $key => $val )
		{
			if( !is_object($val) ) $copy[$key] = $val;
		}
		return $copy;
	}

	public function tag()
	{
		return $this->tag;
	}

}

class parse
{

	private static $S;
	private static $A;
	private static $T;

	private static function _init()
	{
		self::$S = " \t\r\n\f"; //Valid Whitespace description
		self::$A = "[a-zA-Z_:][a-zA-Z0-9_:.-]*"; //Valid Attribute description
		self::$T = "[a-zA-Z]{1}[-a-zA-Z0-9:_]*"; //Valid Tagname description
	}
	
	public static function html($string="", $toTag)
	{
		if(html::cache()){
			if(cache::has(__FUNCTION__.$string)) return self::tokenizer(cache::get(__FUNCTION__.$string), $string, $toTag);
		}
		
		if( !self::$A ) self::_init();
		$S = self::$S;
		$A = self::$A;
		$T = self::$T;
		$rx = "<"; //Look for an opener
		$rx.= "([".$S."]*?[/]?".$T."[".$S."]*?)"; //Find a valid start or ending tag and store it
		$rx.= "("; //Start recording the attributes
		$rx.= "(?:"; //Take all attributes
		$rx.= "(?:"; //Loop through attributes
		$rx.= "(?:"; //There are fullfeatured attributes and singlekey attribute decide which one to take
		$rx.= "".$A."[".$S."]*?=[".$S."]*?('|\")(?:(?:\\\\\\3|[^\\3])*?)(\\3)"; //Find fullfeatured attributes
		$rx.= "|(?:".$A."?(?:=[^ >]*)?)"; //Or be fine with a valid singlekey attribute/unquoted attribute
		$rx.= ")"; //Decision for an attribute finished
		$rx.= "[".$S."]*"; //Next attribute might be spaced by valid space characters
		$rx.= ")*"; //Finish attribute loop
		$rx.= ")"; //Take as long attributes as there is not the ending sign >
		$rx.= ")"; //And store them in a string
		$rx.= "(?:>|(/)[".$S."]*>)"; //The end is reached if there is a closing sign found >

		preg_match_all("!".$rx."!sm", $string, $matched_tags, PREG_OFFSET_CAPTURE);
		if(html::cache()){cache::set(__FUNCTION__.$string,$matched_tags);}
		return self::tokenizer($matched_tags, $string, $toTag);
	}

	private function tokenizer($matchArray, $string, $toTag)
	{
		if(html::cache()){
			if(cache::has(__FUNCTION__.$string)) return cache::get(__FUNCTION__.$string);
		}

		unset($matchArray[3]);
		unset($matchArray[4]);
		$ELEMENTS = 0;
		$TAG = 0;
		$TAGNAME = 1;
		$ATTRIBUTES = 2;
		$SINGLETAG = 5;

		$VALUE = 0;
		$OFFSET = 1;
		
		$last = false;

		$elementCount = count($matchArray[$ELEMENTS]);
		$depth = 0;
		if( $matchArray[$ELEMENTS] ) foreach( $matchArray[$ELEMENTS] as $ID => $foo )
			{
				$tag = self::getTagInfo($matchArray, $ID, $depth);
				$depth = $tag["depth"];

				if( $tag["isEnd"] || $tag["isSingle"] )
				{
					$afterTag = self::getTagInfo($matchArray, $ID + 1, $depth);
				}

				if( !$last )
				{
					$firstTagID = $ID;
				}

				if( $depth == 0 || $elementCount == 1 )
				{
					$newTag[$ID] = html::tag();

					$firstTag = self::getTagInfo($matchArray, $firstTagID);
					$newTag[$ID]->_nodename($firstTag["nodeName"]);

					if( $firstTag["attributes"] )
					{
						self::attribute_tokenizer($newTag[$ID], $firstTag["attributes"]);
					}

					if( $firstTagID == 0 )
					{
						$preNode = substr($string, 0, $firstTag["tagStartPos"]);
					}
					else
					{
						$preFirstTag = self::getTagInfo($matchArray, $firstTagID - 1);
						$preNode = substr($string, $preFirstTag["tagEndPos"], $firstTag["tagStartPos"] - $preFirstTag["tagEndPos"]);
					}

					if( $preNode )
					{
						$toTag->addhtml($preNode);
					}

					$newTag[$ID]->appendTo($toTag);
					unset($last);

					$subString = substr($string, $firstTag["tagEndPos"], $tag["tagStartPos"] - $firstTag["tagEndPos"]);
					if( $subString )
					{
						$newTag[$ID]->_intoTag($subString);
					}

					$nextTag = self::getTagInfo($matchArray, $ID + 1);
					if( !$nextTag["nodeName"] )
					{
						if( $sufString = substr($string, $tag["tagEndPos"]) )
						{
							$toTag->addhtml($sufString);
						}
					}
				}
				else
				{
					$last = $tag;
				}
			}
		
		if(html::cache()){cache::set(__FUNCTION__.$string,$toTag->tag());}
		
		return $toTag->tag();
	}

	private static function getTagInfo($matchArray, $ID, $depth=false)
	{
		$ELEMENTS = 0;
		$TAG = 0;
		$TAGNAME = 1;
		$ATTRIBUTES = 2;
		$SINGLETAG = 5;
		$VALUE = 0;
		$OFFSET = 1;
		
		if(isset($matchArray[$TAGNAME][$ID][$VALUE])) $nodeName = trim($matchArray[$TAGNAME][$ID][$VALUE]);
		if( isset($nodeName) && $nodeName[0] == "/" )
		{
			$isEnd = true;
			$nodeName = trim(substr($nodeName, 1));
		}
		else
		{
			$isEnd = false;
		}
		
		if( isset($matchArray[$SINGLETAG][$ID]) && isset($matchArray[$TAGNAME][$ID][$VALUE]) ){
			$isSingle = (bool) $matchArray[$SINGLETAG][$ID] || (bool) self::isSingleTag($matchArray[$TAGNAME][$ID][$VALUE]);
		}
		else {
			$isSingle = false;
		}
		if( !$isSingle && !$isEnd )
		{
			$depth++;
		}
		if( $isEnd )
		{
			$depth--;
		}
		if(!isset($matchArray[$ELEMENTS][$ID][$OFFSET])) $matchArray[$ELEMENTS][$ID][$OFFSET] = 0;
		$tagStartPos = $matchArray[$ELEMENTS][$ID][$OFFSET];
		
		if(!isset($matchArray[$ELEMENTS][$ID][$VALUE])) $matchArray[$ELEMENTS][$ID][$VALUE] = 0;
		$tagEndPos = $tagStartPos + strlen($matchArray[$ELEMENTS][$ID][$VALUE]);
		
		if(!isset($matchArray[$ATTRIBUTES][$ID][$VALUE])) $matchArray[$ATTRIBUTES][$ID][$VALUE] = "";
		
		$tag["nodeName"] = (isset($nodeName)?$nodeName:"");
		$tag["isSingle"] = $isSingle;
		$tag["isEnd"] = $isEnd;
		$tag["depth"] = $depth;
		$tag["tagStartPos"] = $tagStartPos;
		$tag["tagEndPos"] = $tagEndPos;
		$tag["attributes"] = $matchArray[$ATTRIBUTES][$ID][$VALUE];
		return $tag;
	}

	private static function plotTag($tagData)
	{
		$line = str_pad($tagData["nodeName"], 7);
		$line.= " single:".(int) $tagData["isSingle"];
		$line.= " end:".(int) $tagData["isEnd"];
		$line.= " depth:".(int) $tagData["depth"];
		$line.= " sP:".$tagData["tagStartPos"];
		$line.= " sE:".$tagData["tagEndPos"];
		$line.= "\n";
		return $line;
	}

	private static function isSingleTag($nodeName)
	{
		return (bool) in_array($nodeName, html::$singleTags); #<==== new (some changes)
	}

	private static function braceCheck($string)
	{
		$string = trim($string);
		if( strpos($string, "<") !== false || strpos($string, ">") !== false )
		{
			return strpos($string, "<");
		}
		return false;
	}

	/**
	 * This function traces/splits the attributes out of a string containing all attributes in a raw form
	 * @param string $attributeString Is the attribute string given from the tag_tokenizer/create
	 */
	private static function attribute_tokenizer(html_attribute $htmlElement, $attributeString)
	{
		$S = self::$S;
		$A = self::$A;
		$T = self::$T;
		$ATTRIBUTEPAIR = 0;
		$ATTRIBUTEDELIMITER = 1;

		$rx = "";
		$rx.= "".$A."[".$S."]*?=[".$S."]*?('|\")(?:(?:\\\\\\1|[^\\1])*?)(\\1)"; //Find fullfeatured attributes
		$rx.= "|(?:".$A.")[".$S."]*?=[^ ]*|[a-zA-Z]{1}[a-zA-Z0-9:-]*"; //Or be fine with a valid singlekey attribute
		while( preg_match("!".$rx."!sm", $attributeString, $match) )
		{
			if( $match[0] )
			{
				list($attributeName, $attributeValue) = explode("=", $match[0], 2);
			}
			if( $match[1] )
			{
				$attributeValue = substr(trim($attributeValue), 1, strlen(trim($attributeValue)) - 2);
			}
			$htmlElement->{trim($attributeName)}(trim($attributeValue));
			$pos = strpos($attributeString, $match[$ATTRIBUTEPAIR]);
			$attributeString = substr_replace($attributeString, "", $pos, strlen($match[$ATTRIBUTEPAIR]));
		}
	}

}

class cache{
	private static $enabled;
	private static $ttl = 10;
	
	private static $store = array();
	private static $sys = "internal"; //apc
	
	public static function enable($state=true){
		if(extension_loaded("apc")){ self::$sys = "apc"; } else { self::$sys = "internal"; }
		return self::$enabled = $state;
	}
	
	public static function is_enabled(){
		if(self::$enabled === true){
			if(extension_loaded("apc")){
				self::$enabled = true;
			} else self::$enabled = false;
		}
		return self::$enabled;
	}
	
	private static function createKey($string){
		return md5($string);
	}
	
	public static function has($key){
		return call_user_func(array(__CLASS__,self::$sys."_exists"),self::createKey($key));
	}
	
	public static function get($key){
		if(self::$sys == "internal"){
			$data = self::internal_fetch(self::createKey($key),$success);
		}
		elseif(self::$sys == "apc"){
			$data = self::apc_fetch(self::createKey($key),$success);
		}
		if(!$success){
			trigger_error("Missing cache data!",E_USER_WARNING);
		}
		return $data;
	}
	
	public static function set($key,$data){
		return call_user_func(array(__CLASS__,self::$sys."_store"),self::createKey($key),$data,self::$ttl);
	}
	
	private static function apc_fetch($key,&$success){return apc_fetch($key,$success);}
	private static function apc_store($key,$data,$ttl){return apc_store($key,$data,$ttl);}
	private static function apc_exists($key){return apc_exists($key);}
	
	private static function internal_fetch($key,&$success){$success = true;return self::$store[$key];}
	private static function internal_store($key,$data,$ttl){self::$store[$key] = $data;return true;}
	private static function internal_exists($key){return isset(self::$store[$key]);}
	
}

//Currently suspended.
/*
class action {

	protected $closure = NULL;
	protected $reflection = NULL;
	protected $code = NULL;
	protected $used_variables = array();

	public function __construct($function)
	{
		if ( ! $function instanceOf Closure)
			throw new InvalidArgumentException();

		$this->closure = $function;
		$this->reflection = new ReflectionFunction($function);
		$this->code = $this->_fetchCode();
		$this->used_variables = $this->_fetchUsedVariables();
	}

	public function __invoke()
	{
		$args = func_get_args();
		return $this->reflection->invokeArgs($args);
	}

	public function getClosure()
	{
		return $this->closure;
	}

	protected function _fetchCode()
	{
		// Open file and seek to the first line of the closure
		$file = new SplFileObject($this->reflection->getFileName());
		$file->seek($this->reflection->getStartLine()-1);

		// Retrieve all of the lines that contain code for the closure
		$code = '';
		while ($file->key() < $this->reflection->getEndLine())
		{
			$code .= $file->current();
			$file->next();
		}

		// Only keep the code defining that closure
		$begin = strpos($code, 'function');
		$end = strrpos($code, '}');
		$code = substr($code, $begin, $end - $begin + 1);

		return $code;
	}

	public function getCode()
	{
		return $this->code;
	}

	public function getParameters()
	{
		return $this->reflection->getParameters();
	}

	protected function _fetchUsedVariables()
	{
		// Make sure the use construct is actually used
		$use_index = stripos($this->code, 'use');
		if ( ! $use_index)
			return array();

		// Get the names of the variables inside the use statement
		$begin = strpos($this->code, '(', $use_index) + 1;
		$end = strpos($this->code, ')', $begin);
		$vars = explode(',', substr($this->code, $begin, $end - $begin));

		// Get the static variables of the function via reflection
		$static_vars = $this->reflection->getStaticVariables();

		// Only keep the variables that appeared in both sets
		$used_vars = array();
		foreach ($vars as $var)
		{
			$var = trim($var, ' $&amp;');
			$used_vars[$var] = $static_vars[$var];
		}

		return $used_vars;
	}

	public function getUsedVariables()
	{
		return $this->used_variables;
	}

	public function __sleep()
	{
		return array('code', 'used_variables');
	}

	public function __wakeup()
	{
		extract($this->used_variables);

		eval('$_function = '.$this->code.';');
		if (isset($_function) AND $_function instanceOf Closure)
		{
			$this->closure = $_function;
			$this->reflection = new ReflectionFunction($_function);
		}
		else
			throw new Exception();
	}
}
*/

if(file_exists('html.shortcuts.php'))
	include_once "html.shortcuts.php";

?>