#!/bin/sh

a=0

while [ $a -lt 1000 ]
do
   echo  "Iteration -- > " $a
   phantomjs dem.js http://www.fusioncharts.com/dev/
   a=`expr $a + 1`
done