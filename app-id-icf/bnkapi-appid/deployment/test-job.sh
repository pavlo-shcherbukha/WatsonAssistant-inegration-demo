#!/bin/bash
#Invoke tests here

echo ==== LOGIN =======================
ibmcloud login -a cloud.ibm.com --apikey $devops_apikey -r <your region> -g <your resourse group> -o <your org> -s <your space>

echo ================================
echo INVOCE
cd ./bnkapi-appid
 ibmcloud fn action invoke bankapi-appid/getAuthInfo --param-file params/getAuthInfo.json --result
echo ================================