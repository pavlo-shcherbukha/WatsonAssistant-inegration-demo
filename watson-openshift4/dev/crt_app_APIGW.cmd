echo ****************************************
echo *    create API-GATEWAY
echo * 
echo ****************************************
oc delete all -l app=apigateway-wassist
oc new-app http://*******.git#master --context-dir=/ --name="apigateway-wassist" --env-file ./apigateway-wassist.env --strategy=source --source-secret=sinc-gitlab-pvx-1 --image-stream=openshift/nodejs:10

echo ****************************************
echo *    create API-GATEWAY Router
echo * 
echo ****************************************
oc expose svc/apigateway-wassist --hostname="apigateway-wassist-%PRJ-NAME%.apps.your.openshift.domain" --name="apigateway-wassist-%PRJ-NAME%.apps.your.openshift.domain" --port 8080
                                                      