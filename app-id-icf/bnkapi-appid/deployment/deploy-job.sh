#!/bin/bash


ibmcloud login -a cloud.ibm.com --apikey $devops_apikey -r <your region> -g <your resource group> -o <your org> -s <your space>
cd ./bnkapi-appid 
ibmcloud fn deploy --manifest bnkapi-appid.yml
ibmcloud fn package list
ibmcloud fn action list



