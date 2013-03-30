# -*- coding: utf-8 -*-
import urllib2, urllib
postdata = urllib.urlencode({
'phone':'8613810945825,8613922201709,8613660849082,8618665593961,8613811748740,8615810411637,8613500001116,861059921813,8613922201798,8613922200937,8613810485022,8613488652651,8613922201956,8613391610672,8613260392015,8613432817354,8613631489991,8613810485776,8613111887114,8613768430002,8613581684955,8613802904578,8613662461732,8613580406667,8615901042155,862028860088,8613366881125,8613902248889,8613632263209,8613922200477,8662774733,8613520084883,8613466621018,8651531508,8613466338386,8613691102323,8662773283,8613810485193,8613581717081,8613570331298,8613632377832,8613466599508,8615120001876,8613581856916,8613922200255,8662783054,8615901041989,8613694214028,8613922273727,862038288552,862038258332,8618820096559,8613811226112,8613810488151,8613922201916,8632045,8613811340153,8613401198509,8613922201805,8615210652654,8613450396758,8613581547646,8613911998150,8613146482131,8615810848400,8613711089999,8613570467796,8613581891867,8613924004110,8613811110968,8613581553457,8613922201809,8613926216866,8613439629069,8613922201587,8613682218361,8618023491076,8613466700120,8613263258079,8613426070045,8613922202775,8613466605176,8613810485882,8613922200065,8613547232,8613560019195,8615800046065,8613922201885,8613910784690,8613760839239,8618610796083,8613710281861,8613718578326,8615907107917,8618602000564,8613763373121,8615210587159,8613426424855,8613810372840,8613432014605',
'sig':'6c00e6ed00391b9e1fd735770a6eb1be41587e97',
'source':2868760879
})

#原始结果
#postdata = urllib.urlencode({
#'phone':'8613810945825,8613922201709,8613660849082,8618665593961,8613811748740,8615810411637,8613500001116,861059921813,8613922201798,8613922200937,8613810485022,8613488652651,8613922201956,8613391610672,8613260392015,8613432817354,8613631489991,8613810485776,8613111887114,8613768430002,8613581684955,8613802904578,8613662461732,8613580406667,8615901042155,862028860088,8613366881125,8613902248889,8613632263209,8613922200477,8662774733,8613520084883,8613466621018,8651531508,8613466338386,8613691102323,8662773283,8613810485193,8613581717081,8613570331298,8613632377832,8613466599508,8615120001876,8613581856916,8613922200255,8662783054,8615901041989,8613694214028,8613922273727,862038288552,862038258332,8618820096559,8613811226112,8613810488151,8613922201916,8632045,8613811340153,8613401198509,8613922201805,8615210652654,8613450396758,8613581547646,8613911998150,8613146482131,8615810848400,8613711089999,8613570467796,8613581891867,8613924004110,8613811110968,8613581553457,8613922201809,8613926216866,8613439629069,8613922201587,8613682218361,8618023491076,8613466700120,8613263258079,8613426070045,8613922202775,8613466605176,8613810485882,8613922200065,8613547232,8613560019195,8615800046065,8613922201885,8613910784690,8613760839239,8618610796083,8613710281861,8613718578326,8615907107917,8618602000564,8613763373121,8615210587159,8613426424855,8613810372840,8613432014605',
#'sig':'6c00e6ed00391b9e1fd735770a6eb1be41587e97',
#'source':2868760879
#})

headers = {
'User-Agent':'%E8%AE%BE%E7%BD%AE/1.0 CFNetwork/609.1.4 Darwin/13.0.0',
'Authorization': 'OAuth oauth_nonce="9074EDFB-392A-47B8-AEDC-0BD7223726F2", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1362750105", oauth_consumer_key="2868760879", oauth_token="5a7130e6335151dbb1d40c5e7fdb39ac", oauth_signature="FO3DZnEErjdpEVDMsTuT6Ys3qV4%3D", oauth_version="1.0"',
'Host':'api.weibo.com',
'Content-Type':'application/x-www-form-urlencoded',
'Accept-Encoding': 'gzip, deflate',
'Accept-Language': 'zh-cn',
'Accept': '*/*'
}

req = urllib2.Request(
url='http://api.weibo.com/2/users/query.json',
data=postdata,
headers=headers
)

result = urllib2.urlopen(req).read()
#print result

import StringIO
compressedstream = StringIO.StringIO(result)   
import gzip
gzipper = gzip.GzipFile(fileobj=compressedstream)      
data = gzipper.read()                                  
print data 


#...
