<?php
@date_default_timezone_set ('UTC');

//
//            WW  WW  WW
//            WW  WW  WW
//            WW  WW  WW
//             WWWWWWWW
//     __ __ _ _ _ __  _ __ _  _ 
//     \ V  V / | , , | __ \  V |
//      \_/\_/|_|_|_|_| .__/\_, |
//                    |_|   |___|
//
// ----------------------------------
//
//     Wimpy Playlister
//     7.5.44 2015-10-07
//     www.wimpyplayer.com
//     Copyright Plaino LLC
//
// ----------------------------------





$wimpyVersion = "7.5.44";


// -----------------------------
// Allow Folder Navigation
// -----------------------------
$allowFolderNavigation = true;

// -----------------------------
// Playlist Kind
// -----------------------------
// VALUES
// xml 		- XML playlists allow for cover art images (both folder-based 
//              and file-based) Plus using an XML playlist allows for distinction 
//              between skin files (which are json) and playlist files.
// txt 		- Simple text-based list
// json 	- (Experimental -- may not be supported on your system)
//
$playlistKind = "xml";

// -----------------------------
// Media Types
// -----------------------------
// The kinds of files to search for:
$media_types = "xml,pls,mp4,m4a,m4p,m4v,aac,mp3,wav,json";


// -----------------------------
// HTTP Option
// -----------------------------
// Allows you to run wimpy in "https" mode. We can manually set the values, or set to "auto" 
// to have this script automatically check and set depending on how the file is accessed.
//$httpOption = "http";
//$httpOption = "https";
$httpOption = "auto";

// -----------------------------
// Hide Folders
// -----------------------------
// A list of folder names to ignore.
$hide_folders = "getid3,wimpy.buttons,wimpy.skins,wimpy.test,wimpy.getid3,assets,cgi-bin,_notes,_private,_private,_vti_bin,_vti_cnf,_vti_pvt,_vti_txt";

// -----------------------------
// Hide Files
// ------------------------v
// A list of file names to ignore.
$hide_files = "";

// -----------------------------
// Hide Keywords
// -----------------------------
// Files containing these keywords will be ignored.
$hide_keywords = ""; //wimpy,config,customizer,source,plugin

// -----------------------------
// Coverart Basename
// -----------------------------
// For each folder and sub-folder, you can have a single 
// image that will be used for all files in that folder 
// or sub-folder. 
//
// For example, if you have a folder set up as:
// myFolder/
//		coverart.jpg
//		track1.mp3
//		track2.mp3
// Then all the tracks in "myFolder" will use the "coverart.jpg" file
//
// This setting allows you to specify the filename to look for.
//
// For the sake of flexability, so you can use png or jpg 
// without having to modify this script, we are just defining 
// the "base name" to look for -- the file name without the extension.
//
// For example, the "base name" of this file: coverart.jpg
// is "coverart".
$coverartBasename = "coverart"; 

// -----------------------------
// Find All Media
// -----------------------------
// When set to "true", will recursively search through all subdirectoies. 
$findAllMedia = false; // false true

// -----------------------------
// Quirks Mode
// -----------------------------
// If not using gthe getID3 library, sets titles using the filename, but only shows text "between the dots"
// example: 01.MyTrack.mp3 would display as "MyTrack"
// This allows for files to be manually sorted within the folder.
$quirksmode = false;


// -------------------
// URL Style
// -------------------
// VALUES
// 1 = from the root 	/path/to/file.mp3
// 2 = full URL 		http://www.yoursite.com/path/to/file.mp3
$urlStyle = 2;


// -------------------
// Cross Domain Accessible
// -------------------
// Allows this script to be called from another domain (or local file system).
$allowCrossDomainAccess = true;


// -------------------
// Limit Files
// -------------------
// Limits the number of files that are returned
// -1 = no limit.
// [1-n] = integer representing the maximum number of files that can be returned.
// $limitFiles = 50; // 50 files will be returned.
// $limitFiles = -1; // no limit.
$limitFiles = -1;


// -------------------
// Ignore Folders
// -------------------
// Does not include folders in the returned playlist.
$ignoreFolders = false;

// -------------------
// Encrypt Filenames
// -------------------
// Filenames will not display as traditional URL's rather they will be "base64 encoded.
$encrypt = false;


/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
//
//                IMPORTANT !
//   Wimpy over-rides teh GETID3 options through query-strings
//   (in the $_REQUEST or $_POST). This allows Wimpy to be
//   configure getid3 from the client. 
//  
//   We've left these options for you in case you are using 
//   wimpy.php to retrieve XML playlists and you're 
//   some kind of wizard.
//
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
//
//                MUCHO IMPORTANT-ARINO !
// 
//   You'll need to ensure the "getid3" library is located in 
//   the same folder as this file. The "getid3" library is a
//   folder included in the wimpy downlaod package. The entire
//   folder needs to be "next to" wimpy.php.
//
//   Example:
//   path/to/wimpy.php
//   path/to/getid3/*
//
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////


// -----------------------------
// Get ID3 Info
// -----------------------------
// Requires the getid3 library.
$getID3info = false;

// -----------------------------
// Extract Image
// -----------------------------
// Requires the getid3 library.
// Extracts embedded image from ID3.
// Embedded image must be either PNG or JPG
// May cause playlists to load slowly since the extracted data gets inserted into the playlist as base64'd data.
$getID3image = false;


/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
//
//               IMPORTANTE AMIGO!
//
//   NOTE: Any changes you make to the sorting 
//   options will not translate into the player. 
//   Because Wimpy has it's own built-in sorting 
//   mechanisms on the client-side. 
//   
//   We've left these options for you in case you are using 
//   wimpy.php to retrieve XML playlists and you're 
//   some kind of wizard.
//
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////

// -----------------------------
// Shuffle Files
// -----------------------------
// Randomizes the file list order. (Does not randomize folder lists.)
$shuffle = false;

// -----------------------------
// Sort Order
// -----------------------------
// Sets the sort order for files.
// VALUES
// asc 	- Ascending (A-Z);
// dec 	- Descending (Z-A);
$sortOrder = "asc";



// -----------------------------
// Sort Index
// -----------------------------
// Which field to sort on:
// VALUES
// none 	- don't sort
// date 	- Modification date of the file on the server
// artist 	- GetID3 options must be enabled
// title 	- Generally the "base name" of the file. Or if using GetID3 option, the actual title in the ID3 tag.
// file		- um
// ... any other field present.
// NOTE: When using quirksmode the value set here is overriddden and automatically set to "file"
$sortIndex = "none";



// -----------------------------
if($httpOption=="auto"){$a=false;if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS']=='on') {$a=true;} elseif (!empty($_SERVER['HTTP_X_FORWARDED_PROTO'])


&& $_SERVER['HTTP_X_FORWARDED_PROTO']=='https'


|| !empty($_SERVER['HTTP_X_FORWARDED_SSL'])


&& $_SERVER['HTTP_X_FORWARDED_SSL']=='on') {$a=true;}$httpOption=$a ? 'https' : 'http';}if($quirksmode){$sortIndex="file";}define("newline","\r\n");define("slash",DIRECTORY_SEPARATOR);$b=array();$b['allowFolderNavigation']=$allowFolderNavigation;$b['allowCrossDomainAccess']=$allowCrossDomainAccess;$b['coverartBasename']=$coverartBasename;$b['playlistKind']=$playlistKind;$b['quirksmode']=$quirksmode;$b['urlStyle']=$urlStyle;$b['limitFiles']=$limitFiles;$b['ignoreFolders']=$ignoreFolders;$b['encrypt']=$encrypt;$b['getID3info']=$getID3info;$b['getID3image']=$getID3image;$b['shuffle']=strtolower($shuffle);$b['sortOrder']=strtolower($sortOrder);$b['sortIndex']=$sortIndex;$b['media_types']=explode(",",$media_types);$b['hide_keywords']=explode(",",$hide_keywords);$b['hide_folders']=explode(",",$hide_folders);$b['hide_files']=explode(",",$hide_files);$c=null;if ( @get_magic_quotes_gpc () ){function d ( &$e ){if ( !is_array ( $e ) ){return;}foreach ( $e as $f=>$g ){is_array ( $e[$f] ) ? d ( $e[$f] ) : ( $e[$f]=stripslashes ( $e[$f] ) );}}$h=array ( &$_GET,&$_POST,&$_COOKIE,&$_REQUEST);d ( $h );}function i($j){$k=$j;$k=str_replace("&#","__AMP_PUOND__",$k);$k=str_replace("&","&amp;",$k);$k=str_replace("<","&lt;",$k);$k=str_replace(">","&gt;",$k);$k=str_replace("'","&apos;",$k);$k=str_replace('"',"&quot;",$k);$k=str_replace("__AMP_PUOND__","&#",$k);$k=str_replace("&amp;amp;","&amp;",$k);$k=str_replace("&amp;lt;","&lt;",$k);$k=str_replace("&amp;gt;","&gt;",$k);$k=str_replace("&amp;apos;","&apos;",$k);$k=str_replace("&amp;quot;","&quot;",$k);return $k;}function l($j,$m=false) {global $encrypt;$k=$j;$k=str_replace("&","%26",$k);$k=str_replace("?","%3F",$k);if($encrypt){$k="__1".base64_encode($k);}return $k;}if(@ini_get('safe_mode')){print('<?xml version="1.0"'.urldecode("%3F").'>');print('<playlist>');print('<item>');print('<file>ERROR</file>');print('<title>1. ERROR</title>');print('</item>');print('<item>');print('<file>ERROR</file>');print('<title>2. PHP is running in "Safe Mode".</title>');print('</item>');print('<item>');print('<file>ERROR</file>');print('<title>3. Contact Server Admin to Correct.</title>');print('</item>');print('<item>');print('<file>ERROR</file>');print('<title>4. ------------------</title>');print('</item>');print('<item>');print('<file>ERROR</file>');print('<title>5. You can still use Rave,</title>');print('</item>');print('<item>');print('<file>ERROR</file>');print('<title>6. however all URLs must be</title>');print('</item>');print('<item>');print('<file>ERROR</file>');print('<title>7. entered manually.</title>');print('</item>');print('</playlist>');exit;}function n($o){$p="__:__";$q=str_replace("://",$p,$o);$q=str_replace("\\","/",$q);$q=str_replace("//","/",$q);$q=str_replace($p,"://",$q);if(substr($q,-1)=="/"){$q=substr($q,0,sizeof($q)-1);}return $q;}if(!isset($_SERVER['SCRIPT_NAME'])){$_REQUEST=get_defined_vars();$_SERVER=$r;}$s=explode("/",$_SERVER['PHP_SELF']);$t=array_pop($s);$u['wwwroot']=$httpOption."://".$_SERVER['HTTP_HOST'];$u['www']=$u['wwwroot'].(implode("/",$s));$u['wwwself']=$u['wwwroot'].$_SERVER['PHP_SELF'];if(!@getcwd ()){$v=dirname(__FILE__);}else{$v=getcwd();}$u['sys']=n($v);$w=strrev ( $v );$x=strrev ( y($u['www']) );$z=strrev ( substr($w,strlen($x) ) );$u['sysroot']=$z;function Za($Zb,$Zc){foreach($Zb as $Zd){if(@stristr(strtolower($Zc),strtolower($Zd))){return true;}}return false;}function Ze($Zf,$Zg=false) {global $b;if($Zg){$Zh=$Zg;}else{$Zh=$b['media_types'];}$Zi=array ();if(!$Zf || $Zf==""){$Zf=".";}$Zj=$b['hide_folders'];$Zk=$b['hide_files'];$Zl=$b['hide_keywords'];$Zm=@opendir($Zf);if($Zf){while (false !==($Zn=@readdir($Zm))){if($Zn!='.' && $Zn!='..') {$Zn=$Zf.'/'.str_replace("\\","/",$Zn);$Zo=Zp($Zn);if(is_dir($Zn)) {if(!Za($Zj,$Zo['filename']) && !Za($Zl,$Zo['filename'])){$Zi=array_merge($Zi,Ze($Zn,$Zh));}}else{if(in_array(strtolower($Zo['ext']),$Zh)){if(!Za($Zk,$Zo['filename']) && !Za($Zl,$Zo['filename'])){$Zi[]=$Zn;}}}}}@closedir($Zm);}return $Zi;}function Zq($Zf){global $b;$Zr=array();$Zs=array ();$Zt=array ();$Zi=array ();$Zm=@opendir($Zf);$Zu=$b['media_types'];$Zj=$b['hide_folders'];$Zk=$b['hide_files'];$Zl=$b['hide_keywords'];$Zv=$b['allowFolderNavigation'];if($Zf){while (false !==($Zn=@readdir($Zm))){if($Zn !='.' && $Zn !='..' && substr ($Zn,0,1 ) !="..") {$Zn=$Zf.'/'.str_replace("\\","/",$Zn);$Zo=Zp($Zn);if(is_dir($Zn) && $Zv==true) {if(!Za($Zj,$Zo['filename']) && !Za($Zl,$Zo['filename'])){$Zt[]=$Zn;}}else{if(in_array(strtolower($Zo['ext']),$Zu)){if(!Za($Zk,$Zo['filename']) && !Za($Zl,$Zo['filename'])){$Zi[]=$Zn;}}}}}@closedir($Zm);}$Zs['dirs']=$Zt;$Zs['files']=$Zi;return $Zs;}function Zw ($Zx,$Zy,$Zz,$ZZa=false,$ZZb=false) {if(is_array($Zx) && count($Zx)>0) {foreach(array_keys($Zx) as $f) {$ZZc[$f]=@$Zx[$f][$Zy];}if(!$ZZa) {if ($Zz=='asc'){asort($ZZc);}else{
arsort($ZZc);}}else{if ($ZZb===true) {natsort($ZZc);}else{natcasesort($ZZc);}if($Zz !='asc') {$ZZc=array_reverse($ZZc,true);}}foreach(array_keys($ZZc) as $f) {if (is_numeric($f)) {$ZZd[]=$Zx[$f];}else{$ZZd[$f]=$Zx[$f];}}return $ZZd;}else{return $Zx;}}function ZZe($ZZf,$ZZg=false){print "<pre>";print_r($ZZf);print "</pre>";if($ZZg){exit;}}function ZZh($ZZi){$k="";foreach($ZZi as $f=>$g){$k .="<".$f.">".i(trim($g))."</".$f.">".newline;}return $k;}function ZZj($ZZk,$ZZl=false){global $b,$u;$ZZm=$b['coverartBasename'];$ZZn=utf8_decode(rawurldecode($ZZk));if($ZZl){$ZZo['files']=Ze($ZZn);$ZZo['dirs']=array();}else{$ZZo=Zq($ZZn);}$Zt=array();$Zi=array();$ZZp=array();$ZZq=$b['quirksmode'];$ZZr=$b['getID3info'];$ZZs=$b['getID3image'];if( ! $b['ignoreFolders']){if(sizeof($ZZo['dirs'])>0){$ZZt=$ZZo['dirs'][0];$ZZu=Zp($ZZt);$ZZv=Zp($ZZu['basepath']);$ZZw=ZZx($ZZv['basepath']);for($ZZy=0; $ZZy<sizeof($ZZo['dirs']); $ZZy++){$ZZt=$ZZo['dirs'][$ZZy];$ZZu=Zp($ZZt);$ZZw=ZZx($ZZt);$ZZz=array();$ZZZa="";$ZZz['date']=filemtime($ZZt);$ZZz['file']=$u['wwwself']."?".$ZZZa."d=".l($ZZw,true);$ZZz['image']=ZZZb($ZZt.slash.$ZZm);$ZZz['kind']="xml";if($ZZq){$ZZZc=explode(".",$ZZu['filename']);array_shift($ZZZc);$ZZu['filename']=implode($ZZZc);}$ZZz['title']=preg_replace ('/_/'," ",$ZZu['filename']);$Zt[]=$ZZz;}}}if(sizeof($ZZo['files'])>0){for($ZZy=0; $ZZy<sizeof($ZZo['files']); $ZZy++){$ZZt=$ZZo['files'][$ZZy];$ZZu=Zp($ZZt);$ZZw=ZZx($ZZt);$ZZz=array();$ZZz['date']=filemtime($ZZt);$ZZz['file']=l( $ZZw );$ZZZd=$ZZu['ext'];$ZZz['kind']=$ZZZd;if($ZZr){$ZZZe=ZZZf($ZZt);}else{$ZZZe=array();}if($ZZq){$ZZZc=explode(".",$ZZu['basename']);array_shift($ZZZc);$ZZu['basename']=implode($ZZZc);}foreach($ZZZe as $f=>$g){if($f=='track_number'){$ZZz['index']=$g;} else if($f=='album' || $f=='year'){$ZZz[$f]=$g;}}if(@$ZZZe['artist']){$ZZz['artist']=@$ZZZe['artist'];}if( ! @$ZZZe['artist'] && @$ZZz['band']){$ZZz['artist']=@$ZZz['band'];}$ZZz['title']=(@$ZZZe['title'])? @$ZZZe['title'] : preg_replace ('/_/'," ",$ZZu['basename']);if(@$ZZZe['genre']){$ZZz['genre']=@$ZZZe['genre'];}if( isset($ZZZe['link']) ){$ZZz['link']=$ZZZe['link'];}$ZZZg=ZZZb($ZZu['basepath'].slash.$ZZu['basename']);if( ! $ZZZg ){if( isset($ZZZe['imageExists']) || isset($ZZZe['image'])){$ZZZg=$u['wwwself']."?jj=".l($ZZw,true);}if( ! $ZZZg ){$ZZZg=ZZZb($ZZu['basepath'].slash.$ZZm);}}if($ZZZg){$ZZz['image']=$ZZZg;}if( isset($ZZZe['index']) ){$ZZz['index']=$ZZZe['index'];}$Zi[]=$ZZz;}}if($b['shuffle']==true){shuffle($Zi);
}else{if($b['sortIndex'] !="none"){$ZZZh=$b['sortIndex'];$ZZZi=$b['sortOrder'];$Zi=Zw ($Zi,$ZZZh,$ZZZi,true,false);$Zt=Zw ($Zt,$ZZZh,$ZZZi,true,false);}}$k="";$ZZZj=$b['playlistKind'];if($ZZZj=="xml"){$ZZZk=i(ZZZb($ZZn.slash.$ZZm));$ZZZl="";if($ZZZk){$ZZZl= ' image="'.$ZZZk.'"';}$k="<playlist$ZZZl>".newline;} else if($ZZZj=="json"){$ZZZm=array();$ZZZm["cover"]=$ZZZk;}else{$k="";}if($ZZZj=="json"){$ZZZm["items"]=array();}for($ZZy=0; $ZZy<sizeof($Zt); $ZZy++){if($ZZZj=="xml"){$k .='<item>'.newline;$k .=ZZh($Zt[$ZZy]);$k .="</item>".newline;} else if($ZZZj=="json"){$ZZZm["items"][]=$Zt[$ZZy];}else{$k .=$Zt[$ZZy]['filename'].newline;}}$ZZZn=$b['limitFiles'];if($ZZZn>-1){$Zi=array_slice ($Zi,0,$ZZZn);}for($ZZy=0; $ZZy<sizeof($Zi); $ZZy++){if($ZZZj=="xml"){$k .='<item>'.newline;$k .=ZZh($Zi[$ZZy]);$k .="</item>".newline;} else if($ZZZj=="json"){$ZZZm["items"][]=$Zi[$ZZy];}else{$k .=$Zi[$ZZy]['file'].newline;}}if($ZZZj=="xml"){$k .="</playlist>";} else if($ZZZj=="json"){$k=@json_encode($ZZZm,ZZZo | ZZZp);}if($b['urlStyle']==1){$k=y($k);}@clearstatcache();return $k;}function Zp($ZZZq) {$ZZZq=str_replace("\\","/",$ZZZq);$ZZZr=explode("/",$ZZZq);$ZZZs=array_pop($ZZZr);$ZZZt=explode(".",$ZZZs);$ZZZu=array_pop($ZZZt);$ZZZv=implode(".",$ZZZt);$ZZZw=join("/",$ZZZr);$ZZZx=array();$ZZZx['filename']=$ZZZs;$ZZZx['ext']=$ZZZu;$ZZZx['extension']=$ZZZu;$ZZZx['basename']=$ZZZv;$ZZZx['basepath']=$ZZZw;return $ZZZx;}function ZZZf($ZZZy){global $b,$c;if($b['getID3info'] && $c){if($b['getID3image']){$c->option_save_attachments=true;}else{$c->option_save_attachments=false;}$ZZZz=$c->analyze(urldecode($ZZZy));getid3_lib::CopyTagsToComments($ZZZz);}else{$ZZZz=array();}$k=array();if(sizeof($ZZZz)>0){if(isset($ZZZz['comments_html'])){$ZZZZa=@$ZZZz['comments_html'];foreach($ZZZZa as $f=>$g){if($f=="comment"){$ZZZZb=$ZZZZa["comment"][0];$ZZZZc=@$ZZZZa["encoded_by"][0];if($ZZZZc && stristr ($ZZZZc,"itunes") ){$ZZZZb=@$ZZZz["tags_html"]["id3v2"]["comment"][3];}$k["comment"]=$ZZZZb;}else{$k[$f]=$g[0];}}}if(isset($ZZZz['tags_html'])){if(isset($ZZZz['tags_html']['id3v1'])){if(isset($ZZZz['tags_html']['id3v1']['track'])){$k['index']=@$ZZZz['tags_html']['id3v1']['track'][0];}}if(isset($ZZZz['tags_html']['id3v2'])){if(isset($ZZZz['tags_html']['id3v2']['comment'])){foreach($ZZZz['tags_html']['id3v2']['comment'] as $f=>$g){if(is_string($g)){if(substr($g,0,4)=="http"){$k["link"]=$g;break;}}}}}}if(isset($ZZZz['id3v2']['APIC'][0]['mime'])){$k['imageExists']=1;
}if($b['getID3image']){if(isset($ZZZz['comments']['picture'][0]['data'])){$k['image']=$ZZZz['comments']['picture'][0]['data'];$k['imageMime']=$ZZZz['comments']['picture'][0]['image_mime'];}}}return $k;}function ZZZb($ZZZZd){$k="";$ZZZZe=array("png","jpg","PNG","JPG");for($ZZy=0;$ZZy<count($ZZZZe); $ZZy++){$ZZZd=$ZZZZe[$ZZy];$ZZZZf=$ZZZZd.".".$ZZZd;if (@is_file($ZZZZf)){$k=ZZx($ZZZZf);break;}}return $k;}function ZZZZg($ZZZZh){global $u;$ZZZZi=n(rawurldecode($ZZZZh));$ZZZZj=$ZZZZi;if( substr($ZZZZi,0,4)=="http" ){$ZZZZj=$u['sys'].slash.substr($ZZZZi,strlen($u['www']),strlen($ZZZZi));} else if( substr($ZZZZi,0,1)=="/" ){$ZZZZj=$u['sysroot'].slash.$ZZZZj;} else if( substr($ZZZZi,0,1) !="/" ){$ZZZZj=$u['sys'].slash.$ZZZZj;}$ZZZZj=str_replace("//","/",$ZZZZj);return $ZZZZj;}function ZZx($ZZZZk){global $u,$b;$ZZZZi=n($ZZZZk);$ZZZZj=$u['www'].substr($ZZZZi,strlen($u['sys']),strlen($ZZZZi));if($b['urlStyle']==1){$ZZZZj=y($ZZZZj);}return $ZZZZj;}function y($ZZZZh){global $u;$ZZZZk=str_replace($u['wwwroot'],"",$ZZZZh);return $ZZZZk;}function ZZZZl($ZZZZm,$ZZZs,$ZZZZn) {header("Pragma: public",false);header("Expires: Thu,19 Nov 1981 08:52:00 GMT",false);header("Cache-Control: must-revalidate,post-check=0,pre-check=0",false);header("Cache-Control: no-store,no-cache,must-revalidate",false);header("Cache-Control: private",false);header("Content-Type: ".$ZZZZn);header("Content-Disposition: attachment; filename=\"$ZZZs\"",false);header("Content-Transfer-Encoding: Binary",false);readfile ($ZZZZm);
exit;}function ZZZZo($ZZZZp){global $b;$ZZZZq='<'.urldecode("%3F").'xml version="1.0" encoding="UTF-8"'.urldecode("%3F").'>';header("Pragma: public",false);header("Expires: Thu,19 Nov 1981 08:52:00 GMT",false);header("Cache-Control: must-revalidate,post-check=0,pre-check=0",false); header("Cache-Control: no-store,no-cache,must-revalidate",false);header("Content-Type: text/xml; charset=utf-8",false);if($b['allowCrossDomainAccess']){header('Access-Control-Allow-Credentials: true',false); header('Access-Control-Allow-Origin: *',false);header('Access-Control-Allow-Methods: GET,POST',false);header('Access-Control-Allow-Headers: Content-Type',false);}print ($ZZZZq.$ZZZZp);exit;}function ZZZZr($ZZZZs){global $b;header("Pragma: public",false);header("Expires: Thu,19 Nov 1981 08:52:00 GMT",false);header("Cache-Control: must-revalidate,post-check=0,pre-check=0",false);header("Cache-Control: no-store,no-cache,must-revalidate",false);header("Content-Type: text/plain; charset=utf-8");if($b['allowCrossDomainAccess']){header('Access-Control-Allow-Credentials: true',false); header('Access-Control-Allow-Origin: *',false);header('Access-Control-Allow-Methods: GET,POST',false);header('Access-Control-Allow-Headers: Content-Type',false);}print ($ZZZZs);exit;}function ZZZZt($ZZZZu=false){global $ZZZZv,$b,$c;if ( $ZZZZv["i"] ){$b['getID3info']=true;if ( $ZZZZv["j"] ){$b['getID3image']=true;}}if($b['getID3info']){$ZZZZw='wimpy.getid3'.slash.'getid3.php';if (is_file($ZZZZw)){require ($ZZZZw);} else if(is_file('getid3.php')){require ('getid3.php');}else{$b['getID3info']=false;}}if($b['getID3info']){$c=new getID3;if($ZZZZu){$c->option_save_attachments=true;}}}function ZZZZx ($g) {if( substr($g,0,3)=="__1" ){return base64_decode( substr($g,3,strlen($g)) );}else{return $g;}}function ZZZZy($ZZZZz){$k=rawurldecode($ZZZZz); $k=ZZZZx($k);$k=rawurldecode($k); $k=stripslashes($k);$k=strip_tags($k);$k=str_replace("\\","x",$k);$k=str_replace("..","x",$k);$k=str_replace("./","x",$k);$k=str_replace("/.","x",$k);return $k;}function ZZZZZa(){header("HTTP/1.0 404 Not Found",false);print("<H1>404 Not Found</H1>");exit;}$ZZZZv["d"]=ZZZZy( @$_REQUEST['d'] );$ZZZZv["f"]=ZZZZy( @$_REQUEST["f"] );$ZZZZv["jj"]=ZZZZy( @$_REQUEST["jj"] );$ZZZZv["v"]=isset($_REQUEST["v"]) || array_key_exists("v",$_REQUEST);$ZZZZv["o"]=isset($_REQUEST["o"]) || array_key_exists("o",$_REQUEST);$ZZZZv["i"]=isset($_REQUEST["i"]) || array_key_exists("i",$_REQUEST);$ZZZZv["j"]=isset($_REQUEST["j"]) || array_key_exists("j",$_REQUEST);if($ZZZZv["v"]){print $wimpyVersion;exit;} else if ($ZZZZv["o"]){print "ok";exit;} else if ($ZZZZv["d"]){ZZZZt();$ZZZZZb=ZZZZg($ZZZZv["d"]);if(file_exists ($ZZZZZb)){if($b['playlistKind']=="xml"){header("Content-Type: text/xml; charset=utf-8",false);ZZZZo(ZZj($ZZZZZb,false));}else{header("Content-Type: text/plain; charset=utf-8",false);ZZZZr(ZZj($ZZZZZb,false));}}else{if($b['playlistKind']=="xml"){header("Content-Type: text/xml; charset=utf-8",false);print("<playlist><item><title>ERROR</title></item></playlist>");}else{header("Content-Type: text/plain; charset=utf-8",false);print("ERROR");}}} else if ($ZZZZv["f"]){$ZZZZZc=$ZZZZv["f"];$ZZZZZd=Zp($ZZZZZc);$ZZZZZe=true;if( in_array ($ZZZZZd['ext'],$b['media_types']) ){$ZZZZZb=ZZZZg($ZZZZZc);if( file_exists ($ZZZZZb) ){$ZZZZZe=false;ZZZZl($ZZZZZb,$ZZZZZd['filename'],"application/octet-stream");}}if($ZZZZZe){ZZZZZa();}} else if ($ZZZZv["jj"]){$ZZZZZb=ZZZZg ( $ZZZZv["jj"] );$ZZZZZe=true;if( file_exists ($ZZZZZb) ){$b['getID3info']=true;$b['getID3image']=true;ZZZZt(true);$ZZZe=ZZZf($ZZZZZb);if( isset($ZZZe["image"]) ){$ZZZZZe=false;$ZZZZZf=$ZZZe["image"];$ZZZZn=$ZZZe["imageMime"];header("Content-Type: ".$ZZZZn);echo $ZZZZZf;}else{$ZZZZZg=ZZZb($u['sys'].slash.$b['coverartBasename']);if($ZZZZZg){$ZZZZZe=false;$ZZZZZd=Zp($ZZZZZg);header("Content-Type: image/".$ZZZZZd['ext']);readfile($ZZZZZg);}}}if($ZZZZZe){ZZZZZa();}}else{ZZZZt();if($b['playlistKind']=="xml"){ZZZZo(ZZj($u['sys'],$findAllMedia,false));}else{ZZZZr(ZZj($u['sys'],$findAllMedia,false));}}?>